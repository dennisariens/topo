#!/usr/bin/env python3
"""Build the registered Topo Discovery relief. Requires numpy and Pillow only.

python3 scripts/geography/generate-terrain.py --cache /path/to/scratch/terrain
No runtime/network dependency is added to the app. No geometry is generated:
place the output at SVG x=0 y=0 width=890 height=1235 and clip to original land.
"""
import argparse
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
import hashlib
import io
import json
import math
from pathlib import Path
import platform
import time
import urllib.request

import numpy as np
from PIL import Image, __version__ as pillow_version

from terrain_layers import canonical_land, make_layers

W, H, Z, TILE = 890, 1235, 7, 256
ROOT = Path(__file__).resolve().parents[2]
BASE = 'https://s3.amazonaws.com/elevation-tiles-prod/terrarium'
DOCS = {
    'attribution': 'https://raw.githubusercontent.com/tilezen/joerd/master/docs/attribution.md',
    'data_sources': 'https://raw.githubusercontent.com/tilezen/joerd/master/docs/data-sources.md',
}
STOPS = [0, 100, 250, 500, 800, 1200, 1700, 2200, 2800, 3400, 4200, 5000]
COLORS = ['#c7cb88', '#bdc77c', '#aeb96f', '#a7ad6d', '#b3ac77', '#b7a17a',
          '#c0aa89', '#c9b598', '#d6c6ac', '#e6dcc5', '#f5efdc', '#fff7e7']

RENDER_STOPS = [0, 100, 250, 500, 800, 1200, 1700, 2200, 2500, 3400, 5000]
RENDER_COLORS = ['#63ad62', '#78b56b', '#a5bd61', '#d8bf60', '#c9a34e',
                 '#ae854a', '#926644', '#b39b7c', '#f7f8f6', '#ffffff', '#ffffff']


def sha(data):
    return hashlib.sha256(data).hexdigest()


def fetch(url, path):
    if path.exists():
        return path.read_bytes()
    for attempt in range(3):
        try:
            request = urllib.request.Request(url, headers={'User-Agent': 'TopoDiscovery-terrain-build/1.0'})
            with urllib.request.urlopen(request, timeout=60) as response:
                data = response.read()
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_bytes(data)
            return data
        except Exception:
            if attempt == 2:
                raise
            time.sleep(2 ** attempt)


def world(lon, lat):
    size = TILE * 2 ** Z
    return ((np.asarray(lon) + 180) / 360 * size,
            (1 - np.arcsinh(np.tan(np.radians(lat))) / np.pi) / 2 * size)


def bilinear(array, x, y):
    ix, iy = np.floor(x).astype(int), np.floor(y).astype(int)
    fx, fy = x - ix, y - iy
    assert ix.min() >= 0 and iy.min() >= 0
    assert ix.max() + 1 < array.shape[1] and iy.max() + 1 < array.shape[0]
    return ((1 - fy) * ((1 - fx) * array[iy, ix] + fx * array[iy, ix + 1]) +
            fy * ((1 - fx) * array[iy + 1, ix] + fx * array[iy + 1, ix + 1]))


def smooth(values, radius):
    # Separable floating-point Gaussian: no 8-bit elevation quantization.
    extent = math.ceil(3 * radius)
    offsets = np.arange(-extent, extent + 1)
    weights = np.exp(-offsets ** 2 / (2 * radius ** 2))
    weights /= weights.sum()
    result = values
    for axis in (0, 1):
        padding = [(0, 0), (0, 0)]
        padding[axis] = (extent, extent)
        padded = np.pad(result, padding, mode='edge')
        result = sum(weight * np.take(padded, np.arange(values.shape[axis]) + index, axis=axis)
                     for index, weight in enumerate(weights))
    return result


