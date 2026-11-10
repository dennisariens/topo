/* TOPO V3.0 fase B — one set of thin line icons (in the style of SF Symbols), monochrome, 32×32, drawn with the
   stroke of .v3Icon (docs/v3/renders/README.md § Ingetogenheid 4 and § Gedeelde stijl: the fixed nav set).
   Added to the existing V2 sprite (#topoIconSprite) as topo-v3…; decorative only (aria-hidden at use).
   Illustrations (Nino, book, Vespa, pizza, chapter scenes) stay content and never appear as UI icons. */
(function setupV3Icons(){
 'use strict';
 const SVGNS='http://www.w3.org/2000/svg',defs=document.querySelector('#topoIconSprite defs');if(!defs)return;
 const SET={
  // Navigation (fixed): Reis = map · Oefenen = mortarboard · Toets = clipboard · Beloningen = trophy ·
  // Voortgang = bars · Instellingen = gear.
  v3map:'<path d="M4 8.5 11 5.5l10 3 7-3v18l-7 3-10-3-7 3z"/><path d="M11 5.5v18M21 8.5v18"/>',
  v3cap:'<path d="M3 12.5 16 7l13 5.5L16 18z"/><path d="M8.5 15v5.5c0 1.9 3.4 3.5 7.5 3.5s7.5-1.6 7.5-3.5V15M28 13.5v6.5"/>',
  v3test:'<rect x="7" y="5.5" width="18" height="23" rx="3"/><rect x="12" y="3.5" width="8" height="4" rx="1.5"/><path d="m11.5 17.5 3 3 6-6.5"/>',
  v3trophy:'<path d="M10 4.5h12V12a6 6 0 0 1-12 0z"/><path d="M10 7.5H5.5V9a4.5 4.5 0 0 0 4.5 4.5M22 7.5h4.5V9a4.5 4.5 0 0 1-4.5 4.5M16 18v4.5M11 27.5h10M12.5 27.5c0-2.8 1.6-5 3.5-5s3.5 2.2 3.5 5"/>',
  v3progress:'<path d="M4.5 27.5h23"/><rect x="6.5" y="17" width="4.5" height="10.5" rx="1"/><rect x="13.75" y="11" width="4.5" height="16.5" rx="1"/><rect x="21" y="5" width="4.5" height="22.5" rx="1"/>',
  v3gear:'<circle cx="16" cy="16" r="4"/><path d="m16 3.5 2.1 3.1 3.6-1 1 3.6 3.1 2.1-1.6 3.4 1.6 3.4-3.1 2.1-1 3.6-3.6-1-2.1 3.1-2.1-3.1-3.6 1-1-3.6-3.1-2.1 1.6-3.4-1.6-3.4 3.1-2.1 1-3.6 3.6 1z"/>',
  // Forms (R-oefenen-ijk): Ontdekken = binoculars · Aanwijzen = crosshair · Namen schrijven = pencil · Slim rondje = shuffle.
  v3discover:'<circle cx="9" cy="21" r="5"/><circle cx="23" cy="21" r="5"/><path d="M14 20.5h4M4.5 19 8 8h3.5l1 8.5M27.5 19 24 8h-3.5l-1 8.5"/>',
  v3point:'<circle cx="16" cy="16" r="9"/><circle cx="16" cy="16" r="1.8"/><path d="M16 3.5V8M16 24v4.5M3.5 16H8M24 16h4.5"/>',
  v3write:'<path d="M21 5.5 26.5 11 12 25.5H6.5V20z"/><path d="m18 8.5 5.5 5.5"/>',
  v3smart:'<path d="M4 9.5h4.5c6.5 0 8.5 13 15 13H28M4 22.5h4.5c2.6 0 4.2-2.1 5.6-4.8M28 9.5h-4.5c-2.6 0-4.2 2.1-5.6 4.8"/><path d="m24.5 6 3.5 3.5-3.5 3.5M24.5 19l3.5 3.5-3.5 3.5"/>',
  // Actions and status.
  v3play:'<path d="M10.5 7v18l14-9z"/>',
  v3arrow:'<path d="M5 16h21M18.5 8.5 26 16l-7.5 7.5"/>',
  v3again:'<path d="M25.5 16a9.5 9.5 0 1 1-2.8-6.7M25.5 5.5v5h-5"/>',
  v3checkmark:'<path d="m9 16.5 4.6 4.6L23 11.5"/>',
  v3check:'<circle cx="16" cy="16" r="11.5"/><path d="m10.5 16.5 3.7 3.7 7.3-8"/>',
  v3lock:'<rect x="7.5" y="14" width="17" height="13.5" rx="3"/><path d="M11 14v-3.5a5 5 0 0 1 10 0V14"/>',
  v3medal:'<circle cx="16" cy="19.5" r="7.5"/><path d="M11.5 13 8 4.5h5.5l2.5 5.5M20.5 13 24 4.5h-5.5"/><path d="m16 16 1.1 2.3 2.5.4-1.8 1.7.4 2.5-2.2-1.2-2.2 1.2.4-2.5-1.8-1.7 2.5-.4z"/>',
  v3slice:'<path d="M5 6.5c8-3 16-1 22 5L11.5 28z"/><path d="M7 10.5c6.5-2 12.5-.8 17 3"/><circle cx="13.5" cy="15.5" r="1.5"/><circle cx="16.5" cy="21" r="1.3"/><circle cx="19.5" cy="15" r="1.1"/>',
  v3target:'<circle cx="15" cy="17" r="11"/><circle cx="15" cy="17" r="6.5"/><circle cx="15" cy="17" r="2"/><path d="m15 17 9.5-9.5M21 4.5l3.5 3 3-3.5"/>',
  v3scooter:'<circle cx="7.5" cy="23" r="3.5"/><circle cx="24.5" cy="23" r="3.5"/><path d="M11 23h9.5c0-4.2 1.3-7.2 4-9L22.5 6.5H19M4.5 19.5c2.2-3.8 6.2-4.9 10-4l2.5 4.5"/>',
  // Toets resultaat (R-toets-resultaat): copy · mail · print.
  v3copy:'<rect x="11" y="10" width="14" height="17" rx="3"/><path d="M7 21.5V8a3 3 0 0 1 3-3h9.5"/>',
  v3mail:'<rect x="4.5" y="8" width="23" height="17" rx="3"/><path d="m5.5 9.5 10.5 8 10.5-8"/>',
  v3print:'<path d="M9.5 12V5h13v7M9.5 22H6.5a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2h19a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-3"/><rect x="9.5" y="18" width="13" height="9" rx="1"/>',
  v3sheet:'<path d="M8.5 3.5h11l6 6v19h-17z"/><path d="M19.5 3.5v6h6M12.5 15h7M12.5 19h7M12.5 23h4.5"/>',
 };
 for(const [id,d] of Object.entries(SET)){if(document.getElementById('topo-'+id))continue;const s=document.createElementNS(SVGNS,'symbol');s.id='topo-'+id;s.setAttribute('viewBox','0 0 32 32');s.innerHTML=d;defs.append(s);}
})();
