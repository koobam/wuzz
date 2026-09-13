const path = require('path');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const defaultConfig = getDefaultConfig(__dirname);
const { assetExts, sourceExts } = defaultConfig.resolver;

// One entry per babel.config.js alias (module-resolver) so a file resolves
// the same way for Metro as it does for Babel/TypeScript.
const aliases = {
  '@features': path.resolve(projectRoot, 'src/features'),
  '@core': path.resolve(projectRoot, 'src/core'),
  '@components': path.resolve(projectRoot, 'src/components'),
  '@pages': path.resolve(projectRoot, 'src/pages'),
  '@http': path.resolve(workspaceRoot, 'libs/api/src'),
  '@mock': path.resolve(projectRoot, 'src/core/mock'),
  '@api': path.resolve(projectRoot, 'src/core/api'),
  '@hooks': path.resolve(projectRoot, 'src/services/hooks'),
  '@navigation': path.resolve(projectRoot, 'src/navigation'),
  '@services': path.resolve(projectRoot, 'src/services'),
  '@utils': path.resolve(projectRoot, 'src/utils'),
  '@assets': path.resolve(projectRoot, 'public/assets'),
  '@icons': path.resolve(projectRoot, 'public/icons'),
  '@fonts': path.resolve(projectRoot, 'public/fonts'),
  '@locales': path.resolve(projectRoot, 'public/locales'),
};

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
    // resolveRequest, not extraNodeModules/resolver.alias: Metro reads an
    // `@`-prefixed specifier like `@navigation/bottom` as a scoped package
    // name, not as alias `@navigation` plus subpath `/bottom`, so those two
    // options never see it. Matching the prefix here and handing Metro an
    // absolute path lets it still do extension/index resolution as usual.
    resolveRequest: (context, moduleName, platform) => {
      for (const [alias, target] of Object.entries(aliases)) {
        if (moduleName === alias || moduleName.startsWith(alias + '/')) {
          const resolved = path.join(target, moduleName.slice(alias.length));
          return context.resolveRequest(context, resolved, platform);
        }
      }
      return context.resolveRequest(context, moduleName, platform);
    },
    nodeModulesPaths: [
      path.resolve(projectRoot, 'node_modules'),
      path.resolve(workspaceRoot, 'node_modules'),
    ],
  },
  // Metro only watches the project directory by default, so an edit in a
  // future libs/* package (or the local packages/wuzz-* nitro modules) would
  // not resolve on a cold start and would not trigger a reload once running.
  watchFolders: [workspaceRoot],
};

const finalConfig = mergeConfig(defaultConfig, config);

// Bungkus cache store default supaya I/O cache dibatasi → hindari EMFILE di Windows.
if (Array.isArray(finalConfig.cacheStores)) {
  finalConfig.cacheStores = finalConfig.cacheStores.map((store) =>
    limitStore(store, MAX_CONCURRENT_CACHE_IO),
  );
}

module.exports = finalConfig;
