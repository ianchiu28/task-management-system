-- Install the uuid-ossp extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- users
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT uuid_generate_v4(),
    email VARCHAR NOT NULL,
    username VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL,
    salt VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

-- tasks
CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT uuid_generate_v4(),
    user_id INTEGER NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    due_date DATE,
    priority SMALLINT NOT NULL,
    status SMALLINT NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create index for users.uuid
CREATE INDEX idx_users_uuid ON users (uuid);

-- Create index for tasks.uuid
CREATE INDEX idx_tasks_uuid ON tasks (uuid);
