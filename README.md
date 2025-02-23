# Barometer App

This is a MERN stack application that displays weather and pressure information for two cities (Vilnius and Nida). The app fetches data from an API and displays it in a user-friendly interface.

The front-end part was done using React.js with TypeScript and the back-end part was done using Node.js and Express.js. MongoDB in this case was not used, since no data was being stored.

Node.js was needed only to act as a full-stack component of the project and fetch weather data from an API.

## Features

- Displays weather information including temperature, wind speed, wind direction, and weather description.
- Displays pressure information and indicates whether the pressure is rising, falling, or is stable.
- Smooth transitions for weather icons and pressure arrow.

## Installation

In order to use this application, follow these steps below in a terminal:

1. Clone the repository:
```
git clone https://github.com/kestutisklimanskas/WeatherApp.git
```
2. Navigate to the front-end directory:
```
cd WeatherApp/frontend
```
3. Install the dependencies:
```
npm install
```
4. Install TypeScript (if not already installed)
```
npm install typescript --save-dev
```
5. Install TypeScript types for React (in case of errors just skip this step)
```
npm install @types/react @types/react-dom --save-dev
```
6. Navigate to the back-end directory:
```
cd ..
cd WeatherApp/backend
```
7. Install the dependencies:
```
npm install
```
8. Create a .env file in the backend folder (if it does not exist upon cloning), and add the following (optional):
```
PORT=5000
```


## Usage

If You have installed everything correctly, the defined .vscode launch options allows to debug both front-end and back-end in Visual Studio Code.

Make sure to open both folders separately (front-end and back-end) in Visual Studio Code and have the aforementioned directories open in
the terminals:

```
cd WeatherApp/backend
```

And

```
cd WeatherApp/frontend
```

1. To start the front-end part of the project, open the folder in Visual Studio Code, create a terminal and use command line given below.
Once the front-end is built, You can use the debug mode (F5), to create a debug instance for the front-end (which will open Chrome):

```
npm start
```

2. To start the back-end, you can either run the command line given below or simply launch a debug instance right off the bat (F5 by default).
Keep in mind, that only one instance can be open (debug mode or with command line) on one PORT:

```
npm start
```

3. Once both instances of front-end and back-end are running, open Your browser and navigate to:
```
http://localhost:3000
```

4. Click one of the two cities and it will fetch weather and pressure data from API.

# Code Overview

Front-end contains a main React component with TypeScript, that renders the weather and pressure information. It includes functions to fetch data from the API, calculate the rotation of the pressure arrow, and render the steps of the barometer, also renders the UI according to the data.

The back-end contains two main files - Server.js, which launches the server and acts as a router to Weather.js file, which stores the function to fetch pressure and weather data of a given city from an API. Used module type for easier syntax.

# Dependencies

  React

  FontAwesome

  TypeScript

  Express.js

  Node.js

# External acknowledgment

Open-Meteo.com for providing weather data through API.

FontAwesome for icons.

OpenWeatherMap for providing icons for weather codes.

Wikimedia used for pictures of Vilnius and Nida on divs.

