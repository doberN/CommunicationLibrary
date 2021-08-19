export function profileComp(userProfile){
    const profileDiv = document.createElement('div');
    profileDiv.classList.add("profile-box"); 

    const me = Cookies.get("myIdForPlugin");
    let list;
    if(me != userProfile.userId){
        list = `
            <li id = "follow">עקוב</li>
            <li id = "stop-following">הפסק לעקוב</li>
            <li id = "add-friend">הוסף חבר</li>
            <li id = "remove-friend">הסר חבר</li>
        `; 
    }
    const profile = `
    <div class="header-container">

        <div class="close-profile">
            <i class="fas fa-times close-panel"></i>
        </div>
        <div class="back">
            <i class="fas fa-undo-alt"></i>
        </div>

        <div class="details">
            <div class="setting">
                <i class="fas fa-ellipsis-v options"></i> 
               <div class="list hide">
                   <ul>
                       <li id = "menu">ראשי</li>
                        ${list || ""}
                   </ul>
               </div> 
            </div>
            <div class="name">
                ${userProfile.name}
            </div>
            <div class="img">
                <img src="${userProfile.image}" alt="">
            </div>
        </div>

    </div>

    <div class="content-container">

        <div class="box">
            <div class="followers detalis">
                <span>followers</span>
                <div class="number">
                    ${userProfile.followers}
                </div>          
            </div>
            <div class="icon">
                <i class="fas fa-shoe-prints"></i>
            </div>
            
        </div>

        <div class="box">
            <div class="friends detalis">
                <span>friends</span>
                <div class="number">
                ${userProfile.friends}
                </div>
            </div>
            <div class="icon">
                <i class="fas fa-user-friends"></i>
            </div>
        </div>

        <div class="box">
            <div class=" detalis">
                <span>posts</span>
                <div class="number">
                ${userProfile.posts}
                </div>
            </div>
            <div class="icon">
                <i class="fas fa-comment-alt"></i>
            </div>
        </div>
        
    </div>`;

    profileDiv.insertAdjacentHTML('afterbegin', profile);


    return profileDiv;
}