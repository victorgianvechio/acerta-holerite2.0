const fs = require('fs');
const util = require('util');
const path = require('path');
const DatePtBR = require('date-pt-br');
const projectPath = require('./projectPath.js');

const logStdout = process.stdout;

const date = new DatePtBR();

date.config({
  delimiterDate: '-',
  delimiterTime: ':',
  sepDateTime: ', ',
  sepDate: ' de ',
  sepTime: ' e ',
});

let logPath = '';
let logFile = '';
let pdfFile = '';

if (process.env.NODE_ENV === 'production')
  logPath = path.join(projectPath.appPath, '/logs');
else if (process.env.NODE_ENV === 'development')
  logPath = path.join(projectPath.devPath, '/logs');

const create = () => {
  logFile = fs.createWriteStream(
    path.join(logPath, `debug-${date.getDate()}.log`),
    {
      flags: 'w',
    }
  );

  pdfFile = fs.createWriteStream(
    path.join(logPath, `pdf-${date.getDate()}.log`),
    {
      flags: 'w',
    }
  );
};

// Gera arquivo de Log com nome extraído
const debug = text => {
  logFile.write(`${util.format(text)}\n`);
  logStdout.write(`${util.format(text)}\n`);
};

// Gera arquivo com o PDF extraído
const pdf = text => {
  pdfFile.write(`${util.format(text)}\n`);
  logStdout.write(`${util.format(text)}\n`);
};

module.exports = { debug, pdf, create };
