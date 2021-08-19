// import all html for enrollment
import { compFormSignUp } from '../htmlComponent/enrollment/signUpForm.js';
import { compFormLogin } from '../htmlComponent/enrollment/loginForm.js';
import { compFormUpdate } from '../htmlComponent/enrollment/updateForn.js';
import { compFormResetPassword } from '../htmlComponent/enrollment/resetPassword.js'
import { popupNotice, menu, enrollment } from '../initAllClasses/init.js';

import { socket } from '../initAllClasses/initSocket.js';

export class Enrollment{
    constructor(panel){
        this.panel = panel;
        this.form;
        this.signUp = this.signUp.bind(this);
        this.login = this.login.bind(this);
        this.resetPassword = this.resetPassword.bind(this);
        this.update = this.update.bind(this);
        this.currentImage;
        this.selectedImage;
        this.defaultPic = `https://web-dober.herokuapp.com/usersImages/user23454644322456765545.jpg`;
    }

    signUpForm(errUser = "", errServer = ""){
        const form = compFormSignUp(errUser, errServer);   
        this.form = form;

        this.menu();
        const buttonSignUp = form.querySelector('.button-sign-up');
        buttonSignUp.addEventListener('click', this.signUp);
        
        this.panel.innerHTML="";
        this.addFormToDom();            
    }
 
    signUp(){
        const inputs = this.form.querySelectorAll('input'); 

        const name = inputs[0].value;
        const email = inputs[1].value;
        const password = inputs[2].value;
        const confirmPassword = inputs[3].value;
            
        if(password != confirmPassword){
            const err = 'Check password matching';
            this.signUpForm({err, name, email, password, confirmPassword});
            return;
        }
  
        const signUp = fetch(`https://web-dober.herokuapp.com/users/signUp`, {
            method:'POST',
            headers: {
                'Content-Type': 'application/json',
                },
            body: JSON.stringify({ name, email, password}),   
            })
            
            .then( res => res.json())
            .then( resultServer => {
                
                if(resultServer.hasOwnProperty('success')){
                    enrollment.loginForm(); 
                    this.panel.appendChild(popupNotice.successSignupNotice());
                }
                else{
                    this.signUpForm({ name, email, password, confirmPassword }, resultServer)
                }
            });    

    } 

    loginForm(errUser = "", errServer = ""){
        const form = compFormLogin(errUser, errServer);   
        this.form = form;
        
        this.menu();
        const buttonLogin = form.querySelector('.button-log-in');
        buttonLogin.addEventListener('click', this.login);

        this.panel.innerHTML="";
        this.addFormToDom();
    }

    login(){
        const inputs = this.form.querySelectorAll('input');

        const userNameOrEmail = inputs[0].value;
        const password = inputs[1].value; 

        const response = fetch(`https://web-dober.herokuapp.com/users/login`, {
            method:'POST',
            headers: {
                'Content-Type': 'application/json'
              },
            body: JSON.stringify({ userNameOrEmail, password }),
            })
            .then(res => res.json())   
            .then(resultServer => {
                
                if(resultServer.hasOwnProperty('err')){
                    this.loginForm({userNameOrEmail, password},resultServer)
                }
                else if(resultServer.hasOwnProperty('notActive')){
                    this.loginForm({userNameOrEmail, password},resultServer)
                    this.panel.appendChild(popupNotice.notActiveNotice());
                }
                else if(resultServer.hasOwnProperty('success')){
                    
                    Cookies.set("jwt",resultServer.token, { expires:7 });
                    socket.login();
                    menu.menuBox()
                    this.panel.appendChild(popupNotice.welcome());
                }
    
            });
    }
    clearPanel(){
        this.panel.innerHTML = "";
    }

    resetPasswordForm(erremail = "", errServer = ""){
        const form = compFormResetPassword(erremail, errServer);   
        this.form = form;

        this.menu();
        const buttonReseetPassword = form.querySelector('.button-reset-password');
        buttonReseetPassword.addEventListener('click', this.resetPassword);
        
        this.panel.innerHTML="";
        this.addFormToDom();   
    }

