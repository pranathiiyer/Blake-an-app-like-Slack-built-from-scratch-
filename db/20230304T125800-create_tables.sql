--sqlite3 blake.sqlite3 < 20230304T125800-create_tables.sql

create table channels (
    channel_id INTEGER PRIMARY KEY,
    name VARCHAR(30) NOT NULL
);

create table messages (
    message_id INTEGER PRIMARY KEY,
    channel_id INT,
    body TEXT,
    user_id INT,
    replies_to INT,
    FOREIGN KEY (channel_id) REFERENCES channels(channel_id)
);

create table reactions (
    message_id INTEGER,
    user_id INTEGER,
    emoji VARCHAR(30),
    FOREIGN KEY (message_id) REFERENCES messages(message_id),
    FOREIGN KEY (user_id) REFERENCES messages(user_id)
);

create table messages_seen (
    user_id INTEGER,
    channel_id INTEGER,
    message_id INTEGER,
    PRIMARY KEY(user_id, channel_id),
    /*FOREIGN KEY (user_id) REFERENCES messages(user_id),
    FOREIGN KEY (message_id) REFERENCES messages(message_id)*/
);

create table users (
    user_id INTEGER PRIMARY KEY,
    username VARCHAR,
    password VARCHAR,
    session_token VARCHAR(30)
);