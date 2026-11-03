const paths={
 today:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.4 1.4m11.2 11.2L19 19M5 19l1.4-1.4M17.6 6.4 19 5"/>',
 all:'<path d="m4 6 1 1 2-2M10 6h10M4 12l1 1 2-2m3 1h10M4 18l1 1 2-2m3 1h10"/>',
 board:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16m6-16v16M5 8h2m4 0h2m4 0h2"/>',
 calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18m-13 4h2m4 0h2"/>',
 projects:'<path d="M3 7a2 2 0 0 1 2-2h5l2 3h7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/>',
 pending:'<circle cx="12" cy="12" r="9"/><path d="M12 7v6l4 2"/>',
 search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4.5 4.5"/>',
 plus:'<path d="M12 5v14M5 12h14"/>',
 refresh:'<path d="M20 7v5h-5M4 17v-5h5"/><path d="M6 7a7 7 0 0 1 12-1l2 6M4 12l2 6a7 7 0 0 0 12-1"/>',
 download:'<path d="M12 3v12m-4-4 4 4 4-4M4 16v5h16v-5"/>',
 theme:'<path d="M20.5 14A9 9 0 0 1 10 3.5 9 9 0 1 0 20.5 14Z"/>',
 logout:'<path d="M9 4H4v16h5m5-4 4-4-4-4m-6 4h13"/>',
 close:'<path d="m6 6 12 12M6 18 18 6"/>',
 menu:'<path d="M4 6h16M4 12h16M4 18h16"/>',
 check:'<path d="m5 12 4 4L19 6"/>',
 filter:'<path d="M4 6h16M7 12h10m-7 6h4"/>',
 alert:'<path d="m12 3 10 18H2Zm0 6v5m0 3h.01"/>',
 arrow:'<path d="M5 12h14m-5-5 5 5-5 5"/>'
};
export function icon(name){return `<svg class="ui-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]||paths.all}</svg>`;}
