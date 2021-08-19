import { forumThreadComp, newThread, forumCommentComp, newComment }  from '../htmlComponent/plugin/forum.js';
import { popupNotice, menu } from '../initAllClasses/init.js';
import { socket } from '../initAllClasses/initSocket.js';
import { isNewReporting, updateLocalStorage,  } from '../htmlComponent/plugin/pluginFunction.js';
import { forum } from '../initAllClasses/init.js';
import { getProfile, checkUserConnect } from '../funGeneralClasses/functionsGeneral.js';

export class Forum{
    constructor(panel){
        this.panel = panel;
        this.io = socket.socket;
        this.sendThread =  this.sendThread.bind(this)  
        this.newThread();
        this.newComment();
        this.newRate();
        this.deleteOffensive();
        this.commentsForumBox = this.commentsForumBox.bind(this);
        this.offensive = this.offensive.bind(this);
        this.responseForm = this.responseForm.bind(this);
        this.sendComment = this.sendComment.bind(this)
        this.rate = this.rate.bind(this);
        this.profile = this.profile.bind(this);
    }
    async topicForumBox(){ 
        
        this.forumThreadcomp = forumThreadComp();
        this.lastThread = 0;
        this.lastComment = 0;
        this.allThreads = [];
        this.getThreads();
        this.panel.currentComp = 'forum topic';
        const sendPost = this.forumThreadcomp.querySelector('.submit-post');
        const windowFornPost = this.forumThreadcomp.querySelector('.form-send-post');
        const openFornPost =  this.forumThreadcomp.querySelector('.open-send-post');
        const closeFornPost = this.forumThreadcomp.querySelector('.close-send-post');
        const allForums = this.forumThreadcomp.querySelector('.all-forums');

        allForums.addEventListener('click', this.profile);
        allForums.addEventListener('click', this.commentsForumBox);
        sendPost.addEventListener('click', this.sendThread);

        allForums.addEventListener('scroll', (e)=>{
            if(allForums.scrollTop + allForums.offsetHeight >= allForums.scrollHeight - 20){
                this.getThreads()
        
            };
        });
        openFornPost.addEventListener('click', () =>{
            const result = checkUserConnect();
            
            if(!result) return  panel.appendChild(popupNotice.needToLoginNotice());
            windowFornPost.classList.toggle("hide");
        });   
        closeFornPost.addEventListener('click', ()=>{
            windowFornPost.classList.toggle("hide");
        });

        
        this.panel.innerHTML="";
        this.panel.appendChild(this.forumThreadcomp);            
    }

    async getThreads(){
        const allForums = this.forumThreadcomp.querySelector('.all-forums');
        if(allForums.Loading == true) return;
        allForums.Loading = true;


        const getThreadList = fetch(`https://web-dober.herokuapp.com/forum/getThreadList`, {
            method:'POST',
            headers: {
                'Content-Type': 'application/json',
                },
            body: JSON.stringify({lastThread:this.lastThread}),   
            })
            
            .then( res => res.json())
            .then( threadsFromServer => {
                if(threadsFromServer.result.length ===0) return
                this.removeStartCompText();
                const threadsLength  = threadsFromServer.result.length;
                this.lastThread = threadsFromServer.result[threadsLength-1].id;
                
                allForums.Loading = false;

                let listThread = "";

                threadsFromServer.result.forEach((value)=>{
                    this.allThreads.push(value);
                    listThread += newThread(value);
                });
                allForums.insertAdjacentHTML('beforeend', listThread);

               //messageScroll(allForums);
            }); 
            
    }

    sendThread(){
        const titlePost = this.forumThreadcomp.querySelector('.title-post');
        const inputPost = this.forumThreadcomp.querySelector('.input-post');
        const closeFornPost = this.forumThreadcomp.querySelector('.close-send-post');

        if(!titlePost.value || !inputPost.value) {
            titlePost.placeholder = !titlePost.value? "post title - Required":titlePost.value;
            inputPost.placeholder = !inputPost.value? "new post - Required":inputPost.value;
            return;
        }
 
        closeFornPost.click()

        this.io.emit('sendThreadForum', { title:titlePost.value, message:inputPost.value} ); 
        titlePost.value ="";
        inputPost.value ="";
    }

