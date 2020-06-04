/* eslint-disable eqeqeq */

const path = require('path');
const exec = require('child_process').execSync;
const projectPath = require('./projectPath.js');

// Copia arquivo de configuração com BD
const cpFile = () => {
  exec(
    `xcopy "${path.join(projectPath.rootPath, '/.env')}" "${
      projectPath.appPath
    }"`,
    err => {
      if (err) console.error('Error cpEnv', err);
    }
  );
};

// Verifica se a pasta existe
const checkFile = () => {
  let result = false;

  const stdout = exec(`cd "${projectPath.appPath}" && dir`, err => {
    if (err) console.error('Error checkEnv', err);
  });

  if (stdout.toString('utf8').indexOf('.env') == -1) result = false;
  else result = true;

  if (!result) cpFile();
};

module.exports = { checkFile };
