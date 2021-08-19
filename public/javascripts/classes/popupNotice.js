import { enrollment, } from '../initAllClasses/init.js';
import { panel } from '../initAllClasses/init.js';



export class PopupNotice{
    constructor(){

    }
    popupNotice(){

        if(panel.querySelector('.popupNotice')){
            panel.querySelector('.popupNotice').remove()
        }
        const popupNotice = document.createElement('div');
        popupNotice.classList = "popupNotice";
        popupNotice.innerHTML = ` <button>ok</button>`;
        const button = popupNotice.querySelector('button');
        
        button.addEventListener('click',function(){
            popupNotice.style.left = '150%';
        });
        return popupNotice;
    }

    successSignupNotice(){
        const windowPopupNotice = this.popupNotice();
        const html = ` 
            <i class="far fa-check-circle success"></i>
            <p> הצלחנו </p>
            <p>הצלחנו לשמור אותך בבמערכת שלנו</p>
        `;/**need to change : We have sent you an email for further verification */
        windowPopupNotice.insertAdjacentHTML('afterbegin', html);

        return windowPopupNotice;
    }

    needToLoginNotice(){

       const windowPopupNotice = this.popupNotice();

       const aTag = document.createElement('a');
       aTag.innerHTML = 'להתחברות';
       aTag.addEventListener('click', function(event){
            event.preventDefault();
            enrollment.loginForm();
       })
        const html = ` 
            <i class="fas fa-exclamation error"></i>
            <p> צריך להתחבר </p>
            <p>
                צריך להתחבר למערכת עם שם/אימייל וסיסמא
            </p>
        `;
        windowPopupNotice.insertAdjacentHTML('afterbegin', html);

        const p = windowPopupNotice.querySelector('p:nth-child(3)');
        
        p.appendChild(aTag);

        return windowPopupNotice;
    }

    notActiveNotice(){
        const windowPopupNotice = this.popupNotice();
        const html = ` 
            <i class="fas fa-user-check error"></i>
            <p> הפוך לאקטיבי </p>
            <p>הכנס לאיימיל שלך ואמת את זהותך</p>`;
        windowPopupNotice.insertAdjacentHTML('afterbegin', html);

        return windowPopupNotice;
    }  

    resetPasswordNotice(){
        const windowPopupNotice = this.popupNotice();
        const html = ` 
            <i class="fas fa-lock-open success"></i>
            <p> איתחול סיסמא </p>
            <p>שלחנו לך אימייל כדי שתוכל לאפס את הסיסמא</p>`;
        windowPopupNotice.insertAdjacentHTML('afterbegin', html);

        return windowPopupNotice;
    }

    errorUpload(){
        const windowPopupNotice = this.popupNotice();
        const html = ` 
            <i class="fas fa-exclamation error"></i>
            <p> השלם פרטים </p>
            <p>כתוב כותרת לקובץ</p>`;
        windowPopupNotice.insertAdjacentHTML('afterbegin', html);

        return windowPopupNotice;
    }
    
    successUploadNotice(){
        const windowPopupNotice = this.popupNotice();
        const html = ` 
            <i class="far fa-check-circle success"></i>
            <p> הצלחנו </p>
            <p>העלנו את הקובץ שלך</p>`;
        windowPopupNotice.insertAdjacentHTML('afterbegin', html);

        return windowPopupNotice;
    }

    successUpdateNotice(){
        const windowPopupNotice = this.popupNotice();
        const html = ` 
            <i class="fas fa-user-edit success"></i>
            <p> הצלחנו </p>
            <p>פרטי החשבון שלך עודכנו</p>`;
        windowPopupNotice.insertAdjacentHTML('afterbegin', html);

        return windowPopupNotice;
    }

    alreadyRateNotice(){
        const windowPopupNotice = this.popupNotice();
        const html = ` 
            <i class="fas fa-exclamation error"></i>
            <p> כבר דורג </p>
            <p>כבר דירגת את הפוסט הזה</p>`;
        windowPopupNotice.insertAdjacentHTML('afterbegin', html);

        return windowPopupNotice;
    }
    
    alreadyOffensive(){
        const windowPopupNotice = this.popupNotice();
        const html = ` 
            <i class="fas fa-exclamation error"></i>
            <p> כבר דווח</p>
            <p>הודעה זו כבר דווחה כפוגענית</p>`;
            
        windowPopupNotice.insertAdjacentHTML('afterbegin', html);

        return windowPopupNotice;
    }

    succefullyReported(){
        const windowPopupNotice = this.popupNotice();
        const html = ` 
            <i class="far fa-check-circle success"></i>
            <p> דווח בהצלחה </p>
            <p>תודה שדיווחת לנו</p>`;
        windowPopupNotice.insertAdjacentHTML('afterbegin', html);

        return windowPopupNotice;
    }

