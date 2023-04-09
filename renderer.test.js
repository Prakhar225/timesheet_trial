const axios = require("axios");
const {
  updateTimerDisplay,
  formatTime,
  getTimeDifference,
} = require("./renderer");

jest.mock("axios");

describe("updateTimerDisplay", () => {
  test("displays the time in the correct format", () => {
    const time = 3000;
    const timerDisplay = document.createElement("div");
    updateTimerDisplay(time, timerDisplay);
    expect(timerDisplay.innerHTML).toBe("00:03:00");
  });
});

describe("formatTime", () => {
  test("formats the time in the correct format", () => {
    const time = 3600;
    expect(formatTime(time)).toBe("01:00:00");
  });
});

describe("getTimeDifference", () => {
  test("calculates the time difference between two dates", () => {
    const date1 = new Date("2022-04-09T12:00:00Z");
    const date2 = new Date("2022-04-09T14:30:00Z");
    expect(getTimeDifference(date1, date2)).toBe(9000);
  });
});

describe("getProjects", () => {
  test("returns a list of projects", async () => {
    const data = [
      { id: 1, name: "Project 1" },
      { id: 2, name: "Project 2" },
      { id: 3, name: "Project 3" },
    ];

    axios.get.mockResolvedValue({ data });

    const result = await getProjects();
    expect(result).toEqual(data);
  });
});

describe("startTimer", () => {
  test("starts the timer and sets the project ID", async () => {
    const projectId = 1;
    const timerId = 1234;

    axios.post.mockResolvedValue({ data: { id: timerId } });

    const timerDisplay = document.createElement("div");
    const projectSelect = document.createElement("select");
    const startButton = document.createElement("button");

    projectSelect.value = projectId;

    await startTimer(timerDisplay, projectSelect, startButton);

    expect(startButton.disabled).toBe(true);
    expect(projectSelect.disabled).toBe(true);

    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + 60000);

    expect(axios.post).toHaveBeenCalledWith("/timers", {
      project_id: projectId,
      start_time: startTime,
      end_time: endTime,
    });
  });
});

describe("stopTimer", () => {
  test("stops the timer and resets the project ID", async () => {
    const timerId = 1234;
    const projectId = 1;
    const endTime = new Date();

    axios.patch.mockResolvedValue({ data: { id: timerId } });

    const timerDisplay = document.createElement("div");
    const projectSelect = document.createElement("select");
    const startButton = document.createElement("button");

    startButton.disabled = true;
    projectSelect.disabled = true;
    projectSelect.value = projectId;

    await stopTimer(timerDisplay, projectSelect, startButton);

    expect(startButton.disabled).toBe(false);
    expect(projectSelect.disabled).toBe(false);
    expect(projectSelect.value).toBe("");

    expect(axios.patch).toHaveBeenCalledWith(`/timers/${timerId}`, {
      end_time: endTime,
    });
  });
});
