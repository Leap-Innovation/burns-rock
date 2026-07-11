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
  NIWA_KEY:    'vCGlyB8VgvPfxiWIyRPCXnQxuWEcielw',                 // optional — get free key at developer.niwa.co.nz
  REFRESH_MIN: 1,                  // auto-refresh interval in minutes
};
