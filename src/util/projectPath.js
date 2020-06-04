const { rootPath } = require('electron-root-path');
const path = require('path');

const appPath = path.join(rootPath, '../../');
const devPath = path.join(__dirname, '../../');

module.exports = { rootPath, appPath, devPath };
