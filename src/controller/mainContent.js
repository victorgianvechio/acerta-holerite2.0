/* eslint-disable no-unused-vars */
/* eslint-disable no-constant-condition */
/* eslint-disable no-cond-assign */
/* eslint-disable no-undef */

const ipc = require('electron').ipcRenderer;
const pdf = require('../util/pdfReader.js');
const cfg = require('../util/configEnvironment.js');
const timeout = require('../util/timeout.js');

const generateFile = async ($, remote) => {
  let options = '';
  const outputPath = $('#outputPath').val();
  const filePath = $('#filePath').val();
  const layout = $('#layout').val();

  await pdf
    .proccessPDF(filePath, outputPath, layout)
    .then(v => {
      options = {
        type: 'info',
        title: 'Acerta Holerite',
        message: 'Geração de arquivo realizada com sucesso.',
        detail: outputPath,
      };
    })
    .catch(err => {
      options = {
        type: 'error',
        title: 'Acerta Holerite',
        message: err,
        detail:
          'Log gerado.\nEntrar em contato com o Desenvolvimento de Sistemas.',
      };
    });

  await ipc.send('set-progressbar-completed');
  remote.dialog.showMessageBox(null, options);
};

function setLayouts() {
  const layouts = process.env.LAYOUTS.split(',');
  let selected = 0;

  layouts.forEach(item => {
    if ((selected = 0)) {
      $('#layout').append(`<option selected value="${item}">${item}</option>`);
      selected = 1;
    } else $('#layout').append(`<option value="${item}">${item}</option>`);
  });
}

async function configure(remote) {
  const winrarx86 = await cfg.checkWinrarx86();
  const winrar = await cfg.checkWinrar();
  const envExist = await cfg.checkEnv();
  const folderExist = await cfg.checkFolder();

  const options = {
    type: '',
    title: 'Acerta Holerite',
    message: '',
    detail: '',
  };

  console.log('winrar:', winrar);
  console.log('winrarx86:', winrarx86);
  console.log(
    'winrarPath: ',
    winrar ? '%ProgramFiles%' : '%ProgramFiles(x86)%'
  );

  if (!winrar && !winrarx86) {
    options.type = 'warning';
    options.message = 'Necessário instalar Winrar.';
    remote.dialog.showMessageBox(null, options);
    return;
  }

  options.type = 'info';
  options.message = 'Configuração realizada com sucesso!';

  if (!folderExist) {
    options.detail += '- Dependências instaladas.\n';
    await ipc.send('show-progressbar', 'Instalando dependências');
    await cfg.extract(winrar ? '%ProgramFiles%' : '%ProgramFiles(x86)%');
    await timeout(3000);
    await ipc.send('set-progressbar-completed');
  }

  if (!envExist) {
    options.detail +=
      '- Variável de ambiente criada.\n\nNecessário reiniciar a aplicação.';
    await ipc.send('show-progressbar', 'Configurando variável de ambiente');
    await cfg.setEnv();
    await timeout(3000);
    await ipc.send('set-progressbar-completed');
  }

  if (envExist && folderExist)
    options.message = 'Parâmetros e configurações já realizadas.';

  await timeout(500);
  await remote.dialog.showMessageBox(null, options);
  if (!envExist) await remote.getCurrentWindow().close();
}

function getWindow() {
  return remote.BrowserWindow.getFocusedWindow();
}

function selectFile(remote) {
  const path = remote.dialog.showOpenDialog({
    filters: [{ name: 'PDF', extensions: ['pdf'] }],
    properties: ['openFile'],
  });
  $('#filePath').val(path);
}

function selectOutput(remote) {
  const path = remote.dialog.showOpenDialog({
    properties: ['openDirectory'],
  });
  $('#outputPath').val(path);
}

function validade($, remote) {
  const outputPath = $('#outputPath').val();
  const filePath = $('#filePath').val();
  let isValid = true;

  const options = {
    type: 'error',
    title: 'Acerta Holerite',
    message: 'Preencher campos obrigatórios:',
    detail: '',
  };

  if (filePath === '') {
    options.detail += '- Arquivo \n';
    isValid = false;
  }

  if (outputPath === '') {
    options.detail += '- Diretório';
    isValid = false;
  }

  if (isValid) generateFile($, remote);
  else remote.dialog.showMessageBox(null, options);
}

module.exports = ($, remote) => {
  $('#mainContent').load('../../app/view/components/mainContent.html');

  $(document).ready(() => {
    $('#btnSair').click(() => {
      getWindow().close();
    });

    $('#btnGerar').click(() => {
      validade($, remote);
    });

    $('#btnFile').click(() => {
      selectFile(remote);
    });

    $('#btnOutput').click(() => {
      selectOutput(remote);
    });

    $('#filePath').click(() => {
      selectFile(remote);
    });

    $('#outputPath').click(() => {
      selectOutput(remote);
    });

    $('#btnConfig').click(() => {
      configure(remote);
    });

    setLayouts();
  });
};