    resetPassword(){
        const input = this.form.querySelector('input'); 
        const email = input.value
        const signUp = fetch(`https://web-dober.herokuapp.com/users/forgotPassword`, {
            method:'POST',
            headers: {
                'Content-Type': 'application/json',
                },
            body: JSON.stringify({email}),   
            })
            
            .then( res => res.json())
            .then( resultServer => {

                if(resultServer.hasOwnProperty('err')){
                    this.resetPasswordForm({email},resultServer)
                }
                else if(resultServer.hasOwnProperty('notActive')){
                    this.resetPasswordForm({email}, resultServer)
                    this.panel.appendChild(popupNotice.notActiveNotice());
                }
                else if(resultServer.hasOwnProperty('success')){
                    enrollment.loginForm(); 
                    this.panel.appendChild(popupNotice.resetPasswordNotice());
                }
            });   
    }
    async updateUserForm(init = true, errUser = "", errServer = ""){
        this.panel.innerHTML="";
        const form = await compFormUpdate(init, errUser, errServer);   
        this.form = form;

        this.menu();
        const buttonSignUp = form.querySelector('.button-user-update');
        buttonSignUp.addEventListener('click', this.update);
        
        
        this.addFormToDom();            
    }
    update(){
        
        const inputs = this.form.querySelectorAll('input');
        const name = inputs[1].value;
        const email = inputs[2].value;
        const password = inputs[3].value;
        const confirmPassword = inputs[4].value;
        const oldPassword = inputs[5].value;

        if(password != confirmPassword){
            const err = 'Check password matching';
            this.updateUserForm(false,{err, name, email, password, confirmPassword, oldPassword});
            return;
        }

        const fd = new FormData();
        if(inputs[0].files[0]){
            fd.append('image', inputs[0].files[0]);
        }else if(!this.selectedImage){
            fd.append('default', this.defaultPic);
        }

        fd.append('name', name);
        fd.append('email', email);
        fd.append('password', password);
        fd.append('oldPassword', oldPassword);
        
        const jwt = Cookies.get("jwt");
        const response = fetch(`https://web-dober.herokuapp.com/users/updateUser`, {
            method:'POST',
            headers: {'Authorization':`Bearer ${jwt}`},
            body: fd,
            })
            .then(res => res.json())   
            .then(resultServer => { 
              
                if(resultServer.hasOwnProperty('success')){

                    enrollment.updateUserForm();
                    this.panel.appendChild(popupNotice.successUpdateNotice()); 

                }
                else{
                    enrollment.updateUserForm(false, {name, email, password, confirmPassword, oldPassword}, resultServer);
                }
            });
    }

    logout(){
        Cookies.remove('myIdForPlugin');
        Cookies.remove('jwt');
        // /*socket.socket.disconnect()
        // socket.socket = io('https://web-dober.herokuapp.com');*/
        //socket.connectionLoginSocket = false;
        menu.menuBox()
    }

    menu(){
        const menuEnrollment = this.form.querySelector('.menu ul');
        menuEnrollment.addEventListener('click',(e)=>{
            const typeRoom = e.target.className;
            switch(true){
                case typeRoom.includes('menu'):
                    menu.menuBox()
                    break;

                case typeRoom.includes('sign-up'):
                    enrollment.signUpForm();
                    break;

                case typeRoom.includes('login'):
                    enrollment.loginForm();
                    break;

                case typeRoom.includes('update'):
                    enrollment.updateUserForm();
                    break;

                case typeRoom.includes('reset'):
                enrollment.resetPasswordForm();
                break;

                case typeRoom.includes('logout'):
                enrollment.logout();
                break;
            }
        })
    }

    addFormToDom(){
        this.panel.appendChild(this.form);
    }
}





/*// import all html for enrollment
import { formSignUp } from '../htmlComponent/enrollment/signUpForm.js';
import { formLogin } from '../htmlComponent/enrollment/loginForm.js'
import { successSignup } from '../htmlComponent/popupNotice.js';

export class Enrollment{
    constructor(panel){
        this.panel = panel;
        this.form =  document.createElement('div');;

        this.signUp = this.signUp.bind(this);
        this.menu = this.menu.bind(this);
        this.formLogin = this.formLogin.bind(this);
    }

    menu(event){
        if(!event.target.className.includes('fas')) return;

        const ul = this.form.querySelector('ul');

        if( ul.style.display == 'none'){
            ul.style.display = 'block';
        }
        else{
            ul.style.display = 'none';
        }

    }

    formSignUp(err = "", errServer = ""){
        const form = this.form;
        form.innerHTML = formSignUp(err, errServer);    
        
        
        const menuEl = form.querySelector('.menu');
        menuEl.addEventListener('click', this.menu)

        const buttonSignUp = form.querySelector('.button-sign-up');
        buttonSignUp.addEventListener('click', this.signUp);
        
        this.panel.innerHTML="";
        this.addFormToDom();            
    }
 
    signUp(){
        const inputs = this.form.querySelectorAll('input'); 

        const name = inputs[0].value;
        const email = inputs[1].value;
        const password = inputs[2].value;
        const confirmPassword = inputs[3].value;
            
        if(password != confirmPassword){
            const err = 'Check password matching';
            this.formSignUp({err, name, email, password, confirmPassword});
            return;
        }
  
        const signUp = fetch(`http://localhost:3000/users/signUp`, {
            method:'POST',
            headers: {
                'Content-Type': 'application/json',
                },
            body: JSON.stringify({ name, email, password}),   
            })
            
            .then( res => res.json())
            .then( resultServer => {
                
                if(resultServer.hasOwnProperty('success')){
                    this.panel.appendChild(successSignup());
                }
                else{
                    this.formSignUp({ name, email, password, confirmPassword }, resultServer)
                }
            });    

    } 

    formLogin(){
        const form = this.form;
        form.innerHTML = formLogin() 
        this.addFormToDom();
    }

    addFormToDom(){
        this.panel.appendChild(this.form);
    }
}

*/ 