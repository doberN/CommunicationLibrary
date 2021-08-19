import { users, fileSharing, chat, forum, enrollment, menu } from '../initAllClasses/init.js';
import { menuComp } from '../htmlComponent/menu/menu.js';

import { popupNotice } from '../initAllClasses/init.js';
import { checkUserConnect } from '../funGeneralClasses/functionsGeneral.js';

export class Menu{
    constructor(panel){
        this.panel = panel;
        this.roomSelection = this.roomSelection.bind(this);
    }

    menuBox(){
        this.menu = menuComp();
        
        this.panel.currentComp = 'menu';

        this.menu.addEventListener('click', this.roomSelection)

        this.panel.innerHTML="";
        this.panel.appendChild(this.menu);            
    
    }

    roomSelection(e){
        const userConnect = checkUserConnect();
        const typeRoom = e.target.className;
        const box = e.target.closest('.box');
        
        if(!box) return;
        const typeBox = box.className;
      
        switch(true){
            case typeBox.includes('file-sharing'):
                fileSharing.fileSharingBox();
                break;

            case typeBox.includes('chat'): 
                chat.chatBox()
                break;

            case typeBox.includes('forum'):
                forum.topicForumBox()
                break;

            case typeBox.includes('Friends'):
                if(!userConnect) return  this.panel.appendChild(popupNotice.needToLoginNotice());
                users.myFriendBox();
                break;

            case typeRoom.includes('followed'):
                users.followedBox()
                break;

            case typeRoom.includes('followers'):
                users.followersBox()
                break;

            case typeBox.includes('follow'):
                if(!userConnect) return this.panel.appendChild(popupNotice.needToLoginNotice());;
                const follow = this.menu.querySelector('.follow .list');
                follow.classList.remove('hide');
                break;

            case typeRoom.includes('sign-up'):
                enrollment.signUpForm()
                break;

            case typeRoom.includes('logout'):
                enrollment.logout()
                menu.menuBox();
                break;

            case typeRoom.includes('login'):
                enrollment.loginForm()
                break;

            case typeRoom.includes('update'):
                enrollment.updateUserForm()
                break;

            case typeRoom.includes('reset'):
                enrollment.resetPasswordForm()
                break;
    
            case typeBox.includes('enrollment'):
                const enrollmentList = this.menu.querySelector('.enrollment .list');
                enrollmentList.classList.remove('hide');
                break;
            
 
        }
    }

}