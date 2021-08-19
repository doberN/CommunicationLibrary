import { enrollment } from '../../initAllClasses/init.js';

export function functionOfForm(form) {

    const menuDiv = form.querySelector('.menu .menu-pic');
    const ul = form.querySelector('.menu ul')
    menuDiv.addEventListener('click', menu(ul));

    if(form.querySelector('.icon-update-pic')){
        const menuPicDiv = form.querySelector('.user-img .icon-update-pic');
        const ul = form.querySelector('.user-img ul')
        menuPicDiv.addEventListener('click', menu(ul));
        
    }

    if(form.querySelector('a')){
        const aTag = form.querySelector('a');
        aTag.addEventListener('click', a);
    }

}

function menu(ul){  

    return function(event){
 
        if(getComputedStyle(ul).display == 'none'){
            ul.style.display = 'block';
        }
        else{
            ul.style.display = 'none';
        }
    }
   
}

function a(event){
    event.preventDefault();

    const id = event.target.id;
    if(id == 'login'){
        enrollment.loginForm(); 
    }else if(id == 'signup'){
        enrollment.signUpForm()
    }

}


