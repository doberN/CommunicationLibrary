
import { replyMessage, newMessage, chatComp } from '../htmlComponent/plugin/chat.js';
import { socket } from '../initAllClasses/initSocket.js';
import { popupNotice, menu } from '../initAllClasses/init.js';
import { messageScroll, statusScroll, isNewReporting, updateLocalStorage, } from '../htmlComponent/plugin/pluginFunction.js';
import { getProfile, checkUserConnect } from '../funGeneralClasses/functionsGeneral.js';
   
export class Chat{
    constructor(panel){
        this.panel = panel;
        this.io = socket.socket;
        this.sendMessage = this.sendMessage.bind(this);
        this.getMessages = this.getMessages.bind(this);
        this.response = this.response.bind(this)
        this.closeReply = this.closeReply.bind(this);
        this.offensive = this.offensive.bind(this);
        this.profile = this.profile.bind(this);
        this.filterFriend = this.filterFriend.bind(this);
        this.newMessage();
        this.deleteOffensive();
        this.statusFilterFriends = 'fa-users start-filter';
        this.friends = [];
    }

    chatBox(){
        this.chat = chatComp(this.statusFilterFriends);
        this.lastMessage = 0;
        this.getMessages();
        
        this.panel.currentComp = 'chat';

        const scrollAllMessages = this.chat.querySelector('.scroll');
        const inputMessage = this.chat.querySelector('.input-message input');
        const buttonSendMessage = this.chat.querySelector('.send');
        const closeReplymessage = this.chat.querySelector('.reply-message');
        const allMessages = this.chat.querySelector('.all-messages');
        const filterFirend = this.chat.querySelector('.icons-input');

        filterFirend.addEventListener('click',(e)=>{
            const typeClass = e.target.className;
            if(!typeClass.includes('filter')) return;
            
            const startFilter = 'start-filter';
            if(typeClass.includes(startFilter)){
                this.filterFriend(e)
            }
            else{
                this.stopFilterFirend(e)
            }
        });
        
        allMessages.addEventListener('click', this.offensive)
        allMessages.addEventListener('click', this.profile)
        scrollAllMessages.addEventListener('click', this.response()); 
        inputMessage.addEventListener('keyup', this.sendMessage);
        buttonSendMessage.addEventListener('click', this.sendMessage);
        closeReplymessage.addEventListener('click', this.closeReply());
        

        scrollAllMessages.autoScroll = true;
        scrollAllMessages.addEventListener('scroll',(event)=>{  
            statusScroll(scrollAllMessages);
            if(event.target.scrollTop < 600)  this.getMessages();
        });

        this.panel.innerHTML="";
        this.panel.appendChild(this.chat);            
    }

    sendMessage(event){
        if (event.keyCode != 13 && event.type != 'click') return;
           
        let reply = {};
        const inputMesssage = this.chat.querySelector('.input-message input');
        const result = checkUserConnect();
  
        if(!result){
            panel.appendChild(popupNotice.needToLoginNotice());
            return  inputMesssage.value = "";
        } 

        const message = inputMesssage.value;
 
        const replyMessage = this.chat.querySelector('.reply-message');

        if(replyMessage.innerHTML){
            reply.id = this.chat.querySelector('.box-send-message .text').id;
            reply.name = this.chat.querySelector('.box-send-message .name').innerHTML;
            reply.message = this.chat.querySelector('.box-send-message span').textContent;

        }
    
        this.io.emit('sendMessageChat', { userMessage:{ message, reply } }); 
        inputMesssage.value = "";
           
    }
    newMessage(){
        
        this.io.on('sendMessageChat',(message)=>{
            const replyMessage = this.chat.querySelector('.reply-message');
            if(replyMessage.innerHTML){

                replyMessage.innerHTML = "";
                replyMessage.style.display = 'none';
            }
            this.removeStartCompText();

            if(this.panel.currentComp != 'chat') return;
            const allMessage = this.chat.querySelector('.all-messages');

            if(allMessage.querySelector('.start-chat')){
                allMessage.querySelector('.start-chat').remove();
            }

            message.date = new Date().toLocaleTimeString([], { hour: '2-digit', minute: "2-digit", hour12: false });
            
            const Message = newMessage(message, this.friends);
  
            allMessage.insertAdjacentHTML('beforeend', Message);
            messageScroll(allMessage);    
             
        }); 
    }
    async getMessages(){
        const allMessage = this.chat.querySelector('.all-messages');
        if(allMessage.Loading == true) return;
        allMessage.Loading = true;

        this.removeStartCompText();
        const signUp = fetch(`https://web-dober.herokuapp.com/chat/messageList`, {
            method:'POST',
            headers: {
                'Content-Type': 'application/json',
                },
            body: JSON.stringify({lastMessage:this.lastMessage}),   
            })
            
            .then( res => res.json())
            .then( messagesFromServer => {
                if(messagesFromServer.result.length ===0) return
             
                this.lastMessage = messagesFromServer.result[0].id;
                allMessage.Loading = false;
                
                let messageList = "";

                messagesFromServer.result.forEach((value)=>{
                    messageList += newMessage(value, this.friends);
                });
                allMessage.insertAdjacentHTML('afterbegin', messageList);

               messageScroll(allMessage);
            });  
        
    }
    removeStartCompText(){
        if(this.chat.querySelector('.start-chat')){
            this.chat.querySelector('.start-chat').remove();
        }
        
    }