    newThread(){
        this.io.on('sendThreadForum',(serverThread)=>{

            if(this.panel.currentComp != 'forum topic') return;
            this.removeStartCompText();

            const allForums = this.forumThreadcomp.querySelector('.all-forums');
            this.allThreads.push(serverThread);
            const thread = newThread(serverThread);
            allForums.insertAdjacentHTML('afterbegin', thread);

        });
    }

    newRate(){
        
        this.io.on('rate', rate =>{
            if(this.panel.currentComp != 'forum comment') return;
            const allForums = Array.from(this.forumCommentComp.querySelectorAll('.comment-box'));
            
    
            const element = allForums.find(element => element.id == rate.idData);
            if(!element) return;

            const rateEl = element.querySelector('.number');
            rate.statusRate == 'like' ? rateEl.innerHTML++:rateEl.innerHTML--;

        });
    }

    removeStartCompText(){  
        if(this.forumThreadcomp.querySelector('.start-forum')){
            this.forumThreadcomp.querySelector('.start-forum').remove();
        }
    }
    commentsForumBox(event){
        const className = event.target.className;
        if(className == 'name') return
        const threadIdEl =  event.target.closest('.post-box');
        if(!threadIdEl) return;

        
        this.panel.currentComp = 'forum comment';
     
        const parent =  this.allThreads.find( item => item.id == threadIdEl.id);
        this.forumCommentComp = forumCommentComp(parent);
        const closeFornPost = this.forumCommentComp.querySelector('.close-send-post');
        const windowFornPost = this.forumCommentComp.querySelector('.form-send-post');
        const backToThreades = this.forumCommentComp.querySelector('.back');
        const sendComment = this.forumCommentComp.querySelector('.submit-comment');
 
        sendComment.addEventListener('click', this.sendComment())

        backToThreades.addEventListener('click', ()=>{
            this.topicForumBox();
        });
        closeFornPost.addEventListener('click', ()=>{
            windowFornPost.classList.toggle("hide");
        });

        this.panel.innerHTML="";

        const allComments =  this.forumCommentComp.querySelector('.all-forums');
        allComments.addEventListener('click', this.profile);
        allComments.addEventListener('click', this.offensive)
        allComments.addEventListener('click', this.rate);
        allComments.addEventListener('click',this.responseForm())

        allComments.addEventListener('scroll', (e)=>{

            if(allComments.scrollTop + allComments.offsetHeight >= allComments.scrollHeight - 20){
                this.getComments(parent)
        
            };
        });

        this.panel.appendChild(this.forumCommentComp); 
        this.getComments(parent);
    }
    getComments(parent){

        const allForums = this.forumCommentComp.querySelector('.all-forums');
        if(allForums.Loading == true) return;
        allForums.Loading = true;

        const getCommentList = fetch(`https://web-dober.herokuapp.com/forum/getCommentList`, {
            method:'POST',
            headers: {
                'Content-Type': 'application/json',
                },
            body: JSON.stringify({lastComment:this.lastComment, parent:parent.id}),   
            })
            
            .then( res => res.json())
            .then( commetnsFromServer => {

               
                if(commetnsFromServer.result.length !=0){   
                    const commentLength = commetnsFromServer.result.length;                  
                    this.lastComment = commetnsFromServer.result[commentLength-1].id;
                }      
  
                allForums.Loading = false;

                let listComments = "";

                commetnsFromServer.result.forEach((value)=>{
                    listComments += newComment(value);
                });
                allForums.insertAdjacentHTML('beforeend', listComments);
            }); 
        
    }

    responseForm(){
       const formSendPost = this.forumCommentComp.querySelector('.form-send-post');

       return function(event){

        const elEvent = event.target; 
        if (elEvent.className != 'response') return;

        const mainDiv =  elEvent.closest('.comment-box');
        const responseId = mainDiv.id;
        const message = mainDiv.querySelector('.main-text').textContent;
        const userName = mainDiv.querySelector('.main-name').textContent;

        formSendPost.classList.toggle('hide')

        const replyPost = formSendPost.querySelector('.reply-post');
        replyPost.id = responseId;
        const repltName = replyPost.querySelector('.name');
        repltName.textContent = userName;
        const replyText = replyPost.querySelector('.reply-text');
        replyText.textContent = message;

       }
      
    }

