if (process.env.NODE_ENV == undefined) process.env.NODE_ENV = 'production'

const { app, BrowserWindow, globalShortcut, ipcMain } = require('electron')
const url = require('url')
const path = require('path')
const ProgressBar = require('electron-progressbar')

require('./scripts/configApp.js')

let mainWindow = ''
let progressBar = ''

function createWindow() {
    mainWindow = new BrowserWindow({
        width: process.env.NODE_ENV === 'production' ? 460 : 1300,
        height: 480, // 480
        show: false,
        webPreferences: {
            nodeIntegration: true
        },
        frame: false,
        transparent: false,
        resizable: false,
        icon: path.join(__dirname, '/app/assets/img/icon/pdf.ico')
    })

    // mainWindow.loadFile('index.html')

    if (process.env.NODE_ENV !== 'production')
        mainWindow.webContents.openDevTools()

    mainWindow.loadURL(
        url.format({
            pathname: path.join(__dirname, '/app/view/index.html'),
            protocol: 'file:',
            slashes: true
        })
    )

    mainWindow.once('ready-to-show', () => {
        mainWindow.show()
    })

    mainWindow.on('closed', () => {
        mainWindow = null
    })
}

function showProgressbar(texto, isIndeterminate, maxValue) {
    if (progressBar) return

    progressBar = new ProgressBar({
        indeterminate: isIndeterminate,
        title: 'Acerta Holerite',
        text: texto,
        detail: 'Aguarde...',
        initialValue: 0,
        maxValue: maxValue,
        options: {
            closeOnComplete: false
        },
        browserWindow: {
            parent: null,
            modal: true,
            resizable: false,
            closable: false,
            minimizable: false,
            maximizable: false,
            width: 400,
            height: 170,
            webPreferences: {
                nodeIntegration: true
            }
        }
    })

    progressBar.on('completed', () => {
        // progressBar.detail = 'Task completed. Exiting...'
        progressBar = null
    })

    progressBar.on('progress', value => {
        progressBar.detail = `Processando ${value} de ${
            progressBar.getOptions().maxValue
        }...`
    })
}

function setProgressbarCompleted() {
    if (progressBar) progressBar.setCompleted()
}

ipcMain.on('show-progressbar', (event, texto, isIndeterminate, maxValue) => {
    showProgressbar(texto, isIndeterminate, maxValue)
})

ipcMain.on('progressbar-next', event => {
    if (progressBar) progressBar.value += 1
})

ipcMain.on('set-progressbar-completed', setProgressbarCompleted)

app.on('ready', () => {
    createWindow()
    globalShortcut.register('CommandOrControl+P', () => {
        mainWindow.webContents.openDevTools()
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
    if (mainWindow === null) createWindow()
})