    response(){
        const replyMessageDiv = this.chat.querySelector('.reply-message');
 
        return function(event){

            replyMessageDiv.innerHTML="";

            if(event.target.className != 'response') return;
            const result = checkUserConnect();
            
            if(!result) return panel.appendChild(popupNotice.needToLoginNotice());

            const replyIdMEssage = event.target.closest('.box');
            const name = replyIdMEssage.querySelector('.name').innerHTML;
            const message = replyIdMEssage.querySelector('.text span').innerHTML;
            
            const replyDiv = replyMessage({id:replyIdMEssage.id, name, message});
            replyMessageDiv.insertAdjacentHTML('afterbegin', replyDiv);
            replyMessageDiv.style.display = 'block';
            
        }
    }

    closeReply(){
        const replyMessage = this.chat.querySelector('.reply-message');
        return function(event){
            if(event.target.className.includes('closeWindow')){
                replyMessage.innerHTML = "";
                replyMessage.style.display = 'none';
            }

        }
    }

    offensive(e){
        const classEl = e.target.className;

        if(!classEl.includes("offensive")) return;

        const result = checkUserConnect();
        
        if(!result) return panel.appendChild(popupNotice.needToLoginNotice());

        const offensiveId = e.target.closest('.box').id;
        const room = 'Chat';

        const newReporting = isNewReporting(room, offensiveId, 'offensive');

        if(!newReporting) return this.panel.appendChild(popupNotice.alreadyOffensive());

        updateLocalStorage(room, offensiveId, 'offensive');
        this.io.emit('offensive', {room, offensiveId});

        this.panel.appendChild(popupNotice.succefullyReported())

         
    }

    deleteOffensive(){

        this.io.on('offensive',(message)=>{
            if(message.room !="Chat" || this.panel.currentComp != 'chat') return;
   
            const allMessages =  Array.from(this.chat.querySelectorAll('.box'));
            const element = allMessages.find(element => element.id == message.offensiveId);
            if(!element) return;
            element.remove();
        });
    }

    profile(e){

        const className = e.target.className;
        if(!className.includes('name main-message')) return;
        const userId = e.target.id;
        getProfile(userId);
  
    }

    
    async filterFriend(e){
        
        const result = checkUserConnect();

        if(!result){
            panel.appendChild(popupNotice.needToLoginNotice());
            return  inputMesssage.value = "";
        }
        this.statusFilterFriends = "fa-users-slash stop-filter filter";

        e.target.classList.remove( 'fa-users', 'start-filter');
        e.target.classList.add( 'fa-users-slash', 'stop-filter');
        panel.appendChild(popupNotice.startFilterFriend());

        const jwt = Cookies.get("jwt")
        const response = await fetch(`https://web-dober.herokuapp.com/friends/friendList`, {
            method:'GET',
            headers: {
                'authorization': `Bearer ${jwt}`,
              },
            });

        const arrFriends = await response.json();
        
        arrFriends.result.forEach((item)=>{
            const userId = item.friendTwo.id
            this.friends.push(userId)
        });
        
        const allMessages = Array.from(this.chat.querySelectorAll('.chat-box .name'));
        
        allMessages.forEach((item)=>{   
            if(this.friends.includes(parseInt(item.id))){
                item.closest('.box').classList.add('friend');
            }
        });
    
    }

    stopFilterFirend(e){
        this.friends = [];
        const allMessages = Array.from(this.chat.querySelectorAll('.box'));
        
        allMessages.forEach((item)=>{   
            if(item.className.includes("friend")){
                item.classList.remove('friend');
            }
        });
        
        panel.appendChild(popupNotice.stopFilterFriend());
        e.target.classList.remove( 'fa-users-slash', 'stop-filter', 'filter');
        e.target.classList.add( 'fa-users', 'start-filter');
        this.statusFilterFriends = ' fa-users start-filter';
    }

 
}

