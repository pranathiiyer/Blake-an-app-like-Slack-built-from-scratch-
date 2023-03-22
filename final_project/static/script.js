
class Login extends React.Component {
    // constructor(props) {
    //   super(props);
    //   this.state = {
    //     display: true,
    //   }
    // }
    
    constructor() {
        super();
    
        this.state = {
           username: '',
           password: '',
          clicked: false,
          show_update_username : false,
          update_name_success : false,
          show_update_password: false,
          update_password_success: false,
          signup: false
        };
        this.handleUpdateUsername = this.handleUpdateUsername.bind(this);
        this.handleUpdatePassword = this.handleUpdatePassword.bind(this);
        this.handleClick = this.handleClick.bind(this);
      }
      componentDidMount() {  

    
        window.addEventListener('popstate',this.history);}
      handleClick(event){
        
        //this.props.history.push('/login');
        event.preventDefault();
        //window.history.replaceState(null, null, '/login');
          window.history.pushState(null,'','/login');
          //window.location.replace('/login');
        this.history();
        this.setState({
          clicked: true
        });
      }

    signup(){
        fetch("http://127.0.0.1:5000/api/signup", {
        method: 'POST',
        headers: {'Content-Type': 'application/json'}
        //body: JSON.stringify({username: username, password: password})
      }).then((response) => {
        
        if(response.status == 200) {
          response.json().then((data) => {
            console.log(data);
            window.history.pushState(null, '', '/signup');
            data = JSON.parse(data);
            window.localStorage.setItem("pranathiiyer_session_token", data.session_token);
            console.log(data["session_token"]);
            this.setState({username: data['username']});
            this.setState({password: data['password']});

          });
  
        } else {
          console.log(response.status);
          this.logout();
        }
      }).catch((response) =>{
        console.log(response);
        this.logout();
      })
  

    }
    history = () => {
     
     const  path = window.location.pathname;
      if(path == '/'){
        this.setState({clicked: false, signup:false});
      }
      if (path =='/login'){
        this.setState({clicked:true, signup:false});
      }
    }
    login() {
        
      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;
  
      //this.setState({display: false});
      
      fetch("http://127.0.0.1:5000/api/login", {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username: username, password: password})
      }).then((response) => {
        if(response.status == 200) {
          response.json().then((data) => {
            data = JSON.parse(data);
            
            window.localStorage.setItem("pranathiiyer_session_token", data.session_token);
            console.log(data.session_token);

            this.props.loginHandler();
            console.log(this.props.isLoggedIn);
          });
  
        } else {
          console.log(response.status);
          this.logout();
        }
      }).catch((response) =>{
        console.log(response);
        this.logout();
      })
    }
    
    logout() {
      
      window.localStorage.removeItem("pranathiiyer_session_token");
      this.props.logoutHandler();
      this.setState({clicked:false});
      this.setState({signup:false});
     
    }
    handleUpdateUsername () {
      const oldUsername = document.getElementById('old-username').value;
      const password = document.getElementById('password').value;
      const newUsername = document.getElementById('new-username').value;
    
      fetch('http://127.0.0.1:5000/api/users/username', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: oldUsername,
          password: password,
          new_name: newUsername
        })
      })
      .then(response => response.json())
      .then(data => {
        data = JSON.parse(data);
        console.log(data);
        this.setState({update_name_success:true}); 
        // do something with the response data
      })
      .catch(error => {
        console.error(error);
        // handle the error
      });
    }

    handleUpdatePassword () {
      const username = document.getElementById('username').value;
      const Oldpassword = document.getElementById('old-password').value;
      const newPassword = document.getElementById('new-password').value;
    
      fetch('http://127.0.0.1:5000/api/users/password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: username,
          password: Oldpassword,
          new_password: newPassword
        })
      })
      .then(response => response.json())
      .then(data => {
        data = JSON.parse(data);
        
        this.setState({update_password_success:true}); 
        // do something with the response data
      })
      .catch(error => {
        console.error(error);
        // handle the error
      });
    }
    render() {
         
      if(!this.props.isLoggedIn) {
        console.log(this.state.clicked);
        {window.history.pushState(null, '', '/')};
        return (
        <div className = "splash">
            <div className="hero">
              <div className="logo">
              <TitleBar />
              {!this.state.clicked && !this.state.signup ?
                <img src="/static/blake.png"></img>: null}
              </div>
            
              <div className="loginHeader">
                <div className="loggedOut"> 
               
                {!this.state.clicked && (
  <button className="form_button" id="big" onClick={(event)=>{this.handleClick(event);} 
    
  }>
    Login
  </button>

)}       
 {
                !this.state.show_update_username && !this.state.show_update_password && this.state.clicked && <div>
            <h2>Login</h2>
            <div className="login_form">
              <label htmlFor="username">Username</label>
              <input id="username"></input>
              <label htmlFor="password">Password</label>
              <input id="password" type="password"></input>
              <button className="form_button" id = 'big' onClick={() => this.login()} > 
                Submit
              </button>
              <div>
              <button type="button" id="update_username" onClick={() => this.setState({show_update_username: true})}>
                Update username!
              </button>
              <button type="button" id="update_password" onClick={() => this.setState({show_update_password: true})}>Update password!</button>
            </div>
            </div>
          </div>  }
              
              {this.state.show_update_username &&
            <div>
              <label htmlFor="old-username">Enter old username</label>
              <input id="old-username"></input>
              <label htmlFor="password">Enter password</label>
              <input id="password" type="password"></input>
              <label htmlFor="new-username">Enter new username</label>
              <input id="new-username"></input>
              <button type="submit" onClick={this.handleUpdateUsername}>Save</button>
            </div>
      }
      {this.state.update_name_success && <div>
        <p>Username updated successfully!</p>
        <button type="submit" onClick={() => this.setState({show_update_username: false, update_name_success:false})}>Okay, let's go!</button>
        </div>}

        {this.state.show_update_password &&
            <div>
              <label htmlFor="username">Enter username</label>
              <input id="username"></input>
              <label htmlFor="password">Enter old password</label>
              <input id="old-password" type="password"></input>
              <label htmlFor="new-password">Enter new password</label>
              <input id="new-password"></input>
              <button type="submit" onClick={this.handleUpdatePassword}>Save</button>
            </div>
      }
              {this.state.update_password_success && <div>
        <p>Password updated successfully!</p>
        <button type="submit" onClick={() => this.setState({show_update_password: false, update_password_success:false})}>Okay, let's go!</button>
        </div>}
               {!this.state.clicked && !this.state.signup ? <button className="signup" id = 'big' onClick = {() =>{ this.setState({signup:true});this.signup()}}>Signup</button>:null} 
               {this.state.username && this.state.signup?   <p>Your username is: {this.state.username}</p>: null}
              {this.state.password && this.state.signup?   <p>Your password is: {this.state.password}</p>: null}
              {this.state.username && this.state.password && this.state.signup ? <p> Login to change your username and password!</p>: null}
              {this.state.username && this.state.password && this.state.signup ? <a onClick = {()=> this.props.loginHandler()}>Cool let's go!</a>: null}
               
            </div>
          </div>
          </div>
          </div>
    
        );    
}
      else {
        return (
          <div className="logout_button">
            <button onClick={() => {this.logout()}}>
              Logout
            </button>
          </div>
        );
      }
    }
  
}
  
