import { functionOfForm } from './funcionForm.js';

export function compFormLogin(errUser, errServer){
    const mainDivForm = document.createElement('div');
    mainDivForm.classList.add("log-in", "form-enrollment"); 

    const form = ` 
        <div class="form">
            <div class="header">
                <div class="form-title">
                    Log in   
                </div>
                <div class="menu">
                    <i class='fas fa-list-ul menu-pic'></i>
                    <ul>
                        <li class="menu">תפריט ראשי</li>
                        <li class="sign-up">sign up</li>
                    </ul>
                </div>
            </div>

            <div class="user-name">
                <i class="fas fa-user"></i>
                <input type="text" value ="${errUser.userNameOrEmail||""}" placeholder=" Name or email">
            </div>
            <span class="err">${errServer.err||""}</span>

            <div class="password">
                <i class="fas fa-lock" ></i>
                <input type="password" value ="${errUser.password||""}" name="" id="" placeholder=" Password ">
            </div>
            <span class="err">${errServer.err||""}</span>

            <button class="button-log-in">Log in</button>

            <a id="signup" href="">to Signup</a>
        </div>`;

    mainDivForm.insertAdjacentHTML('afterbegin', form);
    functionOfForm(mainDivForm);


    return mainDivForm;
}


/**import { menu } from './funcionForm.js'
import { enrollment } from '../../initAllClasses/init.js'

export function compFormLogin(errUser, errServer){
    const mainDivForm = document.createElement('div');
    mainDivForm.classList.add("log-in", "form-enrollment"); 

    const form = ` 
        <div class="form">
            <div class="header">
                <div class="form-title">
                    Log in   
                </div>
                <div class="menu">
                    <i class='fas fa-list-ul menu-pic'></i>
                    <ul style = "display:none">
                        <li>תפריט ראשי</li>
                        <li id="signup">signup</li>
                        <li id="forgot">forgot password</li>
                    </ul>
                </div>
            </div>

            <div class="user-name">
                <i class="fas fa-user"></i>
                <input type="text" value ="${errUser.userName||""}" placeholder=" Name ">
            </div>
            <span class="err">${errServer.err||""}</span>

            <div class="password">
                <i class="fas fa-lock" ></i>
                <input type="password" value ="${errUser.password||""}" name="" id="" placeholder=" Password ">
            </div>
            <span class="err">${errServer.err||""}</span>

            <button class="button-log-in">Log in</button>

            <a href="">Forgot password click here</a>
        </div>`;

    mainDivForm.insertAdjacentHTML('afterbegin', form);
    
    const menuDiv = mainDivForm.querySelector('.menu');
    menuDiv.addEventListener('click', menu(mainDivForm));

    const linkToSignup = mainDivForm.querySelector('a');
    linkToSignup.addEventListener('click', function(event){
        event.preventDefault()
        enrollment.formSignUp(); 
        
    });

    return mainDivForm;
} */