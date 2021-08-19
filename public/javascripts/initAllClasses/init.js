import { PopupNotice } from '../classes/popupNotice.js'
export const popupNotice = new PopupNotice();

import { Enrollment } from '../classes/enrollment.js';

import { Chat } from '../classes/chat.js';
import  { FileSharing } from '../classes/fileSharing.js'
import { Forum } from '../classes/forum.js'
import { Profile } from '../classes/profile.js';
import { Users } from '../classes/users.js';
import { Menu } from '../classes/menu.js';

export const panel = document.createElement('div');
panel.id = 'panel'; 
panel.classList.add('scroll')

export const enrollment = new Enrollment(panel);
export const chat = new Chat(panel);
export const fileSharing = new FileSharing(panel);
export const forum = new Forum(panel);
export const profile = new Profile(panel);
export const users = new Users(panel);
export const menu = new Menu(panel);


const plugin = document.createElement('div');
plugin.appendChild(panel);
plugin.id = "plugin"; 

//const fullScreenPlugin = document.querySelector("#full-screen-plugin");

const startIcon = document.createElement('div');
startIcon.classList.add("start-plugin"); 
startIcon.innerHTML = '<i class="fas fa-comments" aria-hidden="true"></i>';
plugin.appendChild(startIcon);

startIcon.addEventListener('click',(event)=>{
    event.target.closest('.start-plugin').classList.toggle("hide");
    plugin.classList.toggle("show-plugin");
    //fullScreenPlugin.classList.toggle("hide");
})

panel.addEventListener('click', (event)=>{
    const className = String(event.target.classList);
    if(!className.includes('close-panel')) return;

    //fullScreenPlugin.classList.toggle("hide");
    const plugin = document.querySelector('#plugin');
    const startPlugin = document.querySelector('.start-plugin');
    startPlugin.classList.toggle("hide");
    plugin.classList.toggle("show-plugin");
    
})

panel.addEventListener('click', (event)=>{
    const className = String(event.target.classList);
    if(!className.includes('menu-general')) return;
    menu.menuBox()
    
})

const body = document.querySelector('body'); 
body.appendChild(plugin);









        



