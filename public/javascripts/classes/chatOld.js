import Offensive from './offensive.js';  
const offensive = new Offensive();

export default class Chat{
    
    constructor(io){
        this.panel;
        this.socket = io;
        this.listenToMessageChat()
        this.listenToOffensive();
    }
    async showBoxChat(){
        const domain = window.location.href;
        const messageList = await this.getMessageChat();
        console.log(messageList);

        const socket = this.socket;

        let offensive = this.offensive.bind(this);
         //!!!!!!!! its need to write in user client class !!!!!!!!
        const jwt = localStorage.getItem("jwt");
        socket.emit('login', jwt, domain); 
        //!!!!!!!! its need to write in user client class !!!!!!!!

        const form = document.createElement('div');
        form.innerHTML = `
            <div class="messageList" style="height: 100px;overflow: auto;border:3px solid red"></div><br><br>
            <input type="text" id="inputeMssage" class="inputeMssage"><br>
            <input type="submit" value="Submit" id="sendMessage" class="sendMessage"><br><br>
            
            <input type="text" id="inputoOffensive" class="offensive"><br>
            <input type="submit" value="sendOffensive" id="sendOffensive" class="sendOffensive">
      
            `;
        
        const inputeMssage = form.querySelector('#inputeMssage');
        const submit = form.querySelector('#sendMessage');
        
        const sendMessageChat = this.sendMessageChat.bind(this);
        submit.addEventListener('click', function(env){ 
            const replyId = ""; 
            sendMessageChat(inputeMssage.value, replyId);
        }); 
        /*Offensive*/ 

        const inputeOffensive = form.querySelector('#inputoOffensive');
        const submitOffensive = form.querySelector('#sendOffensive');
            
        submitOffensive.addEventListener('click', function(){
            offensive(inputeOffensive.value, 'Chat');
        })
         /*Offensive*/ 

        this.panel.appendChild(form);

    }
    async sendMessageChat(message, reply_idMessage){
        const socket = this.socket;  
        const messageObj = {message, reply_idMessage}  

        socket.emit('sendMessageChat', messageObj);        
       
    }

    listenToMessageChat(){
        const socket = this.socket; 
        socket.on('sendMessageChat', (data)=>{
            console.log(data);
        });
    }
    async getMessageChat(){
        
        const messageList = await fetch('http://localhost:3000/chat/messageList',);
        const json = await messageList.json();

        return json;
    }

    async offensive(offensiveId, room){
        const socket = this.socket;
        const result = offensive.reporting(offensiveId, room, socket);
        console.log(result)
        
    }
    listenToOffensive(){
        socket.on('offensive', function(data){
            console.log(data);
        });
    }
}
const socket = io('http://localhost:3000');

const chat = new Chat(socket);

document.querySelector('#panel').innerHTML ='<div class="chat"></div>';
let chatDiv = document.querySelector('.chat');


chat.panel = chatDiv;
chat.showBoxChat();
