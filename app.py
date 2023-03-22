import logging
import string
import traceback
import random
import sqlite3
import json
from datetime import datetime
from flask import Flask, render_template, request, jsonify, redirect, make_response,g
from functools import wraps

app = Flask(__name__)
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0


@app.route('/')
@app.route('/login')
def index():
    return app.send_static_file('index.html')

def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect('db/blake.sqlite3')
        db.row_factory = sqlite3.Row
        setattr(g, '_database', db)
    return db

@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

def query_db(query, args=(), one=False):
    db = get_db()
    cursor = db.execute(query, args)
    print("query_db")
    print(cursor)
    rows = cursor.fetchall()
    print(rows)
    db.commit()
    cursor.close()
    if rows:
        if one: 
            return rows[0]
        return rows
    return None

def new_user():
    name = "Unnamed User #" + ''.join(random.choices(string.digits, k=6))
    password = ''.join(random.choices(string.ascii_lowercase + string.digits, k=10))
    session_token = ''.join(random.choices(string.ascii_lowercase + string.digits, k=40))
    u = query_db('insert into users (username, password, session_token) ' + 
        'values (?, ?, ?) returning user_id, username, password, session_token',
        (name, password, session_token),
        one=True)
    return u

def get_user_from_cookie(request):
    user_id = request.cookies.get('user_id')
    password = request.cookies.get('user_password')
    if user_id and password:
        return query_db('select * from users where user_id = "?" and password = "?"', [user_id, password], one=True)
    return None

def render_with_error_handling(template, **kwargs):
    try:
        return render_template(template, **kwargs)
    except:
        t = traceback.format_exc()
        return render_template('error.html', args={"trace": t}), 500
# -------------------------------- API ROUTES ----------------------------------

# end point to login
@app.route('/api/login', methods=['POST'])
def login ():
    
    body = request.get_json()
    
    username = body['username']
    password = body['password']
    
    u = query_db('select * from users where username = ? and password = ?', [username, password], one=True)
    if u:
        data = json.dumps({'session_token':u['session_token']})
        return jsonify(data)

    return {}, 403

# end point to get the list of channels associates with a user
@app.route('/api/channels', methods=['GET'])
def get():
    
    data = request.headers.get('session_token')
    
    user = query_db("select * from users where session_token = ?",[data])
    if not user:
        return {}, 403
    user_id = user[0]['user_id']
    
    channels = query_db('SELECT name, channels.channel_id from channels left join \
                             messages_seen ON  channels.channel_id = messages_seen.channel_id where \
                             messages_seen.user_id = ?',[user_id])
    
    channel_names = []
    channel_ids = []
    for ch in channels:
        channel_names.append(ch[0])
        channel_ids.append(ch[1])
     
    channels = json.dumps({'names': channel_names, 'ids':channel_ids})

    return jsonify(channels)


# END POINT TO GET OR POST MESSAGES IN A CHANNEL
@app.route('/api/<int:channel_id>/messages', methods =['GET', 'POST'])
def get_messages(channel_id):
    data = request.headers.get('session_token')
    user = query_db("select * from users where session_token = ?",[data])
    
    if not user:
        return {}, 403
    user_id = user[0]['user_id']
    author = user[0]['username']
    if request.method == 'GET':  
        messages = query_db("SELECT body, message_id, messages.user_id, \
                            replies_to, users.username from messages left join users on \
                            messages.user_id=users.user_id where messages.channel_id = ?", [channel_id])
        
        data = []
        user_names = []
        ids = []
        if messages is None:
            return jsonify(json.dumps({'author':[], 'body':[],'id':[]}))
        for row in messages:
                t = (row[0])
                t1 = (row[1])
                t2 = (row[4])
                data.append(t)
                user_names.append(t2)
                ids.append(t1)
        
        data = json.dumps({'author':user_names,'body': data, 'id':ids})
        
        return jsonify(data)
    if (request.method) == 'POST':
       
        content = request.json.get('body')
        messages = query_db('INSERT INTO messages (user_id, channel_id, body) VALUES (?, ?, ?)',
                       [user_id, channel_id, content])
        
        data = {'messages' :messages}
        
        return jsonify(data)

 # end point to create a channel   