class Channels extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        channel_list: { names: [], ids: [] },
        messages :{author:[], id:[], body:[]},
        message_box: false,
        current_channel :null,
        lastMessageId: null,
        selected:null,
        showPopup: false,
        add_channel:false,
        unread:{channel_ids:[], unread_messages:[]},
        selectedChannelId:null
      };
      this.handleChannelClick = this.handleChannelClick.bind(this);
      
      
    }
    handleChannelClick = (id) => {
      this.setState({
        selectedChannelId: id,
      });
      this.getMessages(id);
    };
    componentDidMount() {  
      this.get();
      
        this.interval = setInterval(() => this.startMessagePolling(), 500);
        this.mes_interval = setInterval(() => this.unreadMesPolling(), 1000);
      this.startChannelPolling();
    
  }
    componentWillUnmount() {
      
      clearInterval(this.interval);
      clearInterval(this.mes_interval);
    }
   
    async get() {
      this.setState({add_channel: true});
      const session_token = window.localStorage.getItem("pranathiiyer_session_token");
      
  
      await fetch("http://127.0.0.1:5000/api/channels", {
        method: 'GET',
        headers: {'Content-Type': 'application/json', "session_token":  session_token},
      })
        .then((response) => response.json())
        .then((data) => {
          data = JSON.parse(data);
          console.log(data['ids']);
          this.setState({channel_list:data});
          
        });
    }
    async getMessages(channel_id) {
      console.log(channel_id)
      this.setState({selected:channel_id})
      this.setState({message_box: true});
      const session_token = window.localStorage.getItem("pranathiiyer_session_token");
      this.setState({current_channel:channel_id});
      await fetch(`http://127.0.0.1:5000/api/${channel_id}/messages`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "session_token": session_token,
        }
      })
        .then((response) => response.json())
        .then((data) => {
          data = JSON.parse(data);
          console.log(data);
          this.setState({ messages: data});
          //console.log(data.id.length);
          console.log(this.state.messages['author'].length );
          fetch(`http://127.0.0.1:5000/api/${channel_id}/last_read`,{
            method: 'POST',
            headers: {
              "Content-Type": "application/json",
              "session_token": session_token,
            },
            body : JSON.stringify({last_id: this.state.messages['author'].length })
          }).then((response) => response.json())
          .then((data) => {
            data = JSON.parse(data);
            console.log(data);
            this.setState({ lastMessageId: data['last_seen_id']
          });
        }).catch(error => {
            console.error(error);

          });

          }) .catch(error => {
            console.error(error);
          
          
        });
    
  }
    
    async postMessages(channel_id, event) {
      const session_token = window.localStorage.getItem("pranathiiyer_session_token");
      
      event.preventDefault();
      const comment = event.target.comment.value;
      event.target.elements.comment.value = '';
      //console.log(comment);
      fetch(`http://127.0.0.1:5000/api/${channel_id}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "session_token": session_token},
        body : JSON.stringify({body: comment})
        }).then(response => {
          if (!response.ok) {
            throw new Error('Failed to post message');
          }
          return response.json();
        })
        .then(data => {
          // Handle successful response
        })
        .catch(error => {
          console.error(error);
          // Handle error
        });
      }
      async add_channel(event) {
        
        const session_token = window.localStorage.getItem("pranathiiyer_session_token");
        console.log(document.getElementById('added-channel'))
        event.preventDefault();
        const addedChannelInput = document.getElementById("added-channel");
        const channel_name = addedChannelInput.value;

        console.log(channel_name);
        fetch(`http://127.0.0.1:5000/api/add_channel`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "session_token": session_token},
          body : JSON.stringify({name: channel_name})
          }).then(response => {
            if (!response.ok) {
              throw new Error('Failed to post message');
            }
            return response.json();
          })
          .then(data => {
            console.log(data);
          })
          .catch(error => {
            console.error(error);
            // Handle error
          });
        }
        async startChannelPolling() {
          const session_token = window.localStorage.getItem("pranathiiyer_session_token");
          this.interval = setInterval(async () => {
            await fetch("http://127.0.0.1:5000/api/channels", {
              method: 'GET',
              headers: {'Content-Type': 'application/json', "session_token":  session_token},
              
            })
              .then((response) => response.json())
              .then((data) => {
                data = JSON.parse(data);
                //console.log(data);
                this.setState({channel_list:data});

              });
          }, 1000); // poll every 5 seconds
        }
        
  
      async startMessagePolling() {
        console.log(this.state.lastMessageId);
        const { lastMessageId, current_channel } = this.state;
        
        const session_token = window.localStorage.getItem("pranathiiyer_session_token");
        if (current_channel&& session_token ) {
          await fetch(`http://127.0.0.1:5000/api/${current_channel}/messages?last_message_id=${lastMessageId}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "session_token": session_token,
            }
          })
            .then((response) => response.json())
            .then((data) => {
              data = JSON.parse(data);

              const { author, body, id } = data;
              this.setState({messages:data});
              const newMessages = { author: [...this.state.messages.author], id: [...this.state.messages.id], body: [...this.state.messages.body] };
              for (let i = 0; i < this.state.messages.author.length; i++) {
                newMessages.author.push(author[i]);
                newMessages.body.push(body[i]);
                newMessages.id.push(id[i]);
              }
              

          }) .catch(error => {
            console.error(error);
          
          
        });
            
          
        }
      }
    async unreadMesPolling(){
      const session_token = window.localStorage.getItem("pranathiiyer_session_token");
      if (session_token ) {
        await fetch(`http://127.0.0.1:5000/api/unread_messages`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "session_token": session_token,
          }
        }).then((response) => response.json())
        .then((data) => {
          data = JSON.parse(data);

          
          this.setState({unread:data});
          

      }) .catch(error => {
        console.error(error);
      
      
    });
        
      
    }
  }
    
    render() {
        const { names, ids } = this.state.channel_list;
        console.log(this.state.channel_list);
        // const channels = names.map((name, index) => (
  
        //   <div key={ids[index]} id={'channel_' + ids[index]} className={this.state.selected === ids[index] ? 'selected' : ''}>
        //     <h3><a href = '#' onClick={()=> this.getMessages(ids[index])}>{name}</a></h3>
            
        //   </div>
        
        const unreadCounts = this.state.unread.unread_messages;
        const unreadCountsMap = {};
for (let i = 0; i < ids.length; i++) {
  unreadCountsMap[ids[i]] = unreadCounts[i];
}




// generate the channels array, retrieving the unread count from the map
console.log(ids, unreadCounts);
const channels = ids.map(id => {
  const name = names[ids.indexOf(id)];
  {console.log(unreadCountsMap[id]);}
  const count = unreadCountsMap[id];
  const isSelected = this.state.selectedChannelId === id;
  return(
    //<div key={id} id={'channel_' + id} className={this.state.selected === id ? 'selected' : ''}>
      <h3 key={id} id={'channel_' + id} className={isSelected ? 'selected' : '' } onClick={() => {this.getMessages(id);
        this.handleChannelClick(id);}}><a href="#" >{name}
      {count > 0 &&  (<span className="unread-count">{count}</span>)} </a></h3>
      
    
)});
          
      
        console.log(this.state.messages);
        const { author, id, body } = this.state.messages;
        const hasMessages = author.length > 0;
  const message_list = hasMessages ? author.map((auth, index) => (
          <div key={id[index]} id ={id[index]} >
            <h4>{auth}</h4>
            <p>{body[index]}</p>
          </div>
     
        )) : null;

        const showMessages = hasMessages ? (
          <div className="messages">
            <h2>Messages</h2>
            <p>{message_list}</p>
          </div>
          
        ) : null;
       const channel_ids = this.state.unread.channel_ids;
       
        const messageForm = this.state.message_box && this.state.current_channel ? (
          <form onSubmit={(event) => this.postMessages(this.state.current_channel, event)}>
            <textarea name="comment" placeholder="Enter your message" />
            <button type="submit">Send</button>
          </form>
        ) : null;
        const addChannelForm = this.state.add_channel ?(<label  className = 'add-channel' onClick={() => this.setState({ showPopup: true })}>
        <i className="plus" onClick={() => this.setState({ showPopup: true })}></i> Add Channel
      </label>
        ) : null;
        
        return (
          <div className="channels-container">
          <div className="channels" id="channels">
            <h2>Channels</h2>
            <a>{channels}</a>
            {addChannelForm}
            {this.state.showPopup && (
        <div className="popup">
          
          <input type="text" id = "added-channel" placeholder="Channel name" />
          <button onClick={(event) => {this.setState({ showPopup: false });
        this.add_channel(event);}}>Save</button>
        </div>)}
            </div>
            <div className="messages">
            {author.length > 0  ? <h2> Messages</h2>: null}
            <p>{message_list}</p>
            {messageForm}
            {names.length == 0 ? <h2> No channels or messages yet!</h2>: null }
            </div>
    
    </div>
        );
      }
    } 
  class Blake extends React.Component {
     constructor(props){
     super(props); 
  
     this.state = {
      isLoggedIn: false,
      onLoginPage : false,
      posts :  [{}]}
     }
    loginHandler() {
      // TODO: update this call by managing State
      this.setState({isLoggedIn : true})
    }
  
    logoutHandler() {
      // TODO: replace this call by managing State
      this.setState({isLoggedIn : false})
    }
    //}
  
    render() {
        // Add channels here later on
      return (
        <div className="blake">
          
          
          <Login
           isLoggedIn = {this.state.isLoggedIn}
            loginHandler={()=>this.loginHandler()}
            logoutHandler={()=>this.logoutHandler()}
          />
          
          {this.state.isLoggedIn && <Channels />} 
          
        </div>
      );
    }
  }
  
  function TitleBar() {
    return (
      <div className="title_bar">
        <h1>Welcome to blake!</h1>
      </div>
    );
  }
  
  // ========================================
  ReactDOM.render(
    React.createElement(Blake),
    document.getElementById('root')
  );
  