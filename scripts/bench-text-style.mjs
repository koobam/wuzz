/**
 * Benchmarks the JS-thread cost of custom Text style resolution vs a
 * pre-computed flat style (what bare RNText with a static StyleSheet uses).
 *
 * Run: node scripts/bench-text-style.mjs
 */

// ── Mock StyleSheet (mirrors what RN does in production: assign integer IDs) ─
let _id = 1;
const StyleSheet = {
  create: (obj) => {
    const out = {};
    for (const k of Object.keys(obj)) out[k] = _id++;
    return out;
  },
  hairlineWidth: 0.5,
};

// ── Recreate TextStyleWeight & TextStyleType (static, created once) ──────────
const TextStyleWeight = StyleSheet.create({
  light:          { fontWeight: '300', fontFamily: 'Poppins-Light' },
  lightItalic:    { fontWeight: '300', fontFamily: 'Poppins-LightItalic', fontStyle: 'italic' },
  regular:        { fontWeight: '400', fontFamily: 'Poppins-Regular' },
  regularItalic:  { fontWeight: '400', fontFamily: 'Poppins-Italic', fontStyle: 'italic' },
  medium:         { fontWeight: '500', fontFamily: 'Poppins-Medium' },
  mediumItalic:   { fontWeight: '500', fontFamily: 'Poppins-MediumItalic', fontStyle: 'italic' },
  semibold:       { fontWeight: '600', fontFamily: 'Poppins-SemiBold' },
  semiboldItalic: { fontWeight: '600', fontFamily: 'Poppins-SemiBoldItalic', fontStyle: 'italic' },
  bold:           { fontWeight: 'bold', fontFamily: 'Poppins-Bold' },
  boldItalic:     { fontWeight: 'bold', fontFamily: 'Poppins-BoldItalic', fontStyle: 'italic' },
  stylized:       { fontWeight: '400', fontFamily: 'FredokaOne-Regular', fontStyle: 'normal' },
});

const TextStyleType = StyleSheet.create({
  h1: { fontSize: 36, lineHeight: 54 },
  h2: { fontSize: 32, lineHeight: 48 },
  h3: { fontSize: 28, lineHeight: 42 },
  s1: { fontSize: 24, lineHeight: 36 },
  s2: { fontSize: 20, lineHeight: 30 },
  s3: { fontSize: 18, lineHeight: 27 },
  b1: { fontSize: 16, lineHeight: 24 },
  b2: { fontSize: 14, lineHeight: 21 },
  l1: { fontSize: 12, lineHeight: 18 },
  l2: { fontSize: 10, lineHeight: 15 },
  l3: { fontSize: 9,  lineHeight: 13.5 },
});

// ── Exact TextStyle() logic from text.style.tsx ───────────────────────────────
const TextStyle = (props) => {
  const weightStyle = props.weight ? TextStyleWeight[props.weight] : undefined;
  const typeStyle   = props.type   ? TextStyleType[props.type]     : undefined;
  const italicStyle =
    props.italic && props.weight
      ? TextStyleWeight[`${props.weight}Italic`]
      : undefined;
  return StyleSheet.create({
    text: {
      ...weightStyle,
      ...typeStyle,
      ...italicStyle,
      ...(props.fontFamily ? { fontFamily: props.fontFamily } : {}),
      flex:               props.fill ? 1 : undefined,
      color:              props.color,
      textAlign:          props.align,
      textDecorationLine: props.textDecorationLine,
    },
  });
};

// ── Pre-computed flat style (what the RN baseline uses) ───────────────────────
const RN_B2_FLAT = StyleSheet.create({
  text: { fontFamily: 'Poppins-Regular', fontWeight: '400', fontSize: 14, lineHeight: 21 },
}).text;

// ── Benchmark helpers ─────────────────────────────────────────────────────────
const bench = (label, fn, iterations = 1_000_000) => {
  // warmup
  for (let i = 0; i < 10_000; i++) fn();

  const t0 = performance.now();
  for (let i = 0; i < iterations; i++) fn();
  const ms = performance.now() - t0;

  const nsPerOp = (ms * 1e6) / iterations;
  const opsPerSec = (iterations / ms * 1000).toFixed(0);
  console.log(
    `  ${label.padEnd(40)} ${nsPerOp.toFixed(1).padStart(8)} ns/op   ${opsPerSec.padStart(12)} ops/s`
  );
  return nsPerOp;
};

