CREATE DATABASE office-script;

CREATE TABLE lines(
    line_id SERIAL PRIMARY KEY,
    line VARCHAR(1000),
    speaker VARCHAR(100),
    season integer NOT NULL,
    episode integer NOT NULL
);


/* 
read a random row from the table 
https://tableplus.com/blog/2018/08/postgresql-how-to-quickly-select-a-random-row-from-a-table.html
*/
SELECT
	*
FROM
	lines OFFSET floor(random() * (
		SELECT
			COUNT(*)
			FROM lines))
LIMIT 1;


/*
Vectorizing the lines like this doesnt work well.
*/
ALTER TABLE lines ADD COLUMN ts tsvector GENERATED ALWAYS AS (to_tsvector('english', line)) STORED;
/*
Need to use 'simple' because stop words are important & used often in lines from "The Office".
Lets also get strip apostrophes as tsvector will split the word by the apostrophe.
*/
ALTER TABLE lines ADD COLUMN ts_lines tsvector GENERATED ALWAYS AS (to_tsvector('simple', replace(line, '''', ''))) STORED;


/*
Ask characters questions
*/
/*
Have to make a table for each characters responses. 
*/

CREATE TABLE michaelResponses(
    line_id SERIAL PRIMARY KEY,
    season integer NOT NULL,
    episode integer NOT NULL,
    character VARCHAR(100),
    line VARCHAR(1500),
    response VARCHAR(1500)
);

ALTER TABLE michaelResponses ADD COLUMN ts_lines tsvector GENERATED ALWAYS AS (to_tsvector('simple', replace(line, '''', ''))) STORED;

CREATE TABLE dwightResponses(
    line_id SERIAL PRIMARY KEY,
    season integer NOT NULL,
    episode integer NOT NULL,
    character VARCHAR(100),
    line VARCHAR(1500),
    response VARCHAR(1500)
);

ALTER TABLE michaelResponses ADD COLUMN ts_lines tsvector GENERATED ALWAYS AS (to_tsvector('simple', replace(line, '''', ''))) STORED;

CREATE TABLE jimResponses(
    line_id SERIAL PRIMARY KEY,
    season integer NOT NULL,
    episode integer NOT NULL,
    character VARCHAR(100),
    line VARCHAR(1500),
    response VARCHAR(1500)
);

