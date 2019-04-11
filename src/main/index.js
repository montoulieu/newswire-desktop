'use strict'

import { app, BrowserWindow, TouchBar } from 'electron'
const { TouchBarLabel, TouchBarButton, TouchBarSpacer } = TouchBar

const button = new TouchBarButton({
  label: 'Test'
})

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

const touchBar = new TouchBar([
  button,
  new TouchBarLabel({ label: 'Label' }),
  new TouchBarSpacer({ size: 'small' })
])

function createWindow () {
  mainWindow = new BrowserWindow({
    height: 600,
    width: 1420,
    resizable: false,
    // useContentSize: true,
    darkTheme: true,
    vibrancy: 'ultra-dark',
    transparent: true,
    titleBarStyle: 'hidden',
    webPreferences: {
      webSecurity: false
    }
  })

  // const defaultRatio = 1.9 / 1
  // mainWindow.setAspectRatio(defaultRatio)
  // mainWindow.on('resize', () => {
  //   const ratio = mainWindow.isFullScreen() ? 0 : defaultRatio
  //   mainWindow.setAspectRatio(ratio)
  // })

  mainWindow.loadURL(winURL)
  mainWindow.setTouchBar(touchBar)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
