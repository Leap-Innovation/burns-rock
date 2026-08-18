// Burns Rock Wind Monitor — Dashboard Configuration
// Edit this file to change station settings. Do not edit index.html.
const CONFIG = {
  GAS_URL:     'https://script.google.com/macros/s/AKfycbxcySVyh-qi_RS4al9aeRdJeT2cls1fgG8pth3qNMKxij1vaMCwVRwQz6l9is5bHV9R/exec',
  WIND_UNIT:   'kts',              // 'kts' | 'kmh' | 'ms'
  WIND_HOURS:  48,                 // hours of wind history to fetch — must cover
                                   // the largest range button (48h), or long views
                                   // run out of data partway across the chart
  TIMEZONE:    'Pacific/Auckland',
  SITE_NAME:   'Burns Rock',
  LAT:         -36.7732,
  LNG:         175.0274,
  // ── Fleet: one line per deployed unit. The header dropdown selects which unit the
  //    whole dashboard (and the battery page) shows. `id` MUST match the station id the
  //    unit reports (e.g. st-e3820c); lat/lng drive that site's tide/swell/sun. The
  //    SITE_NAME/LAT/LNG above are just the initial fallback — the selected unit wins.
  UNITS: [
    { id: 'st-e3820c', name: 'Burns Rock', lat: -36.7732, lng: 175.0274 },
    // { id: 'st-53a074', name: 'Site Two',   lat: -00.0000, lng: 000.0000 },
  ],
  STATION:     'st-e3820c',        // active unit (overridden by the dropdown / saved choice)
  NIWA_KEY:    '',                 // optional — get free key at developer.niwa.co.nz
  REFRESH_MIN: 1,                  // auto-refresh interval in minutes
};
