const { ipcRenderer } = window.electron.ipcRenderer;
// const axios = window.axios;

// DOM Elements
const projectSelect = document.getElementById("project-select");
const taskInput = document.getElementById("task-input");
const startButton = document.getElementById("start-button");
const pauseButton = document.getElementById("pause-button");
const stopButton = document.getElementById("stop-button");
const timeDisplay = document.getElementById("time-display");
const screenshotToggle = document.getElementById("screenshot-toggle");

// Global variables
let isTracking = false;
let startTime = null;
let pauseTime = null;
let elapsedTime = 0;
let taskId = null;

// Event listeners
projectSelect.addEventListener("change", handleProjectChange);
startButton.addEventListener("click", handleStartClick);
pauseButton.addEventListener("click", handlePauseClick);
stopButton.addEventListener("click", handleStopClick);

// Helper functions
function handleProjectChange() {
  taskId = null;
  taskInput.value = "";
  const projectId = projectSelect.value;
  axios.get(`/tasks?projectId=${projectId}`).then((response) => {
    const tasks = response.data;
    taskInput.innerHTML = "";
    tasks.forEach((task) => {
      const option = document.createElement("option");
      option.value = task.id;
      option.text = task.name;
      taskInput.add(option);
    });
  });
}

function handleStartClick() {
  if (!taskId) {
    return alert("Please select a task before starting the timer");
  }
  if (isTracking) {
    return alert("Timer is already running");
  }
  isTracking = true;
  startTime = Date.now();
  pauseTime = null;
  elapsedTime = 0;
  startButton.disabled = true;
  pauseButton.disabled = false;
  stopButton.disabled = false;
  screenshotToggle.disabled = true;
  setInterval(updateTimeDisplay, 1000);
}

function handlePauseClick() {
  if (!isTracking) {
    return alert("Timer is not running");
  }
  if (pauseTime) {
    return alert("Timer is already paused");
  }
  pauseTime = Date.now();
  isTracking = false;
  pauseButton.disabled = true;
  startButton.disabled = false;
}

function handleStopClick() {
  if (!isTracking && !pauseTime) {
    return alert("Timer is not running");
  }
  isTracking = false;
  startTime = null;
  pauseTime = null;
  elapsedTime = 0;
  startButton.disabled = false;
  pauseButton.disabled = true;
  stopButton.disabled = true;
  screenshotToggle.disabled = false;
}

function updateTimeDisplay() {
  if (isTracking) {
    elapsedTime = Date.now() - startTime;
  } else if (pauseTime) {
    elapsedTime += Date.now() - pauseTime;
    pauseTime = null;
  }
  const hours = Math.floor(elapsedTime / 3600000);
  const minutes = Math.floor((elapsedTime % 3600000) / 60000);
  const seconds = Math.floor((elapsedTime % 60000) / 1000);
  timeDisplay.innerHTML = `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

// Send screenshot message to the main process
function takeScreenshot() {
  ipcRenderer.send("screenshot");
}

// Toggle screenshot feature
screenshotToggle.addEventListener("click", (event) => {
  const isChecked = event.target.checked;
  if (isChecked) {
    setInterval(takeScreenshot, 600000);
    // Set the interval to take a screenshot every 10 minutes
  } else {
    clearInterval(takeScreenshot);
  }
});

// Initialize the project dropdown
axios.get("/projects").then((response) => {
  const projects = response.data;
  projects.forEach((project) => {
    const option = document.createElement("option");
    option.value = project.id;
    option.text = project.name;
    projectSelect.add(option);
  });
});