def main():
    global W, H, Z
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--cache', required=True, type=Path, help='Scratch download directory, outside the repository')
    parser.add_argument('--zoom', type=int, choices=[7, 8], default=7)
    parser.add_argument('--dpr', type=int, choices=[1, 2], default=1)
    parser.add_argument('--style', choices=['original','render'], default='original')
    args = parser.parse_args()
    render = args.style == 'render'
    if render and (args.zoom,args.dpr) != (8,2):
        parser.error('Render requires --zoom 8 --dpr 2')
    Z = args.zoom
    scale = args.dpr
    W, H = 890 * scale, 1235 * scale
    budget = 1000000 if Z == 8 else 220000
    args.cache.mkdir(parents=True, exist_ok=True)
    output = ROOT / ('assets/discovery/terrain-z8.webp' if Z == 8 else 'assets/discovery/terrain.webp')
    if render:
        output = ROOT / 'assets/discovery/terrain-z8-render.webp'
    manifest_path = output.with_name(output.stem + '-provenance.json')
    source_manifest = manifest_path
    if render and not source_manifest.exists():
        source_manifest = ROOT / 'assets/discovery/terrain-z8-provenance.json'
    pinned = json.loads(source_manifest.read_text()) if source_manifest.exists() else None
    if pinned:
        assert pinned['data']['zoom'] == Z
        assert (pinned['output']['width'], pinned['output']['height']) == (W, H), 'Existing output has different DPR'
    expected = {t['url']: t['sha256'] for t in pinned['data']['tiles']} if pinned else {}
    # Exact SVG frame edges; evaluate each destination pixel at its centre.
    west, east = 225.5 / 55, (890 + 225.5) / 55
    north, south = 3830.75 / 77, (3830.75 - 1235) / 77
    lon = ((np.arange(W)[None, :] + 0.5) / scale + 225.5) / 55
    lat = (3830.75 - (np.arange(H)[:, None] + 0.5) / scale) / 77
    wx, wy = world(lon, lat)
    # Source pixels represent cell centres, hence the -0.5 below.
    minx, maxx = math.floor((wx.min() - 1) / TILE), math.floor((wx.max() + 1) / TILE)
    miny, maxy = math.floor((wy.min() - 1) / TILE), math.floor((wy.max() + 1) / TILE)
    jobs = [(x, y) for y in range(miny, maxy + 1) for x in range(minx, maxx + 1)]

    def load(job):
        x, y = job
        url = f'{BASE}/{Z}/{x}/{y}.png'
        data = fetch(url, args.cache / f'{Z}-{x}-{y}.png')
        if pinned:
            assert url in expected and sha(data) == expected[url], f'Source hash mismatch: {url}'
        with Image.open(io.BytesIO(data)) as source:
            assert source.size == (TILE, TILE), url
            rgb = np.asarray(source.convert('RGB'), dtype=float)
        elevation = rgb[..., 0] * 256 + rgb[..., 1] + rgb[..., 2] / 256 - 32768
        return x, y, elevation, {'url': url, 'sha256': sha(data), 'bytes': len(data), 'tile': [Z, x, y]}

    mosaic = np.empty(((maxy - miny + 1) * TILE, (maxx - minx + 1) * TILE))
    sources = []
    with ThreadPoolExecutor(max_workers=8) as pool:
        for x, y, values, record in pool.map(load, jobs):
            mosaic[(y - miny) * TILE:(y - miny + 1) * TILE,
                   (x - minx) * TILE:(x - minx + 1) * TILE] = values
            sources.append(record)
    if pinned:
        assert len(sources) == len(expected), 'Source tile coverage changed'
    dem = bilinear(mosaic, wx - minx * TILE - 0.5, wy - miny * TILE - 0.5)
    assert dem.shape == (H, W) and np.isfinite(dem).all()
    # Bathymetry must not introduce fabricated land shading; the original SVG
    # clip alone defines the actual coastline. This RGB layer has no land mask.
    land = np.maximum(dem, 0)
    height = smooth(land, 0.55 * scale)
    dy, dx = np.gradient(height)
    radius = 6371008.8
    dx /= radius * np.cos(np.radians(lat)) * np.radians(1 / (55 * scale))
    dy /= radius * np.radians(1 / (77 * scale))
    exaggeration = 4.5 if render else 3.0
    nx, ny = -dx * exaggeration, dy * exaggeration  # north is negative image y
    norm = np.sqrt(nx * nx + ny * ny + 1)
    shade = np.zeros_like(height)
    for azimuth, weight in [(315, .65), (270, .20), (45, .15)]:
        az, alt = np.radians(azimuth), np.radians(40)
        shade += weight * np.clip((nx * np.sin(az) * np.cos(alt) +
                                  ny * np.cos(az) * np.cos(alt) + np.sin(alt)) / norm, 0, 1)
    stops, colors = (RENDER_STOPS,RENDER_COLORS) if render else (STOPS,COLORS)
    rgb_stops = np.array([[int(c[i:i + 2], 16) for i in (1, 3, 5)] for c in colors])
    color = np.stack([np.interp(height, stops, rgb_stops[:, c]) for c in range(3)], axis=-1)
    # Broad washes + restrained fine texture, both derived solely from the DEM.
    local_relief = height - smooth(height, 3.0 * scale)
    texture = np.clip(local_relief / 1500, -.035, .035)
    ambient, diffuse, minimum = (.62,.62,.48) if render else (.76,.37,.64)
    lighting = np.clip(ambient + diffuse * shade + texture, minimum, 1.12)
    color *= lighting[..., None]
    color += (1 - lighting[..., None]) * np.array([13, 5, -3])
    image = Image.fromarray(np.uint8(np.clip(color, 0, 255)), mode='RGB')
    output.parent.mkdir(parents=True, exist_ok=True)
    for quality in [86, 82, 78, 74, 70, 66, 60]:
        buffer = io.BytesIO()
        image.save(buffer, format='WEBP', quality=quality, method=6, exact=True)
        encoded = buffer.getvalue()
        if len(encoded) < budget:
            break
    assert len(encoded) < budget, 'WebP budget exceeded'
    dem_name = f'dem-z{Z}-dpr{scale}' + ('-render' if render else '') + '.npy'
    np.save(args.cache / dem_name, dem)
    output.write_bytes(encoded)
    with Image.open(output) as verify:
        assert verify.size == (W, H) and verify.format == 'WEBP'
        verify.load()
    # Geographic sanity checks use true locations, not visual guesses. Nearby
    # maxima account for source resolution and broad pixel footprints at summits.
    checks = []
    for name, lng, latitude, minimum, maximum in [
        ('Mont Blanc / western Alps', 6.865, 45.833, 2500, 4900),
        ('Gran Sasso / central Apennines', 13.565, 42.47, 1400, 3100),
        ('Etna', 14.995, 37.75, 2000, 3500),
        ('Po plain near Ferrara', 11.62, 44.84, -10, 100),
    ]:
        px, py = 55 * lng - 225.5, 3830.75 - 77 * latitude
        ix, iy = int(px * scale), int(py * scale)
        nearby = float(dem[max(0, iy - 2 * scale):iy + 3 * scale, max(0, ix - 2 * scale):ix + 3 * scale].max())
        passed = minimum <= nearby <= maximum
        checks.append({'name': name, 'lon_lat': [lng, latitude], 'svg_xy': [px, py],
                       'nearby_max_elevation_m': nearby, 'expected_range_m': [minimum, maximum], 'passed': passed})
        assert passed, checks[-1]
    documents = []
    for name, url in DOCS.items():
        data = fetch(url, args.cache / f'{name}.md')
        if pinned:
            expected_doc = next(d for d in pinned['data']['documentation'] if d['url'] == url)
            assert sha(data) == expected_doc['sha256'], f'Document hash mismatch: {url}'
        documents.append({'url': url, 'sha256': sha(data), 'bytes': len(data)})
    layers = []
    layer_settings = None
    if render:
        html = (ROOT / 'index.html').read_text()
        rings, paths = canonical_land(html)
        for name, layer in make_layers(rings, scale).items():
            path = output.with_name(f'terrain-z8-render-{name}.webp')
            layer.save(path,format='WEBP',lossless=True,method=6,exact=True)
            data = path.read_bytes()
            with Image.open(path) as decoded:
                decoded.load()
                assert decoded.size == (W,H) and decoded.mode == layer.mode
            layers.append({'role':name,'path':str(path.relative_to(ROOT)),
                           'width':W,'height':H,'mode':layer.mode,
                           'bytes':len(data),'sha256':sha(data),'lossless':True})
        assert len(encoded)+sum(layer['bytes'] for layer in layers) <= budget, 'Combined render layer budget exceeded'
        layer_settings = {'canonical_geometry':'index.html: CONTEXT_LAND, italy, land items; union before styling; no copied coordinates',
                          'canonical_paths_sha256':sha('\n'.join(paths).encode()),
                          'source_html_sha256':sha(html.encode()),
                          'generator_sha256':sha(Path(__file__).with_name('terrain_layers.py').read_bytes()),
                          'white_rim_width_svg_px':1.5,'white_rim_alignment':'centered on land union; circular dilation/erosion kernel',
                          'shadow':{'color':'#153f50','opacity':.28,'dy_svg_px':2,'blur_svg_px':3,'outside_land_only':True},
                          'sea':{'open_water':'#199cd9','coastal_water':'#8cdef1','halo_blur_svg_px':6,'measured_bathymetry':False},
                          'rasterization':'4 samples per SVG pixel, then Lanczos to DPR2; coordinate quantization <=0.25 SVG px per axis; nominal circular rim width 1.5 SVG px',
                          'stack_bottom_to_top':['sea','shadow','terrain clipped to canonical land','coast','existing borders and labels'],
                          'frame':[0,0,890,1235],'independently_switchable':True}
    metadata = {
        'title': 'Topo Discovery geographically registered shaded relief',
        'style':args.style,
        'generated_utc': datetime.now(timezone.utc).isoformat(),
        'output': {'path': str(output.relative_to(ROOT)), 'dpr': scale, 'width': W, 'height': H,
                   'bytes': len(encoded), 'sha256': sha(encoded), 'webp_quality': quality, 'mode': 'RGB'},
        'registration': {'crs': 'WGS84 geographic longitude/latitude (EPSG:4326)',
                         'frame_equations': ['x = 55 * longitude - 225.5', 'y = 3830.75 - 77 * latitude'],
                         'edge_bounds_west_south_east_north': [west, south, east, north],
                         'sample_position': f'pixel centres: SVG ((column+0.5)/{scale}, (row+0.5)/{scale})',
                         'source_crs': 'EPSG:3857 XYZ tiles; analytical inverse/forward Web Mercator',
                         'integration': 'SVG image x=0 y=0 width=890 height=1235, clip with original land shapes; no alpha/coastline/labels/boundaries in raster'},
        'data': {'name': 'Mapzen / Tilezen Terrain Tiles hosted on AWS Open Data', 'zoom': Z,
                 'encoding': 'Terrarium: elevation_metres = R*256 + G + B/256 - 32768',
                 'registry': 'https://registry.opendata.aws/terrain-tiles/',
                 'sources_per_provider_documentation': 'At zoom 7/8: SRTM land (GMTED2010 fallback), ETOPO1 ocean. Not EU-DEM zoom 9.',
                 'license': 'Underlying SRTM, GMTED2010 and ETOPO1 are US government open/public-domain data; see provider attribution document for notices and limitations. No navigation warranty.',
                 'attribution': 'Mapzen Terrain Tiles. SRTM and GMTED2010 terrain data courtesy of the U.S. Geological Survey. Global ETOPO1 terrain data: U.S. National Oceanic and Atmospheric Administration.',
                 'attribution_display': 'Include the attribution above in the app credits/data sources; this metadata alone is not a visible map credit.',
                 'documentation': documents, 'tiles': sources},
        'pipeline': {'resampling': 'Decode to metre DEM before bilinear source pixel-centre sampling; seamless mosaic, no per-tile shade seams.',
                     'hillshade': {'azimuths_degrees_clockwise_from_north': [315, 270, 45], 'weights': [.65, .20, .15], 'altitude_degrees': 40,
                                   'vertical_exaggeration': exaggeration, 'gradient_spacing': 'latitude-aware metres on spherical earth R=6371008.8m'},
                     'palette': [{'elevation_m': e, 'color': c} for e, c in zip(stops, colors)],
                     'lighting':{'ambient':ambient,'diffuse':diffuse,'minimum':minimum,'maximum':1.12},
                     'raw_dem_float64_le_sha256':sha(dem.astype('<f8').tobytes()),
                     'decorative_layers':layers,'decorative_layer_settings':layer_settings,
                     'texture': 'Only actual elevation residual from radius-3px low-pass; no noise, hand-drawn/invented strokes, or external imagery.',
                     'smoothing': '0.55 SVG px Gaussian and 3 SVG px texture low-pass, scaled by DPR; bathymetry clamped to 0m before styling; raw source DEM retained for checks',
                     'runtime_network_requests': False,
                     'reproduce': f'python3 -m pip install numpy==1.24.4 Pillow==10.4.0 && python3 scripts/geography/generate-terrain.py --cache /path/to/scratch/terrain --zoom {Z} --dpr {scale} --style {args.style}',
                     'dependencies': {'python': platform.python_version(), 'numpy': np.__version__, 'Pillow': pillow_version},
                     'generator_sha256': sha(Path(__file__).read_bytes())},
        'validation': {'all_samples_finite': True, 'sample_count': int(dem.size), 'source_tile_count': len(sources),
                       'dem_elevation_range_m': [float(dem.min()), float(dem.max())],
                       'webp_decoded_dimensions_verified': True, 'budget_bytes': budget, 'within_budget': True,
                       'combined_runtime_bytes':len(encoded)+sum(layer['bytes'] for layer in layers),
                       'landmark_checks': checks,
                       'registration_roundtrip_max_error_px': float(max(np.max(np.abs((55 * lon - 225.5) - ((np.arange(W)[None, :] + .5) / scale))),
                                                                      np.max(np.abs((3830.75 - 77 * lat) - ((np.arange(H)[:, None] + .5) / scale)))))},
    }
    if render:
        metadata['creator'] = 'Codex; deterministic NumPy/Pillow rendering of measured terrain'
        metadata['owner_brief'] = {'path':'docs/v3/ARTWORK_BRIEF.md','commit':'8af18a8','section':5}
        metadata['palette_note'] = 'White from approximately 2500m is an elevation color, not observed snow cover.'
    output.with_name(output.stem + '-provenance.json').write_text(json.dumps(metadata, indent=2) + '\n')
    print(json.dumps({'output': str(output), 'bytes': len(encoded), 'tiles': len(sources), 'validation': metadata['validation']}, indent=2))


if __name__ == '__main__':
    main()
