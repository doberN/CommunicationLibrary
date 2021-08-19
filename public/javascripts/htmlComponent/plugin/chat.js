
export function chatComp(statusFilterFriends){
    const chatDiv = document.createElement('div');
    chatDiv.classList.add("chat-box"); 

    const chat = `     
    <div class="chat-header">

        <div class="left">
        <i class='far fa-comments'>   צ'אט  </i>
        </div>
        <div class="right">
        <i class='fas fa-list-ul menu-general'></i>
        <i class="fas fa-times close-panel filter-firend"></i>
        </div>

    </div>

    <div class="all-messages scroll">
        <div class="start-chat">Be the first to comment....</div>
    </div>
 
    <div class="box-send-message">
        <div class="reply-message"></div>
        <div class="input-message">
        <input type="text" placeholder="  כתוב הודעה..... ">
        </div>
        
        <div class="icons-input">
        <i class='fas fa-paper-plane send'></i>
        <i class="fas filter ${statusFilterFriends}"></i>
        </div>

    </div>`;

    chatDiv.insertAdjacentHTML('afterbegin', chat);


    return chatDiv;
}

export function newMessage(message, friends = []){

    let myId;
    if(Cookies.get("myIdForPlugin")){
        myId =  Cookies.get("myIdForPlugin");
    }
    
    let messageReply;
    let replyName;
    let replyIdMessage;
    if(message.reply){
        messageReply = message.reply.message ;
        replyName = message.reply.name; 
        replyIdMessage = message.replyIdMessage;
    }

    const classBackgroundReply = message.userId == myId ? 'i-reply-message' : 'other-reply-message';
  
    const replyDiv = `
        <div class="${classBackgroundReply} replyName">
            <div class="name">${replyName}</div>
            ${messageReply}
        </div>`;


    const boxClassType = message.userId == myId ? "box-my-message" : "box-message";
    const ClassType = message.userId == myId ? "my-message" : "message";

    let isFriend = "";
    
    if(friends.includes(message.userId)){
        isFriend = 'friend';
    }

    const messageHtml = ` 
    <div class="${boxClassType} box ${isFriend}" id = "${message.id}">

        <div class="img"><img class="img" src="${message.image}" alt=""></div>
        <div class="${ClassType}">
        <div class="name main-message" id="${message.userId}">${message.name}</div>
        
        <div class="text ">
            <a href ="#${replyIdMessage}" class= "reply-a">
                ${message.reply ? replyDiv : ""}
            </a>
            <span>${message.message}</span>
        </div>
       
        <div class="data-bottom-message">

            <div class="left-bottom">
            <span class="offensive">דווח</span>
            <span class="date">${message.date}</span>
            </div>
            <div class="right-bottom">
            <span class="response">הגב</span>
            </div>
        
        </div>
        </div>  

    </div>
`;

    return messageHtml;
}

export function replyMessage(reply){
    const replyDiv = `

        <div class="close">
        <i class="fas fa-times closeWindow"></i>
        </div>
        <div class="text scroll" id="${reply.id}">
            <div class="name">${reply.name}</div>
           <span>${reply.message}</span>
        </div>
`;
    return replyDiv;
}