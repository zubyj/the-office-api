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

