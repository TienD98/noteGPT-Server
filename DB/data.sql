CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    username VARCHAR(50),
    password VARCHAR(200)
);

INSERT INTO users(username, password) VALUES ('TIEN', 'CONCAC')