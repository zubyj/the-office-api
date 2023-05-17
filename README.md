# The Office Script REST API

![The Office API Logo](./client/src/assets/the-office-api-logo.jpg)
## [theofficescript.com](https://theofficescript.com)


### REST API for getting lines and chatting with characters from NBC's, "The Office"

<hr />

## Overview

This free to use REST API allows users to interact with the script of NBC's "The Office" by providing access to lines, episodes, and characters. You can search for specific lines, chat with characters, and retrieve random quotes from the series.

### Projects made with this API
* [The Office Reddit bots](reddit.com/u/the-office-bot)

### Frontend
* VueJS

### Backend
* ExpressJS, PostgreSQL, Heroku, AWS RDS, Segment, Google Analytics

<hr />

## Endpoints

### `/random`

- Gets a random line from the entire series

### `/ask/:text`

- Gets a line from a character based on the user's input text

### `/seasons/:season/random`

- Gets a random quote from a given season

### `/seasons/:season/episodes/:episode/characters/:character`

- Gets every line for a given character, season, and episode

## Frontend

### Setting up the Frontend

1. Ensure you have Node.js and npm installed on your system.
2. Navigate to the client folder in the project.
3. Run `npm install` to install the necessary dependencies.
4. Run `npm run serve` to start the development server for the Vue.js app.
5. Now you can access the frontend at `http://localhost:8080`. Any changes you make in the `src` folder will be automatically reflected in the development server.

### Building the Frontend for Production

1. Navigate to the client folder in the project.
2. Run `npm run build` to build the production-ready version of the frontend.
3. This will create a `dist` folder with the optimized assets for the frontend. You can then deploy this folder to a static hosting service like AWS S3, Netlify, or Vercel.

- Both the backend and frontend can be deployed separately.
- The backend can be deployed to any platform that supports Node.js, such as Heroku.

### Main Components

- `App.vue`: The main application component, which includes the main layout and imports other components.
- `Sidebar.vue`: The sidebar navigation component, which allows users to navigate between different API endpoints.
- `RequestForm.vue`: The component responsible for handling user input and displaying the API request and response.
- `ExampleRequest.vue`: A component that displays examples of API requests and responses.

## Backend

The backend is composed of an Express.js server and a PostgreSQL database:

- The Express.js server listens for API requests at [theofficescript.com](https://theofficescript.com) and serves the static files of the frontend.
- The PostgreSQL database contains the entire script of "The Office" organized by season, episode, character, line, etc. It is hosted on AWS RDS.

![API Diagram](/office-api-diagram.png)

### Setting up the Backend

1. Ensure you have Node.js and npm installed on your system.
2. Run `npm install` in the root folder of the project to install dependencies.
3. Set up a PostgreSQL database, either locally or using a cloud provider like AWS RDS.
4. Create a `.env` file in the root folder of the project and add the following variables with your database connection details:

DB_HOST=<your_database_host>
DB_PORT=<your_database_port>
DB_NAME=<your_database_name>
DB_USER=<your_database_user>
DB_PASSWORD=<your_database_password>

vbnet
Copy code

5. Run `npm run migrate` to create the necessary tables in your database.
6. Run `npm run seed` to import the data from `office-script.json` into the database.
7. Run `npm run start` to start the Express.js server.
