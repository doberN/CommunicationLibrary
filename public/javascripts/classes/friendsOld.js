export default class Friends{
    constructor(io){
        this.panel;
        this.jwt = localStorage.getItem("jwt");
    }
    async showBoxFriends(){

        const threadList = await this.getMyFriends();
        const createFriend = this.createFriend.bind(this);
        const removeFriend = this.removeFriend.bind(this);

        const form = document.createElement('div');
        form.innerHTML=`
        <label>createFriend</label>
        <input type="text" id="createFriendInput"><br>
        <input type="submit" id="createFriendButton" value="create"><br>

        <label>removeFriend</label>
        <input type="text" id="removeFriendInput"><br>
        <input type="submit" id="removeFriendButton" value="remove"><br>
       `;

       const nameRequestFriend = form.querySelector('#createFriendInput');
       const submitCreateFriend = form.querySelector('#createFriendButton');

       submitCreateFriend.addEventListener('click', function(){
           const friendId = nameRequestFriend.value;
            createFriend(friendId);
       });

       const nameRemoveFriend = form.querySelector('#removeFriendInput');
       const submitRemoveFriend = form.querySelector('#removeFriendButton');

       submitRemoveFriend.addEventListener('click', function(){
           const friendId = nameRemoveFriend.value;
            removeFriend(friendId);
       });
       this.panel.appendChild(form);

    }
    async createFriend(friendId){
       
        const response = await fetch(`http://localhost:3000/friends/createFriend`, {
            method:'POST',
            headers: {
                'authorization': `Bearer ${this.jwt}`,
                'Content-Type': 'application/json'
              },
            body:JSON.stringify({friendId})
            })
            .then(res => res.json())   
            .then(json => console.log(json));
    }

    async removeFriend(friendId){
       
        const response = await fetch(`http://localhost:3000/friends/removeFriend`, {
            method:'POST',
            headers: {
                'authorization': `Bearer ${this.jwt}`,
                'Content-Type': 'application/json'
              },
            body:JSON.stringify({friendId})
            })
            .then(res => res.json())   
            .then(json => console.log(json));
    }

    async getMyFriends(){
        const response = await fetch(`http://localhost:3000/friends/friendList`, {
            method:'GET',
            headers: {
                'authorization': `Bearer ${this.jwt}`,
              },
            })
            .then(res => res.json())   
            .then(json => console.log(json));
    }
}

const friends = new Friends();

document.querySelector('#panel').innerHTML ='<div class="friends"></div>';
let friendsDiv = document.querySelector('.friends');


friends.panel = friendsDiv;
friends.showBoxFriends();