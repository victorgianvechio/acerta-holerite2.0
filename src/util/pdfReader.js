/* eslint-disable array-callback-return */
/* eslint-disable import/order */
/* eslint-disable no-unused-vars */
/* eslint-disable no-lonely-if */
/* eslint-disable no-await-in-loop */

/*
    Processa o arquivo dividindo por página e extraíndo o texto
    de FIELD_NAME para renomear os arquivos
*/

const extract = require('pdf-text-extract');
const hummus = require('hummus');
const path = require('path');
const fs = require('fs');
const log = require('./logger.js');
const ipc = require('electron').ipcRenderer;

let fieldName = '';
let qtdeChar = '';
let pageName = '';
let maxPage = '';

let fileName = '';
let posName = 0;
let pdfLog = '';
let pdfLog2 = '';
let qtdPagina = 0;

let posPage = '';
let pageNumber = ';';

let posPage2 = '';
let pageNumber2 = ';';

// Deleta os arquivos da pasta
const deleteFiles = async outputFolder => {
  await fs.readdirSync(outputFolder).filter(file => {
    fs.unlinkSync(path.join(outputFolder, file));
  });
};

// Remove todos os espaços e quebras de linhas do pdf
// Disponível em logs/pdf.log
const formatPDF = async page => {
  return new Promise((resolve, reject) => {
    let pdf = page;
    let spaces =
      '                                                                                   ';

    while (spaces.length > 1) {
      pdf = pdf.split(spaces).join(' ');
      spaces = spaces.slice(0, -1);
    }
    pdf = pdf.replace(/\r?\n|\r/g, '');
    resolve(pdf);
  });
};

const proccessPDF = (filePath, outputPath, layout) => {
  const sourcePDF = filePath;
  const outputFolder = outputPath;
  let mensagem = '';
  let pdfWriter = '';

  fieldName = process.env[`FIELD_NAME_${layout.toUpperCase()}`];
  qtdeChar = Number(process.env[`QTDE_CHAR_${layout.toUpperCase()}`]);
  pageName = process.env[`PAGE_NAME_${layout.toUpperCase()}`];
  maxPage = Number(process.env[`MAX_PAGE_${layout.toUpperCase()}`]);

  if (maxPage === undefined) maxPage = 1;

  return new Promise((resolve, reject) => {
    extract(sourcePDF, async (err, pages) => {
      if (err) reject(err);

      log.create();

      if (pages && pages.length >= 2) {
        await ipc.send(
          'show-progressbar',
          'Dividindo e renomeando arquivos',
          false,
          pages.length
        );

        for (let i = 0; i < pages.length; i += 1) {
          qtdPagina = 0;
          pdfLog = await formatPDF(pages[i]);

          posName = pdfLog.indexOf(fieldName) + (fieldName.length + 1);
          fileName =
            fieldName.trim() === ''
              ? `${layout}_${i + 1}`
              : pdfLog.substring(posName, posName + qtdeChar);

          if (fileName.trim().length === qtdeChar) {
            pdfWriter = hummus.createWriter(
              path.join(outputFolder, `${fileName.trim()}.pdf`)
            );

            // Verifica se possuí mais de uma página
            // Verifica se foi configurado a identificação da página
            console.log('if posPage');
            if (pageName !== undefined) {
              posPage = pdfLog.indexOf(pageName) + (pageName.length + 1);
              pageNumber = pdfLog.substring(posPage, posPage + 1);

              console.log('pageNumber', pageNumber);
              for (let j = 1; j < maxPage; j += 1) {
                if (pages[i + 1] === undefined) break;
                pdfLog2 = await formatPDF(pages[i + 1]);
                posPage2 = pdfLog2.indexOf(pageName) + (pageName.length + 1);
                pageNumber2 = pdfLog2.substring(posPage2, posPage2 + 1);

                if (pageNumber === pageNumber2) {
                  console.log('pageNumber2', 'igual');
                  break;
                } else {
                  qtdPagina += 1;
                  console.log('pageNumber2', pageNumber2);
                }
              }
            } else qtdPagina = 0;

            await log.debug(
              `page ${i +
                1}  -\t ${fileName.trim()}.pdf -\t Quant. Paginas ${qtdPagina +
                1}`
            );

            console.log('qtdPagina', qtdPagina);
            console.log('posName', posName);
            console.log('fileName', fileName);
            console.log('pagina pdf', i + 1);

            console.log('\n\n');

            pdfWriter.appendPDFPagesFromPDF(sourcePDF, {
              type: hummus.eRangeTypeSpecific,
              specificRanges: [[i, i + qtdPagina]],
            });

            if (qtdPagina > 0) i += qtdPagina;

            pdfWriter.end();
          } else {
            // Apenas separar sem procurar palavra para renomear
            if (fieldName.trim() === '') {
              pdfWriter = hummus.createWriter(
                path.join(outputFolder, `${fileName.trim()}.pdf`)
              );
              pdfWriter.appendPDFPagesFromPDF(sourcePDF, {
                type: hummus.eRangeTypeSpecific,
                specificRanges: [[i, i]],
              });
              pdfWriter.end();
            } else {
              mensagem = 'Inconsistência encontrada!';
              log.debug('Texto extraído diferente do tamanho definido');
              reject(mensagem);
            }
            // mensagem = 'Inconsistência encontrada!'
            // log.debug('Texto extraído diferente do tamanho definido')
            // reject(mensagem)
          }
          await ipc.send('progressbar-next');
        }
        resolve(mensagem);
      } else {
        mensagem = 'Arquivo inválido.';
        log.debug('Arqivo corrompido, inválido ou possuí apenas uma página.');
        reject(mensagem);
      }
      pdfLog = await formatPDF(pages[0]);
      log.pdf(pdfLog);
    });
  });
};

module.exports = { proccessPDF };
