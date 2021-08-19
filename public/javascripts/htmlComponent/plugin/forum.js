
export function forumThreadComp(){
    const forumDiv = document.createElement('div');
    forumDiv.classList.add("forum-box"); 

    const forum = `   

            <div class="forum-header">

                <div class="left">
                <i class="far fa-comment-alt"> פורום</i>
                </div>
                <div class="right">
                <i class='fas fa-list-ul menu-general'></i>
                <i class="fas fa-times close-panel"></i>
                </div>
        
            </div>
            <div class="all-forums scroll">
                <div class="start-forum">Be the first to comment....</div>

            </div>

            <div class="open-send-post">
                <i class="fas fa-comment-alt"></i>
            </div>
            
            
            <div class="form-send-post hide">
            <div class="close-send-post">
                <i class="fas fa-times"></i>
            </div>
            <input placeholder="כותרת פוסט" class="scroll title-post" type="text">
            <textarea placeholder="פוסט חדש" class="input-post"></textarea>
            <button class="submit-post">send</button>
        </div>`;

    forumDiv.insertAdjacentHTML('afterbegin', forum);


    return forumDiv;
}

export function newThread(thread){
    let myId;
    if(Cookies.get("myIdForPlugin")){
        myId =  Cookies.get("myIdForPlugin");
    }
    const { id, userId, name, image, title, response, date, } = thread;
    
    const threadHtml = `

    <div class="post-box" id="${id}">
                    

        <div class="response">
            <span class="number">${response || 0}</span>
            <i class="fas fa-reply"></i>
        </div>
        <div class="post">
            <div class="title">
               ${title}
            </div>
            <div class="bottom">
                <div class="name" id="${userId}">${myId == userId? "אני":name}</div>
                <div class="time">
                    ${date}
                </div>
            </div>
        </div>
        <div class="user-img">
            <img src="${image}" alt="">
        </div>
              
                    

</div>`;
   

    return threadHtml;
}

export function forumCommentComp(parent){

    const forumDiv = document.createElement('div');
    forumDiv.classList.add("forum-box"); 
    const {id, title, message, date, rating, name, userId, image} = parent;

    let myId;
    if(Cookies.get("myIdForPlugin")){
        myId =  Cookies.get("myIdForPlugin");
    }

    const forum = `
        
            <div class="forum-header">

                <div class="left">
                <i class="far fa-comment-alt"> פורום</i>
                </div>
                <div class="right">
                <i class="fas fa-undo-alt back"></i>
                <i class='fas fa-list-ul menu-general'></i>
                <i class="fas fa-times close-panel"></i>
                </div>
        
            </div>
            <div class="all-forums scroll">
              
                <div class="title">
                "${title}"
                </div>  
             
                <div class="comment-box parent"   id="${id}">
                  
                    <div class="user">
                        <div class="img">
                         <img src="${image}" alt="">
                        </div>
                        <div class="date">
                            ${date}
                        </div>
                        <div class="name main-name"  id="${userId}">
                           ${myId == userId? "אני":name}
                        </div>
                    </div>
    
                    <div class="text main-text">
                        ${message}
                    </div>
                    <div class="bottom-data">
                        <span class="response">הגב</span>
                        <span><i class="fas fa-thumbs-down dislike"></i></span>
                        <span class="number">${rating}</span>
                        <span><i class="fas fa-thumbs-up like"></i></span>
                        <span class="offensive">דווח</span>
                    </div>

                </div>

                <hr class="space">

            </div>
            
            <div class="form-send-post hide">
            <div class="close-send-post">
                <i class="fas fa-times"></i>
            </div>
            
            <div class="reply-post">
                <div class="name">
                    
                </div>
                <div class="reply-text scroll">
                   
                </div>
               
            </div>
            <textarea placeholder="כתוב תגובה" class="input-post"></textarea>
            <button class="submit-comment">send</button>
        </div>`;

        forumDiv.insertAdjacentHTML('afterbegin', forum);
        return forumDiv;
}

export function newComment(comment){

    let htmlReply;
    const { id, userId, name, message, image, date, rating } = comment;;

    const commentObj = { id, userId, name, message, image, date, rating };

    if(comment.reply){
        commentObj.reply = {};
        commentObj.reply.id = comment.reply_idForum;
        commentObj.reply.name = comment.reply.name;
        commentObj.reply.message = comment.reply.message;

        htmlReply = `
        <div class="reply-post" id="${commentObj.reply.id}">
            <div class="name">
                ${ commentObj.reply.name}
            </div>
            <div class="reply-text">
                ${ commentObj.reply.message}
            </div>
        </div>`;
    }
    const commentHtml = `
    <div class="comment-box" id="${commentObj.id}">

        <div class="user">
            <div class="img">
                <img src="${commentObj.image}" alt="">
            </div>
            <div class="date">
                ${commentObj.date}
            </div>
            <div class="name main-name"  id="${userId}">
                 ${commentObj.name}
            </div>
        </div>
        ${htmlReply || ""}
        <div class="text main-text">
            ${commentObj.message}
        </div>
        <div class="bottom-data">
            <span class="response">הגב</span>
            <span><i class="fas fa-thumbs-down dislike"></i></span>
            <span class="number">${commentObj.rating}</span>
            <span><i class="fas fa-thumbs-up like"></i></span>
            <span class="offensive">דווח</span>
        </div>

    </div>
    `;

    return commentHtml;
}