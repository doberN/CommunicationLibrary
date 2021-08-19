import { checkUserConnect } from '../../funGeneralClasses/functionsGeneral.js';

export function menuComp(){

    const result = checkUserConnect();

    let listEnrollment = "";
    let listFollow = "";

    if(result){
        listEnrollment = `
        <li class="logout">התנתקות</li>
        <li class="update">פרופיל</li>

        `;
    }else{
        listEnrollment = `
        <li class="sign-up">הרשמה</li>
        <li class="login">התחברות</li>
        `;
    }

    if(result){
        listFollow = `
        <li class="followed">נעקבים</li>
        <li class="followers">עוקבים</li>
        `;
    }

    const menuDiv = document.createElement('div');
    menuDiv.classList.add("menu-box"); 

    const menu = ` 
        <div class="close">    
            <i class="fas fa-times close-panel"></i>         
        </div>
        <div class="file-sharing box">
            <i class="fas fa-file-upload"></i>
            <span>שיתוף קבצים</span>
        </div>
        <div class="chat box">
            <i class="fas fa-comments"></i>
            <span>צ'אט</span>
        </div>
        <div class="forum box">
            <i class="fas fa-comment-alt"></i>
            <span>פורום</span>
        </div>

        <div class="Friends box">
            <i class="fas fa-user-friends"></i>
            <span>חברים</span>
        </div>
    
        <div class="follow box">
            <div class="list hide">
                <ul>
                    ${listFollow}
                </ul>
            </div>
            <i class="fas fa-shoe-prints"></i>
            <span>עוקבים</span>
        </div>
    
        <div class="enrollment box">
            <div class="list hide scroll">
                <ul>
                    ${listEnrollment}
                </ul>
            </div>
    

            <i class="fas fa-sign-in-alt"></i>
            <span>חשבון</span>
        </div>
    
`;

    menuDiv.insertAdjacentHTML('afterbegin', menu);


    return menuDiv;
}