    sendComment(){
        const formSendPost = this.forumCommentComp.querySelector('.form-send-post');
        const thisClass = this 
        return function(){   
            
         
            const parent = thisClass.forumCommentComp.querySelector('.parent').id;
            let reply_idForum;

            const reply = formSendPost.querySelector('.reply-post').id;
            const replyText = formSendPost.querySelector('.input-post');
            const replyName = formSendPost.querySelector('.name').innerText;
            const replyMessage = formSendPost.querySelector('.reply-text').innerText;

            const comment = {};
            if(parent != reply){
                reply_idForum = reply;    
                comment.reply = { name:replyName, message:replyMessage } 
            }


            comment.data = { parent, reply_idForum, message:replyText.value };
            thisClass.io.emit('sendCommentForum',comment); 
            formSendPost.classList.toggle('hide');
            replyText.value = "";
        }

    }

    newComment(){
        this.io.on('sendCommentForum',(serverComment)=>{

            if(this.panel.currentComp != 'forum comment') return;
            
            const startComment  = this.forumCommentComp.querySelector('.space');
            const parent = this.forumCommentComp.querySelector('.parent').id;
            if(parent != serverComment.parent) return;
            const allForums = this.forumCommentComp.querySelector('.all-forums');

            
            const comment = newComment(serverComment);

            startComment.insertAdjacentHTML('afterend', comment);
            if(!this.lastComment) this.lastComment = serverComment.id; 
        });
    }

    rate(e){
        const rateClass = String(e.target.classList);

        if(!rateClass.includes("like","dislike")) return;
        
        const idComment = e.target.closest('.comment-box').id;
        const room = 'Forum';

        const newRate = isNewReporting(room, idComment, 'rate');

        if(!newRate) return this.panel.appendChild(popupNotice.alreadyRateNotice());
        let statusRate;

        if(rateClass.includes("dislike")){
            statusRate = "dislike";
        }else{
            statusRate = "like";
        }

        updateLocalStorage(room, idComment, 'rate');
        this.io.emit('rate', {room, idData:idComment, statusRate})
        
    }

    offensive(e){
        const classEl = e.target.className;
  
        if(!classEl.includes("offensive")) return;

        const result = checkUserConnect();

        if(!result) return panel.appendChild(popupNotice.needToLoginNotice());

        const offensiveId = e.target.closest('.comment-box').id;
        const room = 'Forum';

        const newReporting = isNewReporting(room, offensiveId, 'offensive');

        if(!newReporting) return this.panel.appendChild(popupNotice.alreadyOffensive());

        updateLocalStorage(room, offensiveId, 'offensive');

        this.io.emit('offensive', {room, offensiveId});

        this.panel.appendChild(popupNotice.succefullyReported())

         
    }

    deleteOffensive(){

        this.io.on('offensive',(message)=>{
            
            if(message.room != 'Forum') return;

            if(this.panel.currentComp == 'forum topic'){
                const allThreades = Array.from(this.forumThreadcomp.querySelectorAll('.post-box'));
                const element = allThreades.find(element => element.id == message.offensiveId);
                if(!element) return;
                element.remove();
            }
            
            if(this.panel.currentComp == 'forum comment'){

                const allComments = Array.from(this.forumCommentComp.querySelectorAll('.comment-box'));
                const element = allComments.find(element => element.id == message.offensiveId);
                if(!element) return;

                if(element.className.includes('parent')){
                    forum.topicForumBox();
                    this.panel.appendChild(popupNotice.deleteThreadNotice());
                }else{
                    element.remove();
                }
               
            }

            

/*
            const allMessages =  Array.from(this.chat.querySelectorAll('.box'));
            const element = allMessages.find(element => element.id == message.offensiveId);
            if(!element) return;
            element.remove();*/
            //console.log(message)
        });
    }

