# The Office API

REST API for getting lines and chatting with characters from NBC's, "The Office"

# Try it out at [theofficescript.com](https://theofficescript.com)

## Frontend (client folder)

VueJS web app used to document the API

## Backend (server folder)

- REST API using ExpressJS server listens at [theofficescript.com](https://theofficescript.com) for API requests. 

![API Diagram](/office-api-diagram.png)

- The ExpressJS server also serves the websites static files. Hosted on Heroku

- PostgreSQL database contians the entire script of the office by season, episode, character, line, etc. Hosted on AWS RDS.

## Technologies

ExpressJS, VueJS, PostgreSQL, AWS RDS, Heroku, Google Domains
## Inspiration

I found a JSON of the entire office script. I added it to a Postgres database and included the season, episode, line, and character. I then migrated the database onto AWS RDS using 
