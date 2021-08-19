import { panel, popupNotice,  } from '../initAllClasses/init.js';
import { socket  } from '../initAllClasses/initSocket.js';
import { profile } from '../initAllClasses/init.js';

export async function getProfile(userId){
    const response = await fetch(`https://web-dober.herokuapp.com/users/profile`, {
        method:'POST',
        headers: {
            'Content-Type': 'application/json',
            },
        body: JSON.stringify({ userId }),   
        
        })

    const  { followers, friends, posts, user } = await response.json();
    const profileUser = { userId, followers, friends, posts, name:user.name, image:user.image };
    
    profile.profileBox(profileUser);

}

export function checkUserConnect(){
    
    if(!socket.connectionLoginSocket) {
        return false;
    }
    return true;
}