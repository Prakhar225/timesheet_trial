const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { GraphQLClient } = require('graphql-request');

let mainWindow;

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      enableRemoteModule: true,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js")
    }
  });

  mainWindow.loadFile("index.html");

  // Open DevTools - Remove for PRODUCTION!
  mainWindow.webContents.openDevTools();

  return mainWindow;
}

app.on('ready', () => {
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on('start-timer', (event, args) => {
  const { projectId, screenshotInterval } = args;
  // send request to start timer on server via GraphQL API
  const graphQLClient = new GraphQLClient('https://yourserver.com/graphql');
  const query = `mutation {
    startTimer(projectId: "${projectId}") {
      id
      startTime
    }
  }`;
  graphQLClient.request(query)
    .then(data => {
      event.reply('timer-started', data.startTimer.id, data.startTimer.startTime);
      setInterval(() => {
        captureScreenshot(data.startTimer.id);
      }, screenshotInterval * 60 * 1000);
    })
    .catch(error => {
      console.error(error);
    });
});

ipcMain.on('pause-timer', (event, args) => {
  const { timerId } = args;
  // send request to pause timer on server via GraphQL API
  const graphQLClient = new GraphQLClient('https://yourserver.com/graphql');
  const query = `mutation {
    pauseTimer(id: "${timerId}") {
      id
      duration
    }
  }`;
  graphQLClient.request(query)
    .then(data => {
      event.reply('timer-paused', data.pauseTimer.duration);
    })
    .catch(error => {
      console.error(error);
    });
});

ipcMain.on('stop-timer', (event, args) => {
  const { timerId, projectId, taskDurations } = args;
  // send request to stop timer on server via GraphQL API
  const graphQLClient = new GraphQLClient('https://yourserver.com/graphql');
  const query = `mutation {
    stopTimer(id: "${timerId}", projectId: "${projectId}", taskDurations: ${JSON.stringify(taskDurations)}) {
      id
      duration
    }
  }`;
  graphQLClient.request(query)
    .then(data => {
      event.reply('timer-stopped', data.stopTimer.duration);
    })
    .catch(error => {
      console.error(error);
    });
});

function captureScreenshot(timerId) {
  // capture screenshot and send to server via GraphQL API
  const graphQLClient = new GraphQLClient('https://yourserver.com/graphql');
  const query = `mutation {
    addScreenshot(timerId: "${timerId}", screenshot: "data:image/png;base64,...") {
      id
    }
  }`;
  graphQLClient.request(query)
    .then(data => {
      console.log(`Screenshot added to timer ${timerId}`);
    })
    .catch(error => {
      console.error(error);
    });
}
