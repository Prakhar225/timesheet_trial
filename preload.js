// Import the required modules
const { contextBridge, ipcRenderer } = require('electron');
const axios = require("axios");

// Set up a secure context bridge between the renderer and main processes
contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    // Expose the send method of the ipcRenderer module
    send: (channel, data) => {
      ipcRenderer.send(channel, data);
    },
    // Expose the on method of the ipcRenderer module
    on: (channel, func) => {
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    },
  },
  // Expose any additional modules that need to be used in the renderer process
  // For example:
  // fs: require('fs'),
  // os: require('os'),
});
contextBridge.exposeInMainWorld("axios", axios);