    deleteThreadNotice(){
        const windowPopupNotice = this.popupNotice();
        const html = ` 
            <i class="fas fa-ban error"></i>
            <p> פוגעני </p>
            <p>השרשור נמחק מכיוון שמכיל תוכן פוגעני</p>`;
        windowPopupNotice.insertAdjacentHTML('afterbegin', html);

        return windowPopupNotice;
    }

    createFollower(name){
        const windowPopupNotice = this.popupNotice();
        const html = ` 
            <i class="far fa-check-circle success"></i>
            <p> הנך עוקב </p>
            <p>הנך עוקב כרגע אחר  ${name}</p>`;
        windowPopupNotice.insertAdjacentHTML('afterbegin', html);

        return windowPopupNotice;
    }
    
    alreadyFollower(name){
        const windowPopupNotice = this.popupNotice();
        const html = ` 
            <i class="fas fa-exclamation error"></i>
            <p> כבר עוקב </p>
            <p>הנך כבר עוקב של ${name}</p>`;
        windowPopupNotice.insertAdjacentHTML('afterbegin', html);

        return windowPopupNotice;
    }

    failsRemoveFollower(name){

        const windowPopupNotice = this.popupNotice();
        const html = ` 
            <i class="fas fa-exclamation error"></i>
            <p> שגיאה </p>
            <p>לא היית עוקב שלו ${name}!</p>`;
        windowPopupNotice.insertAdjacentHTML('afterbegin', html);

        return windowPopupNotice;

    }

    removeFollower(name){

        const windowPopupNotice = this.popupNotice();
        const html = ` 
            <i class="far fa-check-circle success"></i>
            <p> הפסקת עוקבות </p>
            <p>אתה כבר לא עוקב אחר ${name}</p>`;
        windowPopupNotice.insertAdjacentHTML('afterbegin', html);

        return windowPopupNotice;

    }
    createFriend(name){
        const windowPopupNotice = this.popupNotice();
        const html = ` 
            <i class="far fa-check-circle success"></i>
            <p> הנך חבר </p>
            <p>אתה כרגע חבר של ${name}!</p>`;
        windowPopupNotice.insertAdjacentHTML('afterbegin', html);

        return windowPopupNotice;
    }
    
    alreadyFiend(name){
        const windowPopupNotice = this.popupNotice();
        const html = ` 
            <i class="fas fa-exclamation error"></i>
            <p> כבר חבר </p>
            <p>אתה כבר חבר של ${name}!</p>`;
        windowPopupNotice.insertAdjacentHTML('afterbegin', html);

        return windowPopupNotice;
    }

    
    welcome(){
        const windowPopupNotice = this.popupNotice();
        const html = ` 
            <i class="far fa-smile success"></i>
            <p> ברוך הבא </p>
            <p>עכשיו אתה יכול לשתף קבצים לצ'טט ולהגיב</p>`;
        windowPopupNotice.insertAdjacentHTML('afterbegin', html);

        return windowPopupNotice;
    }

    startFilterFriend(){
        const windowPopupNotice = this.popupNotice();
        const html = ` 
            <i class="fas fa-users success"></i>    
            <p> סינון חברים הופעל </p>
            <p>עכשיו תוכל לראות בהדגשה את הודעות חבריך</p>`;
        windowPopupNotice.insertAdjacentHTML('afterbegin', html);

        return windowPopupNotice;
    }

    stopFilterFriend(){
        const windowPopupNotice = this.popupNotice();
        const html = ` 
            <i class="fas fa-users success"></i>    
            <p> סינון חברים הופסק </p>
            <p> כרגע תראה את כל ההדעות ללא הדגשת הודעות מחברים</p>`;
        windowPopupNotice.insertAdjacentHTML('afterbegin', html);

        return windowPopupNotice;
    }
    /*

    alreadySignUp(){
        
       const aTag = document.createElement('a');
       aTag.innerHTML = 'here';
       aTag.addEventListener('click', function(event){
            event.preventDefault();
            enrollment.logout();
            enrollment.signUpForm();
       })

        const windowPopupNotice = this.popupNotice();
        const html = ` 
            <i class="fas fa-exclamation error"></i>
            <p> alrady! </p>
            <p>You are already registered in the system. If you want to exit the system click </p>`;
        windowPopupNotice.insertAdjacentHTML('afterbegin', html);

        const p = windowPopupNotice.querySelector('p:nth-child(3)');
        
        p.appendChild(aTag);

        return windowPopupNotice;
    }
    */
    
}









