const path = require('path');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

// One entry per directory this app actually has — see apps/wuzz/metro.config.js
// for the full alias set and why an alias to a folder that doesn't exist yet
// is a trap rather than a convenience.
const aliases = {
  '@core': path.resolve(projectRoot, 'src/core'),
  '@features': path.resolve(projectRoot, 'src/features'),
  '@pages': path.resolve(projectRoot, 'src/pages'),
  '@navigation': path.resolve(projectRoot, 'src/navigation'),
  '@services': path.resolve(projectRoot, 'src/services'),
};

/**
 * Metro configuration, adjusted for the pnpm workspace.
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  resolver: {
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
  watchFolders: [workspaceRoot],
};

module.exports = mergeConfig(getDefaultConfig(projectRoot), config);
