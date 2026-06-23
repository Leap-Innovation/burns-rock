// Mussel Rock — Scriptable widget + Watch complication
// ─────────────────────────────────────────────────────
// Setup:
//   1. Install Scriptable from the App Store (free)
//   2. Paste this script into Scriptable
//   3. Set your GAS_URL below
//   4. Add a Scriptable widget to your iPhone home screen or
//      Watch face (Scriptable complication in Watch app)
// ─────────────────────────────────────────────────────

const GAS_URL   = 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec';
const MA_WINDOW = 10;   // 10-min moving average window
const TIMEZONE  = 'Pacific/Auckland';

// ── Colours ────────────────────────────────────────────
const C = {
  bg:      new Color('#0d1117'),
  bgCard:  new Color('#161b22'),
  blue:    new Color('#58a6ff'),
  orange:  new Color('#f0883e'),
  green:   new Color('#3fb950'),
  muted:   new Color('#8b949e'),
  text:    new Color('#c9d1d9'),
  white:   new Color('#f0f6fc'),
};

// ── Helpers ────────────────────────────────────────────
function movingAvg(arr, n) {
  const slice = arr.slice(-Math.min(n, arr.length));
  return (slice.reduce((a, b) => a + b, 0) / slice.length);
}
function deg2dir(deg) {
  const dirs = ['N','NNE','NE','ENE','E','ESE','SE','SSE',
                'S','SSW','SW','WSW','W','WNW','NW','NNW'];
  return dirs[Math.round(deg / 22.5) % 16];
}
function bearingArrow(deg) {
  return ['↑','↗','→','↘','↓','↙','←','↖'][Math.round(deg / 45) % 8];
}

// ── Fetch wind data ────────────────────────────────────
async function fetchWind() {
  try {
    const req = new Request(`${GAS_URL}?cmd=get_data&hours=1`);
    req.timeoutInterval = 10;
    const json = await req.loadJSON();
    return (json && json.ok && json.data) ? json.data : [];
  } catch (_) { return []; }
}

// ── Fetch swell (Open-Meteo, free) ─────────────────────
async function fetchSwell() {
  try {
    const url = 'https://marine-api.open-meteo.com/v1/marine' +
      '?latitude=-36.773157&longitude=175.027363' +
      '&hourly=wave_height,wave_period,wave_direction' +
      '&timezone=Pacific%2FAuckland&past_days=0&forecast_days=1';
    const req = new Request(url);
    req.timeoutInterval = 10;
    const json = await req.loadJSON();
    if (!json || !json.hourly) return null;
    // Find closest hour to now
    const now = Date.now();
    let best = 0;
    json.hourly.time.forEach((t, i) => {
      if (Math.abs(new Date(t) - now) < Math.abs(new Date(json.hourly.time[best]) - now))
        best = i;
    });
    return {
      height: json.hourly.wave_height[best],
      period: json.hourly.wave_period[best],
      dir:    json.hourly.wave_direction[best],
    };
  } catch (_) { return null; }
}

// ── Build current conditions ───────────────────────────
const [windData, swell] = await Promise.all([fetchWind(), fetchSwell()]);

let windSpeed = null, windGust = null, windDir = null, windDirText = null;
if (windData.length > 0) {
  windSpeed   = movingAvg(windData.map(d => d.ws),   MA_WINDOW);
  windGust    = movingAvg(windData.map(d => d.wmax),  MA_WINDOW);
  const latest = windData[windData.length - 1];
  windDir     = latest.wd;
  windDirText = latest.wdt || deg2dir(latest.wd);
}

// ── Widget family helper ───────────────────────────────
const family = config.widgetFamily || 'small';

// ════════════════════════════════════════════════════════
// ACCESSORY (Watch face complication) — very small
// ════════════════════════════════════════════════════════
if (family === 'accessoryCircular') {
  const w = new ListWidget();
  w.backgroundColor = Color.clear();
  const spd = w.addText(windSpeed != null ? windSpeed.toFixed(0) : '–');
  spd.font = Font.boldRoundedSystemFont(18);
  spd.textColor = C.blue;
  spd.centerAlignText();
  const unit = w.addText('kts');
  unit.font = Font.systemFont(9);
  unit.textColor = C.muted;
  unit.centerAlignText();
  Script.setWidget(w);
  Script.complete();
  return;
}

