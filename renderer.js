// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

import { ClientServer } from './client/client.js';
var server = new ClientServer(2000); //TODO: hanlde multi-port selection

const path = require('path');
const electron = require('electron');
const dialog = electron.remote.dialog;

global.filepath = undefined;

var dialogTitle = 'Select a simulo.json to run.';
var dialogButton = 'Start';
var dialogFileName = 'JSON Files';
var dialogFileExtensions = ['json']

document.getElementById('StartSimulo').addEventListener('click',findSimulo)
function findSimulo(){
    if (process.platform !== 'darwin'){
        dialog.showOpenDialog({ 
            title: dialogTitle, 
            //defaultPath: path.join(__dirname, '../assets/'), //TODO: pull from user-config?
            buttonLabel: dialogButton, 
            // Restricting the user to only Text Files. 
            filters: [ 
                { 
                    name: dialogFileName, 
                    extensions: dialogFileExtensions 
                }, ], 
            // Specifying the File Selector Property 
            properties: ['openFile'] 
        }).then(file => { 
            if (!file.canceled) { 
                // Updating the GLOBAL filepath variable to user-selected file. 
                global.filepath = file.filePaths[0].toString(); 
                console.log(global.filepath); 
                server.startSimulo(global.filepath);
            } 
        }).catch(err => { 
            console.log(err) 
        }); 
    }else{
        dialog.showOpenDialog({ 
            title: dialogTitle, 
            //defaultPath: path.join(__dirname, '../assets/'), //TODO: pull from user-config?
            buttonLabel: dialogButton, 
            filters: [ 
                { 
                    name: dialogFileName, 
                    extensions: dialogFileExtensions 
                }, ], 
            // Specifying the File Selector and Directory 
            // Selector Property In macOS 
            properties: ['openFile', 'openDirectory'] 
        }).then(file => { 
            console.log(file.canceled); 
            if (!file.canceled) { 
            global.filepath = file.filePaths[0].toString(); 
            console.log(global.filepath); 
            server.startSimulo(global.filepath);
            } 
        }).catch(err => { 
            console.log(err) 
        }); 
    }    
}
