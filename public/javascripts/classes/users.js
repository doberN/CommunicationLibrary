import { usersComp, newUser,  } from '../htmlComponent/users/users.js';
import { setting, profile  } from '../htmlComponent/users/functionCopm.js';
import { menu } from '../initAllClasses/init.js';

export class Users{
    constructor(panel){
        this.panel = panel;
        this.stopFollowing = this.stopFollowing.bind(this);
        this.RemoveFriend = this.RemoveFriend.bind(this);
    }

    async followedBox(){
        const roomName = 'נעקבים';
        this.followed = usersComp(roomName);

        const allUsers = this.followed.querySelector('.all-users');


        allUsers.addEventListener('click', setting());
        allUsers.addEventListener('click', profile());
        allUsers.addEventListener('click', this.stopFollowing)

        
        this.panel.currentComp = 'followed';
    
        const jwt = Cookies.get("jwt")
        const response = await fetch(`https://web-dober.herokuapp.com/followers/followedList`, {
            method:'GET',
            headers: {
                'authorization': `Bearer ${jwt}`,
              },
            });

        const followedList = await response.json();    
        let allFolllowed = "";
        followedList.result.forEach((user)=>{
            allFolllowed += newUser(user, roomName);
        });
        allUsers.insertAdjacentHTML('beforeend', allFolllowed);

        this.panel.innerHTML="";
        this.panel.appendChild(this.followed);  
    }

    async stopFollowing(e){
        const jwt = Cookies.get("jwt")
        const element = e.target;
        if(element.className != 'button' ) return;
 
        const followedId = element.closest('.user').id;

        const response = await fetch(`https://web-dober.herokuapp.com/followers/removeFollower`, {
            method:'POST',
            headers: {
                'authorization': `Bearer ${jwt}`,
                'Content-Type': 'application/json'
              },
            body:JSON.stringify({profileId:followedId})
            });
        const followedDelete = await response.text();

        element.closest('.user').remove();
        
    }

    async followersBox(){
        const roomName = 'עוקבים';
        this.followers = usersComp(roomName);

        const allUsers = this.followers.querySelector('.all-users');

        allUsers.addEventListener('click', profile());
        allUsers.addEventListener('click', this.stopFollowing)

        this.panel.currentComp = 'followers';
    
        const jwt = Cookies.get("jwt")
        const response = await fetch(`https://web-dober.herokuapp.com/followers/followersList`, {
            method:'GET',
            headers: {
                'authorization': `Bearer ${jwt}`,
              },
            });

        const followersList = await response.json();    
            console.log(followersList)

        let allFollowers = "";
        
        followersList.result.forEach((user)=>{
            allFollowers += newUser(user, roomName);
        });
        allUsers.insertAdjacentHTML('beforeend', allFollowers);

        this.panel.innerHTML="";
        this.panel.appendChild(this.followers);  
        
    }

    async myFriendBox(){
        const roomName = 'חברים';
        this.friends = usersComp(roomName);

        const allUsers = this.friends.querySelector('.all-users');

        allUsers.addEventListener('click', setting());
        allUsers.addEventListener('click', profile());
        allUsers.addEventListener('click', this.RemoveFriend)

        this.panel.currentComp = 'friends';
    
        const jwt = Cookies.get("jwt")
        const response = await fetch(`https://web-dober.herokuapp.com/friends/friendList`, {
            method:'GET',
            headers: {
                'authorization': `Bearer ${jwt}`,
              },
            });

        const friendsList = await response.json();   
        let allFriends = "";
        
        friendsList.result.forEach((user)=>{
            allFriends += newUser(user, roomName);
        });
        allUsers.insertAdjacentHTML('beforeend', allFriends);

        this.panel.innerHTML="";
        this.panel.appendChild(this.friends);  
    }

    async RemoveFriend(e){
        const jwt = Cookies.get("jwt")
        const element = e.target;
        if(element.className != 'button' ) return;
 
        const followedId = element.closest('.user').id;

        const response = await fetch(`https://web-dober.herokuapp.com/friends/removeFriend`, {
            method:'POST',
            headers: {
                'authorization': `Bearer ${jwt}`,
                'Content-Type': 'application/json'
              },
            body:JSON.stringify({profileId:followedId})
            });
        const followedDelete = await response.text();

        element.closest('.user').remove();       
    }

}