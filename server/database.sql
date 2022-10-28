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

*/
ALTER TABLE lines ADD COLUMN ts tsvector GENERATED ALWAYS AS (to_tsvector('english', line)) STORED;


/*

*/
CREATE EXTENSION fuzzystrmatch;

ALTER TABLE lines ADD COLUMN tslines tsvector GENERATED ALWAYS AS (to_tsvector('simple', line)) STORED;



ALTER TABLE lines ADD COLUMN ts_lines tsvector GENERATED ALWAYS AS (to_tsvector('simple', replace(line, '''', ''))) STORED;

