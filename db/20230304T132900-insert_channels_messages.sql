-- sqlite3 blake.sqlite3 < 20230304T132900-insert_channels_messages.sql

insert into channels (channel_id,name) values (
    1,
    'web-development'
); 

insert into messages (message_id, channel_id, body, author, user_id, replies_to) values (
    1,
    1,
    'hi guys how are you?',
    'pranathi',
    2,
    NULL
);

insert into reactions (message_id, user_id, emoji) values (
    1,
    2,
    '😃'
);

insert into messages_seen (user_id, channel_id, message_id) values (
    17,1,1
);

/*SELECT * FROM messages m
  LEFT JOIN messages_seen ms ON ms.channel_id = m.channel_id
  WHERE m.user_id  = ms.user_id AND m.message_id = (SELECT max(m.message_id) FROM m)
  