<img src="./client/src/assets/the-office-api-logo.jpg" width="700"/>

# Try it out at [theofficescript.com](https://theofficescript.com)

### REST API for getting lines and chatting with characters from NBC's, "The Office"


## Frontend (client folder)

VueJS web app used to document the API

## Backend (server folder)

- REST API using ExpressJS server listens at [theofficescript.com](https://theofficescript.com) for API requests. 

![API Diagram](/office-api-diagram.png)

- The ExpressJS server also serves the websites static files. Hosted on Heroku

- PostgreSQL database contians the entire script of the office by season, episode, character, line, etc. Hosted on AWS RDS.

## Technologies

ExpressJS, VueJS, PostgreSQL, AWS RDS, Heroku, Google Domains
## What I did

1. Found JSON of the entire office script. Extracted season, episode, character, line, and id. 

2. Added the script to PostgreSQL database with JSON parameters as columns

3. Migrated the database onto AWS RDS using MySQL workbench. Using the free tier

4. Created an ExpressJS server which listens for GET requests and responds with lines from the show as a JSON object. Used full text search to let users chat with characters from the show. 

5. Created a VueJS website to document the API. 

6. Bought the domain, [theofficescript.com](https://theofficescript.com) to serve my REST API. Also serving the javascript index.html file from the  VueJS web app build using ExpressJS