import { profileComp } from '../htmlComponent/profile/profile.js';
import {  popupNotice, users, menu } from '../initAllClasses/init.js';
import { checkUserConnect } from '../funGeneralClasses/functionsGeneral.js';

export class Profile{

    constructor(panel){
        this.panel = panel;
        this.options = this.options.bind(this);
     
    }

    profileBox(userProfile){
     
        this.userProfile = userProfile;
        this.profile = profileComp(userProfile);

        const back = this.profile.querySelector('.back');
        const setting = this.profile.querySelector('.options');
        const list = this.profile.querySelector('.list');

        list.addEventListener('click', this.options)
        setting.addEventListener('click', ()=>{
            list.classList.toggle('hide');
        });
        back.addEventListener('click', function(e){
            const profile = e.target.closest('.profile-box');
            profile.remove();
        })
        
        this.panel.appendChild(this.profile);
    }

    async options(e){
        const requestType = e.target.id;
        //need to set the menu
        if(requestType == 'menu') return menu.menuBox();
        
        const list = this.profile.querySelector('.list');
        const followers = this.profile.querySelector('.followers .number');
        const friends = this.profile.querySelector('.friends .number');

        list.classList.toggle('hide');
        const result = checkUserConnect();
        if(!result) return this.panel.appendChild(popupNotice.needToLoginNotice());

        const jwt = Cookies.get("jwt");
        const options = {
            method:'POST',
            headers: {
                'authorization': `Bearer ${jwt}`,
                'Content-Type': 'application/json'
              },
            body:JSON.stringify({profileId:this.userProfile.userId})
        };

        switch(requestType){

            case "follow":{
                const response = await fetch(`https://web-dober.herokuapp.com/followers/createFollower`, options)
                const status = await response.text();

                if(status == 'already'){
                    
                    this.profile.appendChild(popupNotice.alreadyFollower(this.userProfile.name))
                }
                else if(status == 'success'){
                    followers.innerHTML ++;
                    this.profile.appendChild(popupNotice.createFollower(this.userProfile.name))
                }
                    
                break;
            }
            case "stop-following":{
             
                const response = await fetch(`https://web-dober.herokuapp.com/followers/removeFollower`, options);
                const status = await response.text();


                if(status == 'fails'){
                    
                    this.profile.appendChild(popupNotice.failsRemoveFollower(this.userProfile.name))
                }
                else if(status == 'success'){
                    
                    followers.innerHTML --;
                    this.profile.appendChild(popupNotice.removeFollower(this.userProfile.name))
                    if(users.panel.currentComp == 'followed'){
                        
                        const allUsers = users.followed.querySelector('.all-users');
                        console.log(allUsers)
                        const user = allUsers.querySelector(`[id='${this.userProfile.userId}']`);
                        user.remove();
                    }
                }
                
                break;
            }
            case "add-friend":{

                const response = await fetch(`https://web-dober.herokuapp.com/friends/createFriend`, options);
                const status = await response.text();

                if(status == 'already'){
                    
                    this.profile.appendChild(popupNotice.alreadyFiend(this.userProfile.name))
                }
                else if(status == 'success'){
                    friends.innerHTML ++;
                    this.profile.appendChild(popupNotice.createFriend(this.userProfile.name))
                }

                break;
            }
            case "remove-friend":{
                
                const response = await fetch(`https://web-dober.herokuapp.com/friends/removeFriend`, options);
                const status = await response.text();

                if(status == 'fails'){
                    
                    this.profile.appendChild(popupNotice.failsRemoveFollower(this.userProfile.name))
                }
                else if(status == 'success'){

                    
                    if(users.panel.currentComp == 'friends'){
                        
                        const allUsers = users.friends.querySelector('.all-users');
                        const user = allUsers.querySelector(`[id='${this.userProfile.userId}']`);
                        user.remove();
                    }

                    friends.innerHTML -- ;
                    this.profile.appendChild(popupNotice.removeFollower(this.userProfile.name))
                }
            }
                break;
        }
    }

}