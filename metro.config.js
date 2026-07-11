const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const defaultConfig = getDefaultConfig(__dirname);
const { assetExts, sourceExts } = defaultConfig.resolver;

/**
 * Batasi jumlah operasi async yang jalan bersamaan. Dipakai untuk membungkus
 * cache store Metro: tanpa ini, Metro memanggil store.get() untuk SEMUA modul
 * sekaligus → ribuan `fs.promises.readFile` paralel → EMFILE ("too many open
 * files") di Windows. Dengan limiter, jumlah file terbuka dibatasi jadi aman.
 */
function createLimiter(max) {
  let active = 0;
  const queue = [];
  const drain = () => {
    if (active >= max || queue.length === 0) return;
    active++;
    const { fn, resolve, reject } = queue.shift();
    Promise.resolve()
      .then(fn)
      .then(resolve, reject)
      .finally(() => {
        active--;
        drain();
      });
  };
  return (fn) =>
    new Promise((resolve, reject) => {
      queue.push({ fn, resolve, reject });
      drain();
    });
}

/**
 * Bungkus cache store (interface { get, set, clear }) dengan limiter konkurensi.
 */
function limitStore(store, max) {
  const limit = createLimiter(max);
  return {
    get: (key) => limit(() => Promise.resolve(store.get(key))),
    set: (key, value) => limit(() => Promise.resolve(store.set(key, value))),
    clear: () => store.clear(),
  };
}

const MAX_CONCURRENT_CACHE_IO = 128;

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  transformer: {
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
    getTransformOptions: async () => ({
      transform: {
        inlineRequires: true,
      },
    }),
  },
  resolver: {
    assetExts: assetExts.filter((ext) => ext !== 'svg'),
    sourceExts: [...sourceExts, 'svg'],
  },
};

const finalConfig = mergeConfig(defaultConfig, config);

// Bungkus cache store default supaya I/O cache dibatasi → hindari EMFILE di Windows.
if (Array.isArray(finalConfig.cacheStores)) {
  finalConfig.cacheStores = finalConfig.cacheStores.map((store) =>
    limitStore(store, MAX_CONCURRENT_CACHE_IO),
  );
}

module.exports = finalConfig;
