/* eslint-disable eqeqeq */
/* eslint-disable no-undef */

const path = require('path');
const exec = require('child_process').execSync;
const projectPath = require('./projectPath.js');

// Cria a pasta
const mkDirLog = () => {
  exec(`mkdir "${path.join(projectPath.appPath, '/logs')}"`, err => {
    if (err) {
      console.error('Error mkDirLog', err);
      result = false;
    } else result = true;
  });
};

// Verifica se a pasta existe
const checkFolder = () => {
  let result = false;

  const stdout = exec(`cd "${projectPath.appPath}" && dir`, err => {
    if (err) console.error('Error checkFolder log', err);
  });

  if (stdout.toString('utf8').indexOf('logs') == -1) result = false;
  else result = true;

  console.error('checkFolder log', result);

  if (!result) mkDirLog();
};

module.exports = { checkFolder };
