export { }

const queries = [
  `CREATE TABLE IF NOT EXISTS trivia(
    player_id INT4 NOT NULL,
    wins INT4 NOT NULL,
    PRIMARY KEY(player_id)
    );`,
  `CREATE TABLE IF NOT EXISTS quotes(
    id INT4 GENERATED ALWAYS AS IDENTITY,
    quote VARCHAR(255) NOT NULL,
    author VARCHAR(40) NOT NULL,
    PRIMARY KEY(id)
    );`,
  `CREATE TABLE IF NOT EXISTS images(
    id INT4 GENERATED ALWAYS AS IDENTITY,
    url VARCHAR(255) NOT NULL,
    PRIMARY KEY(id)
    );`
]

for (const e of queries) {
  await tm.db.query(e)
}
