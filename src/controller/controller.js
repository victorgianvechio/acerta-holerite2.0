/* eslint-disable no-multi-assign */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable no-undef */
/* eslint-disable func-names */

/*
  Carregar todos os scripts de controle
*/

// Carrega JQuery na variável windows.$
window.$ = window.jQuery = require('jquery');

const { remote } = require('electron');
const path = require('path');

require(path.join(__dirname, '../../src/controller/header.js'))(
  window.$,
  remote
);
require(path.join(__dirname, '../../src/controller/mainContent.js'))(
  window.$,
  remote
);
require(path.join(__dirname, '../../src/controller/footer.js'))(window.$);
