/* eslint-disable global-require */

// Cria a pasta Logs e o arquivo de conexão .env

const configLog = require('../src/util/configLog.js');
const configEnv = require('../src/util/configEnv.js');

(async () => {
  if (process.env.NODE_ENV === 'production') {
    await configLog.checkFolder();
    await configEnv.checkFile();
  }
  require('dotenv').config();
})();
