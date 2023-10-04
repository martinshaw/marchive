const path = require('path');

// Paths used by Webpack configurations which were included in the ERB boilerplate
const rootPath = path.join(__dirname, '../..');

const dllPath = path.join(__dirname, '../dll');

const srcPath = path.join(rootPath, 'src');
const srcMainPath = path.join(srcPath, 'main');
const srcRendererPath = path.join(srcPath, 'renderer');

const releasePath = path.join(rootPath, 'release');
const appPath = path.join(releasePath, 'app');
const appPackagePath = path.join(appPath, 'package.json');
const appNodeModulesPath = path.join(appPath, 'node_modules');
const srcNodeModulesPath = path.join(srcPath, 'node_modules');

const distPath = path.join(appPath, 'dist');
const distMainPath = path.join(distPath, 'main');
const distRendererPath = path.join(distPath, 'renderer');

const buildPath = path.join(releasePath, 'build');

// Paths used by custom Webpack configuration files for non-standard compilation of Marchive source code
const srcDatabaseMigrationsPath = path.join(srcMainPath, 'database', 'migrations');
const distDatabaseMigrationsPath = path.join(distMainPath, 'database', 'migrations');

const srcChildProcessesPath = path.join(srcMainPath, 'app', 'processes');
const distChildProcessesPath = path.join(distMainPath, 'app', 'processes');

export default {
  rootPath,

  dllPath,

  srcPath,
  srcMainPath,
  srcRendererPath,

  releasePath,
  appPath,
  appPackagePath,
  appNodeModulesPath,
  srcNodeModulesPath,

  distPath,
  distMainPath,
  distRendererPath,

  buildPath,

  srcDatabaseMigrationsPath,
  distDatabaseMigrationsPath,

  srcChildProcessesPath,
  distChildProcessesPath,
}
