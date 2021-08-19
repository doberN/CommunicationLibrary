import Rating from './rating.js';  
const rating = new Rating();

import Offensive from './offensive.js';  
const offensive = new Offensive();

export default class Forum{
    constructor(io){
        this.panel;
        this.socket = io;
        this.listenToThreadForum();
        this.listenToRate();
        this.listenToOffensive();
        this.listenToFollowers();
    }
    
    async showBoxForum(){
        const socket = this.socket;
        const threadList = await this.getThreadList();
        console.log(threadList);
           //!!!!!!!! its need to write in user client class !!!!!!!!
           const jwt = localStorage.getItem("jwt");
           socket.emit('login', jwt); 
           //!!!!!!!! its need to write in user client class !!!!!!!!
           const rate = this.rate.bind(this);
           const form = document.createElement('div');
           let sendThread = this.sendThread.bind(this)
           let offensive = this.offensive.bind(this)
     
             form.innerHTML=`
                <label>title</label>
                <input type="text" id="title-forum"><br>
                <span id=" span-title-forum"></span>
                <label>message</label>
                <input type="text" id="message-forum"><br>
                <span id=" span-message-forum"></span>
                <label>send</label>
                <input type="submit" value="send thread" id="send-message-forum"><br><br>
                
                <label>like</label>
                <input type="submit" id="send-like-forum" value="like"><br>   
                <label>dislike</label>
                <input type="submit" id="send-dislike-forum" value="dislike"><br>
                <input type="text"  id="rate-forum"><br><br>

                <input type="submit" value="sendOffensive" id="sendOffensive" class="sendOffensive"><br>
                <input type="text" id="inputoOffensive" class="offensive">
               `;


                 const send = form.querySelector('#send-message-forum'); 
                 const inputRate = form.querySelector('#rate-forum')

                 send.addEventListener("click", function(){
                    const title = form.querySelector('#title-forum').value;
                    const message = form.querySelector('#message-forum').value;
                    const parent = 1;
                    sendThread({ title, message, parent });
                });
     
                const likeButton = form.querySelector('#send-like-forum');
                        
                likeButton.addEventListener('click', function(event){
                    const idFileRate = inputRate.value;
                    rate(idFileRate, 'Forum', socket, '+')
                });

                const disllikeButton = form.querySelector('#send-dislike-forum');
                disllikeButton.addEventListener('click', function(event){
                    const idFileRate = inputRate.value;
                    rate(idFileRate, 'Forum', socket, '-')
                });

                 /*Offensive*/ 

                    const inputeOffensive = form.querySelector('#inputoOffensive');
                    const submitOffensive = form.querySelector('#sendOffensive');
                        
                    submitOffensive.addEventListener('click', function(){
                        offensive(inputeOffensive.value, 'Forum');
                    })
                 /*Offensive*/ 

             this.panel.appendChild(form);

    }

    sendThread(thread){
        const socket = this.socket;
        socket.emit('sendThreadForum', thread);
    };
    
    listenToThreadForum(){
        const socket = this.socket; 
        socket.on('sendThreadForum', (data)=>{
            console.log(data);
        });
    }

    async getThreadList(){
        const threadList = await fetch('http://localhost:3000/forum/getThreadList');
        const json = await threadList.json();

        return json;
    }
    async rate(idFileRate, room, socket, statusLike){
        const result = rating.rate(idFileRate, room, socket, statusLike);
        console.log(result)
        
    }
    listenToRate(){
        this.socket.on('rate', function(data){
            console.log(data);
        })
    }

    listenToFollowers(){
        this.socket.on('alertFollowers', function(data){
            console.log(data);
        })
    }

    offensive(offensiveId, room){
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

const forum = new Forum(socket);

document.querySelector('#panel').innerHTML ='<div class="forum"></div>';
let forumDiv = document.querySelector('.forum');


forum.panel = forumDiv;
forum.showBoxForum();