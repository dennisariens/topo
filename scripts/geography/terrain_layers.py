"""Decorative render layers from the union of canonical land, never a new coastline.

All parameters are in the existing 890x1235 SVG frame. Sea halo is decoration,
not measured bathymetry. Runtime layers remain independently switchable.
"""
import json
import re
import numpy as np
from PIL import Image, ImageChops, ImageDraw, ImageFilter


def canonical_land(html):
    items = json.loads(re.search(r'const ITEMS=(\[.*?\]);\nconst \$', html, re.S).group(1))
    context = json.loads(re.search(r'const CONTEXT_LAND=({.*?});\n', html, re.S).group(1))
    italy = re.search(r'const italy="([^"]+)";', html).group(1)
    paths = list(context.values()) + [italy] + [i['shape'] for i in items if i['id'] in
                ['area-i','area-j','area-k','area-l','area-m','area-a','area-b']]
    rings = []
    for path in paths:
        assert not re.search('[A-KN-Yac-z]', path), 'Unsupported canonical path command'
        for part in path.split('Z'):
            coords = list(map(float, re.findall(r'-?\d+(?:\.\d+)?', part)))
            if coords:
                rings.append(list(zip(coords[::2], coords[1::2])))
    return rings, paths


def make_layers(rings, dpr=2, frame=(890,1235)):
    # Four samples per SVG pixel: a +/-0.75 px morphological rim has an exact
    # nominal width of 1.5 SVG px before downsampling. Union first, so shared
    # country borders do not receive a rim or shadow.
    supersample = 4
    size = tuple(v * supersample for v in frame)
    mask = Image.new('L', size)
    draw = ImageDraw.Draw(mask)
    for ring in rings:
        draw.polygon([(x*supersample-.5,y*supersample-.5) for x,y in ring],fill=255)
    outside = ImageChops.invert(mask)
    halo = ImageChops.multiply(mask.filter(ImageFilter.GaussianBlur(6*supersample))
                              .point(lambda v:min(255,v*2)), outside)
    sea = Image.composite(Image.new('RGB',size,'#8cdef1'),
                          Image.new('RGB',size,'#199cd9'),halo)
    # Pillow Max/MinFilter use square kernels, widening a diagonal rim by sqrt(2).
    # A circular 0.75 SVG px kernel keeps the nominal stroke width isotropic.
    values = np.asarray(mask)
    radius = 3
    padded = np.pad(values, radius, mode='edge')
    dilated, eroded = values.copy(), values.copy()
    for dy in range(-radius,radius+1):
        for dx in range(-radius,radius+1):
            if dx*dx+dy*dy <= radius*radius:
                shifted_values = padded[radius+dy:radius+dy+size[1],
                                        radius+dx:radius+dx+size[0]]
                np.maximum(dilated,shifted_values,out=dilated)
                np.minimum(eroded,shifted_values,out=eroded)
    rim = Image.fromarray(dilated-eroded,mode='L')
    coast = Image.new('RGBA',size,'white')
    coast.putalpha(rim)
    shifted = Image.new('L',size)
    shifted.paste(mask,(0,2*supersample))
    alpha = ImageChops.multiply(shifted.filter(ImageFilter.GaussianBlur(3*supersample)),
                               outside).point(lambda v:round(v*.28))
    shadow = Image.new('RGBA',size,'#153f50')
    shadow.putalpha(alpha)
    output_size = tuple(v*dpr for v in frame)
    return {name:image.resize(output_size,Image.Resampling.LANCZOS)
            for name,image in [('sea',sea),('coast',coast),('shadow',shadow)]}
