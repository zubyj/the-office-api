# The Office Script REST API

![The Office API Logo](./client/src/assets/the-office-api-logo.jpg)

Try it out at [theofficescript.com](https://theofficescript.com)

### REST API for getting lines and chatting with characters from NBC's, "The Office"

## Overview

This free to use REST API allows users to interact with the script of NBC's "The Office" by providing access to lines, episodes, and characters. You can search for specific lines, chat with characters, and retrieve random quotes from the series.

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

The frontend is built using Vue.js and serves as a documentation platform for the API. It allows users to understand how to interact with the API and provides examples of API requests.

## Backend

The backend is composed of an Express.js server and a PostgreSQL database:

- he Express.js server listens for API requests at [theofficescript.com](https://theofficescript.com) and serves the static files of the frontend.
The PostgreSQL database contains the entire script of "The Office" organized by season, episode, character, line, etc. It is hosted on AWS RDS.

- The PostgreSQL database contains the entire script of "The Office" organized by season, episode, character, line, etc. It is hosted on AWS RDS.

![API Diagram](/office-api-diagram.png)

- The ExpressJS server also serves the websites static files. Hosted on Heroku

- PostgreSQL database contains the entire script of the office by season, episode, character, line, etc. Hosted on AWS RDS.

## Technologies

ExpressJS, VueJS, PostgreSQL, AWS RDS, Heroku, Google Domains

## How it was built

1. Found JSON of the entire office script. Extracted season, episode, character, line, and id. 

2. Added the script to PostgreSQL database with JSON parameters as columns

3. Migrated the database onto AWS RDS using MySQL workbench. Using the free tier

4. Created an ExpressJS server which listens for GET requests and responds with lines from the show as a JSON object. Used full text search to let users chat with characters from the show. 

5. Created a VueJS website to document the API. 

6. Bought the domain, [theofficescript.com](https://theofficescript.com) to serve my REST API. Also serving the javascript index.html file from the VueJS web app build using ExpressJS
