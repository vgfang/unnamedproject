-- uncomment table drops if doing development of schema
DROP TABLE tokens;
DROP TABLE users;

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    discord_id BIGINT UNIQUE,
    username VARCHAR(40) NOT NULL UNIQUE,
    display_name VARCHAR(64),
    email VARCHAR(320) NOT NULL UNIQUE,
    banned_at TIMESTAMPTZ DEFAULT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    type VARCHAR(64) NOT NULL,
    value TEXT NOT NULL,
    session_id VARCHAR(37),
    info JSONB,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, type, session_id)
);
