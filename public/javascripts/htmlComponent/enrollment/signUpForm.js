import { functionOfForm } from './funcionForm.js';
 
 export function compFormSignUp(errUser, errServer){
   
    const mainDivForm = document.createElement('div');
    mainDivForm.classList.add("sign-up", "form-enrollment"); 

    const form =`
                <div class="form">
                    <div class="header">
                        <div class="form-title">
                            Sign Up   
                        </div>
                        <div class="menu" >
                            <i class='fas fa-list-ul menu-pic'></i>
                            <ul>
                                <li class="menu">תפריט ראשי</li>
                                <li class="login">login</li>
                            </ul>
                        </div>
                    </div>
                
                    <div class="user-name">
                        <i class="fas fa-user"></i>
                        <input type="text" value ="${errUser.name||""}" placeholder=" Name " id="name">
                    </div>
                    <span class="err">${errServer.name||""}</span>

                    <div class="email">
                        <i class="fas fa-at"></i>
                        <input type="email" value ="${errUser.email||""}" placeholder=" Email " id="email">
                    </div>
                    <span class="err">${errServer.email||""}</span>
                    <div class="password">
                        <i class="fas fa-lock" ></i>
                        <input type="password" value ="${errUser.password||""}" name="" id="password" placeholder=" Password ">
                    </div>
                    <span class="err">${errServer.password||""}</span>
                    <div class="confirm-password">
                        <i class="fas fa-lock"></i>
                        <input type="password" value ="${errUser.confirmPassword||""}" name="" id="confirmPassword" placeholder=" confirm password ">
                    </div>
                    <span class="err">${errUser.err||""}</span>
                    <button class="button-sign-up">Sign Up</button>
                    <a id="login" href="">to Log in click here</a>
                </div>`;

        mainDivForm.insertAdjacentHTML('afterbegin', form);
        functionOfForm(mainDivForm);

       

        return mainDivForm;
    }












    /*
 import { menu } from './funcionForm.js';
import { enrollment } from '../../initAllClasses/init.js'
 
 export function compFormSignUp(errUser, errServer){
   
    const mainDivForm = document.createElement('div');
    mainDivForm.classList.add("sign-up", "form-enrollment"); 

    const form =`
                <div class="form">
                    <div class="header">
                        <div class="form-title">
                            Sign Up   
                        </div>
                        <div class="menu" >
                            <i class='fas fa-list-ul menupic'></i>
                            <ul style = "display:none">
                                <li>תפריט ראשי</li>
                                <li id="login">login</li>
                            </ul>
                        </div>
                    </div>
                
                    <div class="user-name">
                        <i class="fas fa-user"></i>
                        <input type="text" value ="${errUser.name||""}" placeholder=" Name " id="name">
                    </div>
                    <span class="err">${errServer.name||""}</span>

                    <div class="email">
                        <i class="fas fa-at"></i>
                        <input type="email" value ="${errUser.email||""}" placeholder=" Email " id="email">
                    </div>
                    <span class="err">${errServer.email||""}</span>
                    <div class="password">
                        <i class="fas fa-lock" ></i>
                        <input type="password" value ="${errUser.password||""}" name="" id="password" placeholder=" Password ">
                    </div>
                    <span class="err">${errServer.password||""}</span>
                    <div class="confirm-password">
                        <i class="fas fa-lock"></i>
                        <input type="password" value ="${errUser.confirmPassword||""}" name="" id="confirmPassword" placeholder=" confirm password ">
                    </div>
                    <span class="err">${errUser.err||""}</span>
                    <button class="button-sign-up">Sign Up</button>
                    <a href="">to Log in click here</a>
                </div>`;

        mainDivForm.insertAdjacentHTML('afterbegin', form);
    
        const menuDiv = mainDivForm.querySelector('.menu');
        menuDiv.addEventListener('click', menu(mainDivForm));
       
        const linkToLogin = mainDivForm.querySelector('a');
        linkToLogin.addEventListener('click', function(event){
            event.preventDefault()
            enrollment.formLogin(); 
            
        });

        return mainDivForm;
    }

*/ 