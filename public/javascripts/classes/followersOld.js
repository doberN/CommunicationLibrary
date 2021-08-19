export default class Followers{
    constructor(io){
        this.panel;
        this.socket = io;
        this.jwt = localStorage.getItem("jwt");
    }

    async showBoxFollowers(){
        
        await this.getMyFollowed();
        const createFollowed = this.createFollowed.bind(this);
        const removeFollowed = this.removeFollowed.bind(this);

        const form = document.createElement('div');

        form.innerHTML=`
        <label>create followed</label>
        <input type="text" id="createFollowedInput"><br>
        <input type="submit" id="createFollowedButton" value="create"><br>

        <label>remove followed</label>
        <input type="text" id="removeFollowedInput"><br>
        <input type="submit" id="removeFollowedButton" value="remove"><br>
       `;

       const nameRequestFollowed = form.querySelector('#createFollowedInput');
       const submitCreateFollowed = form.querySelector('#createFollowedButton');

       submitCreateFollowed.addEventListener('click', function(){
            const followedId = nameRequestFollowed.value;
            createFollowed(followedId);
        });

        const nameRemoveFollowed = form.querySelector('#removeFollowedInput');
        const submitRemoveFollowed = form.querySelector('#removeFollowedButton');
 
        submitRemoveFollowed.addEventListener('click', function(){
            const followedId = nameRemoveFollowed.value;
             removeFollowed(followedId);
        });

        this.panel.appendChild(form);
    }

    async createFollowed(followedId){
        const response = await fetch(`http://localhost:3000/followers/createFollowers`, {
            method:'POST',
            headers: {
                'authorization': `Bearer ${this.jwt}`,
                'Content-Type': 'application/json'
              },
            body:JSON.stringify({followedId})
            })
            .then(res => res.json())   
            .then(json => console.log(json));
    }

    async removeFollowed(followedId){
        const response = await fetch(`http://localhost:3000/followers/removeFollowers`, {
            method:'POST',
            headers: {
                'authorization': `Bearer ${this.jwt}`,
                'Content-Type': 'application/json'
              },
            body:JSON.stringify({followedId})
            })
            .then(res => res.json())   
            .then(json => console.log(json));
    }

    async getMyFollowed(){
        const response = await fetch(`http://localhost:3000/followers/followedList`, {
            method:'GET',
            headers: {
                'authorization': `Bearer ${this.jwt}`,
              },
            })
            .then(res => res.json())   
            .then(json => console.log(json)); 
    }
    
}

const socket = io('http://localhost:3000');

const followers = new Followers(socket);

document.querySelector('#panel').innerHTML ='<div class="followers"></div>';
let followersDiv = document.querySelector('.followers');


followers.panel = followersDiv;
followers.showBoxFollowers();