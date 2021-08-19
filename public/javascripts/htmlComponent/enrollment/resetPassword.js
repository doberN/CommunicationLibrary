import { functionOfForm } from './funcionForm.js';

export function compFormResetPassword(errUser, errServer){
    const mainDivForm = document.createElement('div');
    mainDivForm.classList.add("reset-password", "form-enrollment"); 

    const form = `
        <div class="form">

            <div class="header">
                <div class="form-title">
                    Reset password   
                </div>
                <div class="menu">
                    <i class='fas fa-list-ul menu-pic'></i>
                    <ul>

                        <li class="menu">תפריט ראשי</li>
                        <li class="logout">logout</li>
                        <li class="update">update</li>
                  
                    </ul>
                </div>
            </div>
            <div class="email">
                <i class="fas fa-at"></i>
                <input type="email"  value ="${errUser.email||""}" placeholder=" Email ">
            </div>
            <span class="err">${errServer.err||""}</span>
            <button class="button-reset-password">send me instruction</button>

        </div>`;

    mainDivForm.insertAdjacentHTML('afterbegin', form);
    functionOfForm(mainDivForm);


    return mainDivForm;
}