if (family === 'accessoryRectangular') {
  const w = new ListWidget();
  w.backgroundColor = Color.clear();

  const row1 = w.addText(
    windSpeed != null
      ? `${bearingArrow(windDir)} ${windSpeed.toFixed(1)} kts`
      : '— kts'
  );
  row1.font = Font.boldSystemFont(13);
  row1.textColor = C.white;

  const row2 = w.addText(
    windSpeed != null
      ? `G ${windGust.toFixed(1)}  ${windDirText}`
      : 'No data'
  );
  row2.font = Font.systemFont(11);
  row2.textColor = C.muted;

  if (swell) {
    const row3 = w.addText(`🌊 ${swell.height.toFixed(1)}m  ${swell.period.toFixed(0)}s ${deg2dir(swell.dir)}`);
    row3.font = Font.systemFont(10);
    row3.textColor = C.green;
  }

  Script.setWidget(w);
  Script.complete();
  return;
}

if (family === 'accessoryInline') {
  const w = new ListWidget();
  w.backgroundColor = Color.clear();
  const line = w.addText(
    windSpeed != null
      ? `${bearingArrow(windDir)} ${windSpeed.toFixed(1)} kts G ${windGust.toFixed(1)}`
      : 'Mussel Rock: no data'
  );
  line.font = Font.systemFont(12);
  line.textColor = C.white;
  Script.setWidget(w);
  Script.complete();
  return;
}

// ════════════════════════════════════════════════════════
// SMALL widget (iPhone home screen)
// ════════════════════════════════════════════════════════
if (family === 'small') {
  const w = new ListWidget();
  w.backgroundColor = C.bg;
  w.setPadding(12, 12, 12, 12);
  w.url = GAS_URL; // tap to open dashboard

  const title = w.addText('🌊 Mussel Rock');
  title.font = Font.mediumSystemFont(9);
  title.textColor = C.muted;

  w.addSpacer(6);

  if (windSpeed != null) {
    const arrow = w.addText(`${bearingArrow(windDir)} ${windDirText}`);
    arrow.font = Font.systemFont(11);
    arrow.textColor = C.muted;

    w.addSpacer(2);

    const spd = w.addText(windSpeed.toFixed(1));
    spd.font = Font.boldRoundedSystemFont(34);
    spd.textColor = C.blue;

    const unit = w.addText('kts  G ' + windGust.toFixed(1));
    unit.font = Font.systemFont(11);
    unit.textColor = C.muted;
  } else {
    const na = w.addText('No data');
    na.font = Font.systemFont(13);
    na.textColor = C.muted;
  }

  w.addSpacer();

  if (swell) {
    const swellLine = w.addText(`🌊 ${swell.height.toFixed(1)}m  ${swell.period.toFixed(0)}s`);
    swellLine.font = Font.systemFont(10);
    swellLine.textColor = C.green;
  }

  w.refreshAfterDate = new Date(Date.now() + 5 * 60 * 1000);
  Script.setWidget(w);
  Script.complete();
  return;
}

// ════════════════════════════════════════════════════════
// MEDIUM widget (wider iPhone widget)
// ════════════════════════════════════════════════════════
const w = new ListWidget();
w.backgroundColor = C.bg;
w.setPadding(14, 16, 14, 16);

const hdr = w.addText('🌊 Mussel Rock');
hdr.font = Font.mediumSystemFont(10);
hdr.textColor = C.muted;

w.addSpacer(8);

const stack = w.addStack();
stack.layoutHorizontally();
stack.spacing = 16;

// Wind column
const windCol = stack.addStack();
windCol.layoutVertically();

const wLabel = windCol.addText('WIND');
wLabel.font = Font.boldSystemFont(9);
wLabel.textColor = C.muted;

windCol.addSpacer(2);

if (windSpeed != null) {
  const wSpd = windCol.addText(windSpeed.toFixed(1) + ' kts');
  wSpd.font = Font.boldRoundedSystemFont(22);
  wSpd.textColor = C.blue;

  const wSub = windCol.addText(`G ${windGust.toFixed(1)}  ${bearingArrow(windDir)} ${windDirText}`);
  wSub.font = Font.systemFont(11);
  wSub.textColor = C.muted;
} else {
  const wNa = windCol.addText('–');
  wNa.font = Font.boldSystemFont(22);
  wNa.textColor = C.muted;
}

// Swell column
if (swell) {
  stack.addSpacer();
  const swellCol = stack.addStack();
  swellCol.layoutVertically();

  const sLabel = swellCol.addText('SWELL');
  sLabel.font = Font.boldSystemFont(9);
  sLabel.textColor = C.muted;

  swellCol.addSpacer(2);

  const sHt = swellCol.addText(swell.height.toFixed(1) + ' m');
  sHt.font = Font.boldRoundedSystemFont(22);
  sHt.textColor = C.green;

  const sSub = swellCol.addText(`${swell.period.toFixed(0)}s  ${deg2dir(swell.dir)}`);
  sSub.font = Font.systemFont(11);
  sSub.textColor = C.muted;
}

w.refreshAfterDate = new Date(Date.now() + 5 * 60 * 1000);
Script.setWidget(w);
Script.complete();
