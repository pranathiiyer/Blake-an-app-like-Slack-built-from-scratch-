# Blake (app-like-Slack-built-from-scratch)
This is an app Blake (akin to slack) built using Java script, React and Flask APIs

This app combines various front-end and back-end techniques to produce a modern, database-backed single-page application. Specifically, it is  significantly smaller in scope version of the popular workplace messaging app Slack.

## Behaviour 
Blake lets users send and read real-time chat messages that are organized into rooms called Channels. Users see a list of all the channels on the server and can click one to enter that channel. Inside, they see all the messages posted to that channel by any user, and can post their own messages. All messages belong to a channel and all channels are visible to all users; we don't need to implement private rooms or direct messages.

Any user can create a new channel by supplying a display name. Channel names must be unique. 

## Running the app

You can download all the required pacckages by running ```pip3 install -r requirements.txt``` in your directory. You can then launch the app by typing ```flask run``` in the terminal. The app can now be accessed in your browser at the URL that Flask prints to the command line, e.g. * Running on http://127.0.0.1:5000/ (Press CTRL+C to quit)
