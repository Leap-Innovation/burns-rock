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
  //    unit reports (e.g. st-e3820c). Per-unit optional fields:
  //      lat/lng  — the site's position. Drives tide + swell + sun. OMIT (or leave out)
  //                 for a unit with no fixed location → tide/swell/sun are hidden for it.
  //                 Must be plain decimals — no leading zeros (-36.77 OK; 00.0000 is a
  //                 JS syntax error that stops the whole dashboard loading).
  //      webcam   — a live-stream embed URL (iframe). OMIT for units with no camera →
  //                 the camera panel is hidden for that unit.
  UNITS: [
    { id: 'st-e3820c', name: 'Burns Rock', lat: -36.7732, lng: 175.0274,
      webcam: 'https://customer-i5pk1zypbotc8vgf.cloudflarestream.com/86a9a0d45a6635fdcc23aa9e3005c3dc/iframe?dvrEnabled=true' },
    { id: 'st-e16b78', name: 'V1.0 prototype' },   // no location, no camera
    { id: 'st-53a074', name: 'Bench tester'   },   // no location, no camera
  ],
  STATION:     'st-e3820c',        // active unit (overridden by the dropdown / saved choice)
  NIWA_KEY:    'bDntgt2IkfNxZwqOv0pk9Tp01Xs0wC0D',   // optional — get free key at developer.niwa.co.nz
  REFRESH_MIN: 1,                  // auto-refresh interval in minutes
};
