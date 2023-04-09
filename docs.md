# Time Tracking App

The Time Tracking App is a desktop application built with Electron JS that allows employees to track their time and switch between projects. The app takes screenshots every 10 minutes to help monitor employee activity and ensure that time is being spent productively.

## Features

- Employee time tracking with the ability to switch between projects
- Screenshot capture every 10 minutes
- Pause/Resume button to pause and resume tracking
- Task management with the ability to add and delete tasks
- Integration with a remote server via GraphQL API

## Installation

To install the app, follow these steps:

1. Download the latest release for your operating system from the [GitHub repository](https://github.com/example/time-tracking/releases).
2. Double-click the downloaded installer file to install the app.
3. Once installed, open the app and log in using your credentials.

## Usage

To use the app, follow these steps:

1. Log in using your credentials.
2. Select a project to begin tracking time for.
3. Click the Start button to start tracking time.
4. Use the Pause/Resume button to pause and resume tracking as needed.
5. Use the Add Task and Delete Task buttons to manage your tasks.
6. When finished, click the Stop button to stop tracking time.

## Configuration

The app can be configured by modifying the `config.json` file located in the app's installation directory. The following options are available:

- `screenshotInterval`: the interval at which screenshots are captured (in milliseconds)
- `apiUrl`: the URL of the remote server's GraphQL API

## Development

To develop the app, follow these steps:

1. Clone the repository: `git clone https://github.com/example/time-tracking.git`.
2. Install dependencies: `npm install`.
3. Start the app in development mode: `npm run start`.
4. Use `npm run build` to build distributable packages for your target platform.

## License

This app is licensed under the MIT License. See the `LICENSE` file for more information.
