//HomoSimulo
//Blake Riojas

  // Modules to control application life and create native browser window
const path = require('path');
const {app, BrowserWindow} = require('electron');
require('dotenv').config();

  //client side of server
const zeromq = require('zeromq');

  //py exe name and paths
const PY_SERVER_EXE = 'server.exe';
const PY_SERVER_EXE_PATH = path.join(__dirname, 'server/dist/server/', PY_SERVER_EXE);
const devServerAvailable = () => {
  return require('fs').existsSync(PY_SERVER_EXE_PATH)
}

  //for running the py server script
const {PythonShell} = require('python-shell');
pyOptions = {
  mode: 'text',
  pythonPath: process.env.PYTHON_PATH
}
const PY_SERVER_SCRIPT = 'server.py';
const PY_SERVER_SCRIPT_PATH = path.join(__dirname, 'server/dev/', PY_SERVER_SCRIPT);
const scriptServerAvailable = () => {
  return require('fs').existsSync(PY_SERVER_SCRIPT_PATH)
}

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      enableRemoteModule: true,
      nodeIntegration: true
    }
  })

  
  if (devServerAvailable()){ //will try to run and connect to latest built dev server.exe first
    require('child_process').execFile(PY_SERVER_EXE_PATH)
    console.log('Launched server via developer-built executable.')
  } else if (scriptServerAvailable()) { //will try python script next if it exists
    PythonShell.run(PY_SERVER_SCRIPT_PATH, pyOptions, function(err, results){
      if (err) throw err;
      console.log("Results: " + results.toString());
    })
    console.log('Launched server via python script.')

  } else{
    //TODO: error handling for missing server
    console.log('Server missing')
  }
  

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()
  
  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