@app.route('/api/add_channel', methods = ['POST'])
def add_channel():
    data = request.headers.get('session_token')
    user = query_db("select * from users where session_token = ?",[data])
    user_id = user[0]['user_id']
    channel_name = request.json.get('name')
    if not user:
        return {}, 403
    channel = query_db('INSERT into channels (name) values (?)',[channel_name])
    channel_id = query_db('SELECT channel_id FROM channels WHERE name = ?',[channel_name])
    channels_seen = query_db('INSERT into messages_seen (channel_id, user_id, message_id) values (?,?,?)',[channel_id[0]['channel_id'], user_id,0])
    data = json.dumps({'channel_id':channel_id[0]['channel_id'],'user_id':user_id})
    return data


# end point to sign up
@app.route('/api/signup', methods=['GET', 'POST'])
def signup():
    
    data = request.headers.get('session_token')
    
    user = query_db("select * from users where session_token = ?",[data])

    if user:
        print('you already exist')
        #return render_with_error_handling('signup.html', user=user) # redirect('/')
    if request.method == 'POST':
        u = new_user()
        print("u")
        print(u)
        for key in u.keys():
            print(f'{key}: {u[key]}')

        data = json.dumps({'username':u['username'],'password': u['password'], 'session_token':u['session_token']})
        
        return jsonify(data)
    
    return redirect('/login')

# end point to update the last_read message for a user
@app.route('/api/<int:channel_id>/last_read', methods = ['POST', 'GET'])
def get_last_read(channel_id):
    data = request.headers.get('session_token')
    user = query_db("select * from users where session_token = ?",[data])
    
    if not user:
        return {}, 403
    user_id = user[0]['user_id']
    if request.method == 'POST':
        last_id = request.json.get('last_id')
        
        last_read = query_db('UPDATE messages_seen SET message_id = ? WHERE user_id = ? AND channel_id = ?',[last_id, user_id, channel_id])
        
        data = json.dumps({'last_seen_id':last_id})
        return jsonify(data)  
          
    if request.method == 'GET':
        last_id = query_db('SELECT message_id FROM messages_seen WHERE user_id = ? AND channel_id = ?', [user_id, channel_id])
        data = json.dumps({'last_seen_id':last_id[0]['message_id']})
        return jsonify(data)  

# enf point to get the number of unread_messages for a user
@app.route('/api/unread_messages', methods = ['GET'])
def get_unread_messages():
    data = request.headers.get('session_token')
    user = query_db("select * from users where session_token = ?",[data])
    
    if not user:
        return {}, 403
    user_id = user[0]['user_id']
    channels = query_db('SELECT channel_id from messages_seen where user_id = ?',[user_id])
    
    channels_list = [c['channel_id'] for c in channels]
    print(channels_list)
    unread_messages = []
    for chan in channels_list:
        total_messages = query_db('SELECT count(message_id) from messages where channel_id = ?',[chan])
        last_seen = query_db('SELECT message_id from messages_seen where channel_id = ?', [chan])
        unread_messages.append(total_messages[0][0]-last_seen[0]['message_id'])
    
    data = json.dumps({'channel_ids': channels_list, 'unread_messages': unread_messages})
    return jsonify(data)

# update username
@app.route('/api/users/username', methods=['POST'])
def update_username():
    
    username = request.json.get('name')
    password = request.json.get('password')
    new_name = request.json.get('new_name')
    user = query_db('select user_id from users where username = ? and password = ?',[str(username),str(password)])
    
    if not user:
        
        return jsonify({'error': 'User not found'}),404
    
    update_name = query_db("UPDATE users SET username = ? WHERE user_id = ?",[new_name,user[0]['user_id']])
    
    data = json.dumps({'new_username':new_name})
    return jsonify(data)

# update password
@app.route('/api/users/password', methods=['POST'])
def update_password():
    username = request.json.get('name')
    password = request.json.get('password')
    new_password = request.json.get('new_password')
    user = query_db('select user_id from users where username = ? and password = ?',[str(username),str(password)])
    if not user:
        return jsonify({'error': 'User not found'})
    
    update_password = query_db("UPDATE users SET password = ? WHERE user_id = ?",[new_password,user[0]['user_id']])
    data = json.dumps({'new_password':new_password})
    return jsonify(data)
    
    