// ── Cached lookup (mirrors getCachedTextStyle) ───────────────────────────
const BASE_WEIGHTS = ['light', 'regular', 'medium', 'semibold', 'bold', 'stylized'];
const RAW_WEIGHT = {
  light:          { fontWeight: '300', fontFamily: 'Poppins-Light' },
  lightItalic:    { fontWeight: '300', fontFamily: 'Poppins-LightItalic', fontStyle: 'italic' },
  regular:        { fontWeight: '400', fontFamily: 'Poppins-Regular' },
  regularItalic:  { fontWeight: '400', fontFamily: 'Poppins-Italic', fontStyle: 'italic' },
  medium:         { fontWeight: '500', fontFamily: 'Poppins-Medium' },
  mediumItalic:   { fontWeight: '500', fontFamily: 'Poppins-MediumItalic', fontStyle: 'italic' },
  semibold:       { fontWeight: '600', fontFamily: 'Poppins-SemiBold' },
  semiboldItalic: { fontWeight: '600', fontFamily: 'Poppins-SemiBoldItalic', fontStyle: 'italic' },
  bold:           { fontWeight: 'bold', fontFamily: 'Poppins-Bold' },
  boldItalic:     { fontWeight: 'bold', fontFamily: 'Poppins-BoldItalic', fontStyle: 'italic' },
  stylized:       { fontWeight: '400', fontFamily: 'FredokaOne-Regular', fontStyle: 'normal' },
};
const RAW_TYPE = {
  b2: { fontSize: 14, lineHeight: 21 },
  b1: { fontSize: 16, lineHeight: 24 },
  h1: { fontSize: 36, lineHeight: 54 },
};
const _cache = new Map();
for (const [type, typeRaw] of Object.entries(RAW_TYPE)) {
  for (const weight of BASE_WEIGHTS) {
    const weightRaw = RAW_WEIGHT[weight];
    _cache.set(`${type}-${weight}`, StyleSheet.create({ text: { ...weightRaw, ...typeRaw } }).text);
    const iRaw = RAW_WEIGHT[`${weight}Italic`];
    if (iRaw) _cache.set(`${type}-${weight}-i`, StyleSheet.create({ text: { ...weightRaw, ...typeRaw, ...iRaw } }).text);
  }
}
const getCachedTextStyle = (type, weight, italic) => {
  const key = italic ? `${type}-${weight ?? 'regular'}-i` : `${type}-${weight ?? 'regular'}`;
  return _cache.get(key);
};

// ── Run ───────────────────────────────────────────────────────────────────────
const ITERS = 1_000_000;

console.log('\n─── Text style resolution benchmark (1 M iterations) ───────────────\n');

const rnTime     = bench('RNText  — static ref (baseline)',             () => RN_B2_FLAT,                                        ITERS);
const oldTime    = bench('Old     — TextStyle({ type:"b2" })',          () => TextStyle({ type: 'b2' }),                         ITERS);
const newTime    = bench('New     — getCachedTextStyle("b2")',          () => getCachedTextStyle('b2', 'regular', false),         ITERS);
const newItTime  = bench('New     — getCachedTextStyle("b2", italic)',  () => getCachedTextStyle('b2', 'regular', true),          ITERS);

console.log('\n─── Summary ────────────────────────────────────────────────────────\n');

const fmt = (n) => n.toFixed(1);
console.log(`  RN baseline             : ${fmt(rnTime)} ns/op`);
console.log(`  Old custom (per render) : ${fmt(oldTime)} ns/op   ×${(oldTime/rnTime).toFixed(0)} slower than RN`);
console.log(`  New custom (Map lookup) : ${fmt(newTime)} ns/op   ×${(newTime/rnTime).toFixed(1)} vs RN`);
console.log(`  New w/ italic           : ${fmt(newItTime)} ns/op`);
console.log(`\n  Speedup old → new       : ×${(oldTime/newTime).toFixed(0)} faster`);
const per100Old = (oldTime  * 100 / 1e6).toFixed(3);
const per100New = (newTime  * 100 / 1e6).toFixed(3);
console.log(`  Old overhead / 100 items: ~${per100Old} ms`);
console.log(`  New overhead / 100 items: ~${per100New} ms\n`);
