/* eslint-disable consistent-return */
/* eslint-disable eqeqeq */

const exec = require('child_process').execSync;

// Verifica se existe variável de ambiente
const checkEnv = () => {
  let result = false;

  const stdout = exec('set PATH', err => {
    if (err) console.error('Error checkEnv', err);
  });

  if (stdout.toString('utf8').indexOf('xpdf-tools') == -1) result = false;
  else result = true;

  console.log('env:', result);
  return result;
};

// Verifica se a pasta existe
const checkFolder = () => {
  let result = false;

  const stdout = exec('cd "C:\\Program Files (x86)" && dir', err => {
    if (err) console.error('Error checkFolder', err);
  });

  if (stdout.toString('utf8').indexOf('xpdf-tools') == -1) result = false;
  else result = true;

  console.log('folder:', result);
  return result;
};

// Verifica se existe winrar instalado em Program Files
const checkWinrar = () => {
  let result = false;

  try {
    let stdout = exec('cd "%ProgramFiles%\\WinRAR" && dir', err => {
      if (err) return result;
    });
    stdout = stdout.toString('utf8').toLowerCase();

    if (stdout.indexOf('winrar.exe') == -1) result = false;
    else result = true;

    return result;
  } catch (err) {
    return result;
  }
};

// Verifica se existe winrar instalado em Program Files (x86)
const checkWinrarx86 = () => {
  let result = false;

  try {
    let stdout = exec('cd "%ProgramFiles(x86)%\\WinRAR" && dir', err => {
      if (err) return result;
    });
    stdout = stdout.toString('utf8').toLowerCase();

    if (stdout.indexOf('winrar.exe') == -1) result = false;
    else result = true;

    return result;
  } catch (err) {
    return result;
  }
};

// Extrai os arquivos necessários no diretório C:/Arquivos de Programas (x86)
const extract = path => {
  exec(
    `"${path}\\WinRAR\\winrar.exe" x -ibck "${__dirname}\\xpdf-tools.rar" "C:\\Program Files (x86)"`,
    err => {
      if (err) console.log('Error extract', err);
      return err;
    }
  );
};

// Cria variável de ambiente
const setEnv = () => {
  exec(
    `setx /M PATH "C:\\Program Files (x86)\\xpdf-tools\\bin64;%PATH%"`,
    err => {
      if (err) console.log('Error setEnv:', err);
      return err;
    }
  );
};

module.exports = {
  checkFolder,
  checkWinrar,
  checkWinrarx86,
  checkEnv,
  extract,
  setEnv,
};