    profile(e){

        if(this.panel.currentComp == 'forum topic'){
            const className = e.target.className;
            if(!className.includes('name')) return;
            const userId = e.target.id;
            getProfile(userId);
        }
        else if(this.panel.currentComp == 'forum comment'){
            const className = e.target.className;
            if(!className.includes('name main-name')) return;
            const userId = e.target.id;
            
            getProfile(userId);
        }
        
  
    }


}


/**
 * import { forumThreadComp, newThread, forumCommentComp, newComment }  from '../htmlComponent/plugin/forum.js';
import { popupNotice } from '../initAllClasses/init.js';
import { socket } from '../initAllClasses/initSocket.js';
import { isNewReporting, updateLocalStorage, checkUserConnect } from '../htmlComponent/plugin/pluginFunction.js';
import { forum } from '../initAllClasses/init.js';

export class Forum{
    constructor(panel){
        this.panel = panel;
        this.io = socket.socket;
        this.sendThread =  this.sendThread.bind(this)  
        this.newThread();
        this.newComment();
        this.newRate();
        this.deleteOffensive();
        this.commentsForumBox = this.commentsForumBox.bind(this);
        this.offensive = this.offensive.bind(this);
        this.responseForm = this.responseForm.bind(this);
        this.sendComment = this.sendComment.bind(this)
        this.rate = this.rate.bind(this);
    }
    async topicForumBox(){ 
        
        this.forumThreadcomp = forumThreadComp();
        this.lastThread = 0;
        this.lastComment = 0;
        this.allThreads = [];
        this.getThreads();
        this.panel.currentComp = 'forum topic';
        const sendPost = this.forumThreadcomp.querySelector('.submit-post');
        const windowFornPost = this.forumThreadcomp.querySelector('.form-send-post');
        const openFornPost =  this.forumThreadcomp.querySelector('.open-send-post');
        const closeFornPost = this.forumThreadcomp.querySelector('.close-send-post');
        const allForums = this.forumThreadcomp.querySelector('.all-forums');

        allForums.addEventListener('scroll', (e)=>{

            if(allForums.scrollTop + allForums.offsetHeight >= allForums.scrollHeight - 20){
                this.getThreads()
        
            };
        });

        allForums.addEventListener('click', this.commentsForumBox);

        openFornPost.addEventListener('click', () =>{
            if(!Cookies.get("jwt")) {
                this.panel.appendChild(popupNotice.needToLoginNotice());
                return;
            }
            windowFornPost.classList.toggle("hide");
        });
        
        closeFornPost.addEventListener('click', ()=>{
            windowFornPost.classList.toggle("hide");
        });

        sendPost.addEventListener('click', this.sendThread)
        
        this.panel.innerHTML="";
        this.panel.appendChild(this.forumThreadcomp);            
    }

    async getThreads(){
        const allForums = this.forumThreadcomp.querySelector('.all-forums');
        if(allForums.Loading == true) return;
        allForums.Loading = true;


        const getThreadList = fetch(`http://localhost:3000/forum/getThreadList`, {
            method:'POST',
            headers: {
                'Content-Type': 'application/json',
                },
            body: JSON.stringify({lastThread:this.lastThread}),   
            })
            
            .then( res => res.json())
            .then( threadsFromServer => {
                if(threadsFromServer.result.length ===0) return
                this.removeStartCompText();
                const threadsLength  = threadsFromServer.result.length;
                this.lastThread = threadsFromServer.result[threadsLength-1].id;
                
                allForums.Loading = false;

                let listThread = "";

                threadsFromServer.result.forEach((value)=>{
                    this.allThreads.push(value);
                    listThread += newThread(value);
                });
                allForums.insertAdjacentHTML('beforeend', listThread);

               //messageScroll(allForums);
            }); 
            
    }

    sendThread(){
        const titlePost = this.forumThreadcomp.querySelector('.title-post');
        const inputPost = this.forumThreadcomp.querySelector('.input-post');
        const closeFornPost = this.forumThreadcomp.querySelector('.close-send-post');

        if(!titlePost.value || !inputPost.value) {
            titlePost.placeholder = !titlePost.value? "post title - Required":titlePost.value;
            inputPost.placeholder = !inputPost.value? "new post - Required":inputPost.value;
            return;
        }
 
        closeFornPost.click()

        this.io.emit('sendThreadForum', { title:titlePost.value, message:inputPost.value} ); 
        titlePost.value ="";
        inputPost.value ="";
    }

    newThread(){
        this.io.on('sendThreadForum',(serverThread)=>{
            this.removeStartCompText();

            if(this.panel.currentComp != 'forum topic') return;
            const allForums = this.forumThreadcomp.querySelector('.all-forums');
            this.allThreads.push(serverThread);
            const thread = newThread(serverThread);
            allForums.insertAdjacentHTML('afterbegin', thread);

        });
    }

    newRate(){
        
        this.io.on('rate', rate =>{
            if(this.panel.currentComp != 'forum comment') return;
            const allForums = Array.from(this.forumCommentComp.querySelectorAll('.comment-box'));
            
    
            const element = allForums.find(element => element.id == rate.idData);
            if(!element) return;

            const rateEl = element.querySelector('.number');
            rate.statusRate == 'like' ? rateEl.innerHTML++:rateEl.innerHTML--;

        });
    }

    removeStartCompText(){  
        if(this.forumThreadcomp.querySelector('.start-forum')){
            this.forumThreadcomp.querySelector('.start-forum').remove();
        }
    }
    commentsForumBox(event){
        const className = event.target.className;
        if(className == 'name') return
        const threadIdEl =  event.target.closest('.post-box');
        if(!threadIdEl) return;

        
        this.panel.currentComp = 'forum comment';
     
        const parent =  this.allThreads.find( item => item.id == threadIdEl.id);
        this.forumCommentComp = forumCommentComp(parent);
        const closeFornPost = this.forumCommentComp.querySelector('.close-send-post');
        const windowFornPost = this.forumCommentComp.querySelector('.form-send-post');
        const backToThreades = this.forumCommentComp.querySelector('.back');
        const sendComment = this.forumCommentComp.querySelector('.submit-comment');
        sendComment.addEventListener('click', this.sendComment())

        backToThreades.addEventListener('click', ()=>{
            this.topicForumBox();
        });
        closeFornPost.addEventListener('click', ()=>{
            windowFornPost.classList.toggle("hide");
        });

        this.panel.innerHTML="";

        const allComments =  this.forumCommentComp.querySelector('.all-forums');
        allComments.addEventListener('click', this.offensive)
        allComments.addEventListener('click', this.rate);
        allComments.addEventListener('click',this.responseForm())

        allComments.addEventListener('scroll', (e)=>{

            if(allComments.scrollTop + allComments.offsetHeight >= allComments.scrollHeight - 20){
                this.getComments(parent)
        
            };
        });

        this.panel.appendChild(this.forumCommentComp); 
        this.getComments(parent);
    }
    getComments(parent){

        const allForums = this.forumCommentComp.querySelector('.all-forums');
        if(allForums.Loading == true) return;
        allForums.Loading = true;

        const getCommentList = fetch(`http://localhost:3000/forum/getCommentList`, {
            method:'POST',
            headers: {
                'Content-Type': 'application/json',
                },
            body: JSON.stringify({lastComment:this.lastComment, parent:parent.id}),   
            })
            
            .then( res => res.json())
            .then( commetnsFromServer => {

               
                if(commetnsFromServer.result.length !=0){   
                    const commentLength = commetnsFromServer.result.length;                  
                    this.lastComment = commetnsFromServer.result[commentLength-1].id;
                }      
  
                allForums.Loading = false;

                let listComments = "";

                commetnsFromServer.result.forEach((value)=>{
                    listComments += newComment(value);
                });
                allForums.insertAdjacentHTML('beforeend', listComments);
            }); 
        
    }

    responseForm(){
       const formSendPost = this.forumCommentComp.querySelector('.form-send-post');

       return function(event){

        const elEvent = event.target; 
        if (elEvent.className != 'response') return;

        const mainDiv =  elEvent.closest('.comment-box');
        const responseId = mainDiv.id;
        const message = mainDiv.querySelector('.main-text').textContent;
        const userName = mainDiv.querySelector('.main-name').textContent;

        formSendPost.classList.toggle('hide')

        const replyPost = formSendPost.querySelector('.reply-post');
        replyPost.id = responseId;
        const repltName = replyPost.querySelector('.name');
        repltName.textContent = userName;
        const replyText = replyPost.querySelector('.reply-text');
        replyText.textContent = message;

       }
      
    }

    sendComment(){
        const formSendPost = this.forumCommentComp.querySelector('.form-send-post');
        const thisClass = this 
        return function(){   
            
         
            const parent = thisClass.forumCommentComp.querySelector('.parent').id;
            let reply_idForum;

            const reply = formSendPost.querySelector('.reply-post').id;
            const replyText = formSendPost.querySelector('.input-post');
            const replyName = formSendPost.querySelector('.name').innerText;
            const replyMessage = formSendPost.querySelector('.reply-text').innerText;

            const comment = {};
            if(parent != reply){
                reply_idForum = reply;    
                comment.reply = { name:replyName, message:replyMessage } 
            }


            comment.data = { parent, reply_idForum, message:replyText.value };
            thisClass.io.emit('sendCommentForum',comment); 
            formSendPost.classList.toggle('hide');
            replyText.value = "";
        }

    }

    newComment(){
        this.io.on('sendCommentForum',(serverComment)=>{

            const startComment  = this.forumCommentComp.querySelector('.space');
            const parent = this.forumCommentComp.querySelector('.parent').id;
            if(this.panel.currentComp != 'forum comment') return;
            if(parent != serverComment.parent) return;
            const allForums = this.forumCommentComp.querySelector('.all-forums');

            
            const comment = newComment(serverComment);

            startComment.insertAdjacentHTML('afterend', comment);
            if(!this.lastComment) this.lastComment = serverComment.id; 
        });
    }

    rate(e){
        const rateClass = String(e.target.classList);

        if(!rateClass.includes("like","dislike")) return;
        
        const idComment = e.target.closest('.comment-box').id;
        const room = 'Forum';

        const newRate = isNewReporting(room, idComment, 'rate');

        if(!newRate) return this.panel.appendChild(popupNotice.alreadyRateNotice());
        let statusRate;

        if(rateClass.includes("dislike")){
            statusRate = "dislike";
        }else{
            statusRate = "like";
        }

        updateLocalStorage(room, idComment, 'rate');
        this.io.emit('rate', {room, idData:idComment, statusRate})
        
    }

    offensive(e){
        const classEl = e.target.className;
  
        if(!classEl.includes("offensive")) return;

        const result = checkUserConnect();
        if(!result) return;

        const offensiveId = e.target.closest('.comment-box').id;
        const room = 'Forum';

        const newReporting = isNewReporting(room, offensiveId, 'offensive');

        if(!newReporting) return this.panel.appendChild(popupNotice.alreadyOffensive());

        updateLocalStorage(room, offensiveId, 'offensive');

        this.io.emit('offensive', {room, offensiveId});

        this.panel.appendChild(popupNotice.succefullyReported())

         
    }

    deleteOffensive(){

        this.io.on('offensive',(message)=>{
            
            if(message.room != 'Forum') return;

            if(this.panel.currentComp == 'forum topic'){
                const allThreades = Array.from(this.forumThreadcomp.querySelectorAll('.post-box'));
                const element = allThreades.find(element => element.id == message.offensiveId);
                if(!element) return;
                element.remove();
            }
            
            if(this.panel.currentComp == 'forum comment'){

                const allComments = Array.from(this.forumCommentComp.querySelectorAll('.comment-box'));
                const element = allComments.find(element => element.id == message.offensiveId);
                if(!element) return;

                if(element.className.includes('parent')){
                    forum.topicForumBox();
                    this.panel.appendChild(popupNotice.deleteThreadNotice());
                }else{
                    element.remove();
                }
               
            }


            //console.log(message)
        });
    }


}
 */