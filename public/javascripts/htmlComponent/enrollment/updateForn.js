import { functionOfForm } from './funcionForm.js';
import { enrollment } from '../../initAllClasses/init.js';

export async function compFormUpdate(init = false, errUser, errServer){
 
    let user = {};
    
    const jwt = Cookies.get("jwt");
    if(init){
        await new Promise((resolve, reject)=>{

                fetch(`https://web-dober.herokuapp.com/users/updateUser`, {
                method:'GET',
                headers: {
                    'authorization': `Bearer ${jwt}`
                },
                })
                .then(res => res.json())   
                .then((json)=>{
                    user = json;
                    enrollment.currentImage = user.image;
                    enrollment.selectedImage = enrollment.currentImage
                    resolve();
                });
                
        });
        
    }

   
    const mainDivForm = document.createElement('div');
    mainDivForm.classList.add("update-user", "form-enrollment","scroll");
    const preview = previewImage(); 

    const form =`
        <div class="form">
            <div class="header">
                <div class="form-title">
                    Update   
                </div>
                <div class="menu">
                    <i class='fas fa-list-ul menu-pic'></i>
                    <ul>
                    <li class="menu">תפריט ראשי</li>
                    <li class="logout">logout</li>
                    <li class="reset">reset password</li>
                </ul>
                </div>
            </div>
            <div class="user-img">
                <input type="file" hidden>
                <img class="img" src="${preview}" alt="">
                <i class="fas fa-camera icon-update-pic"></i>
                <ul class="menu-chane-picture">
                    <li id="change">change picture</li>
                    <li id="cancel">cancel</li>
                    <li id="no picture">no picture</li>
                </ul>
            </div>
            <div class="user-name">
                <i class="fas fa-user"></i>
                <input type="text" value="${init?user.name:errUser.name}" placeholder=" Name ">
            </div>
            <span class="err">${errServer.name||""}</span>
 
            <div class="email">
                <i class="fas fa-at"></i>
                <input type="email" value="${init?user.email:errUser.email}" placeholder=" Email ">
            </div>
            <span class="err">${errServer.email||""}</span>

            <div class="new password">
                <i class="fas fa-lock" ></i>
                <input type="password" name="" value="${errUser.password||""}" id="" placeholder="new Password ">
            </div>
            <span class="err">${errServer.password||""}</span>
            <div class="confirm password">
                <i class="fas fa-lock" ></i>
                <input type="password" name=""  value="${errUser.confirmPassword||""}" placeholder="confirm password ">
            </div>
            <span class="err">${errServer.confirmPassword||""}</span>
            <span class="err">${errUser.err||""}</span>
            <div class="current-password">
                <i class="fas fa-lock"></i>
                <input type="password" name=""  value="${errUser.oldPassword||""}" placeholder=" old password ">
            </div>
            <span class="err">${errServer.oldPassword||""}</span>

            <button class="button-user-update">update</button>

        </div>`;
        mainDivForm.insertAdjacentHTML('afterbegin', form);
        const chanePic = mainDivForm.querySelector('.menu-chane-picture');
        
        chanePic.addEventListener('click', choosePic(mainDivForm));

        functionOfForm(mainDivForm);
        return mainDivForm;
    }

    
    function previewImage(){
        
        if(enrollment.selectedImage){
            return enrollment.selectedImage;
        }
        else{
            return enrollment.currentImage;
        }
    }

    function choosePic(form){

        const menuPic = form.querySelector('.menu-chane-picture');
        const imgEl = form.querySelector('.img');
        const imageType = ['apng', 'avif', 'avif', 'jpg', 'jpeg', 'jfif', 'pjpeg', 'pjp', 'png', 'svg', 'webp'];

        const inputFile = form.querySelector('input[type="file"]');
        inputFile.addEventListener('change', function(){

        if(!inputFile.value) {
            enrollment.selectedImage = null;
            imgEl.src = enrollment.currentImage;
            return;
        }
        if(!imageType.includes(inputFile.files[0].type.split('/')[1])) return;

            const image = inputFile.files[0]

            const reader = new FileReader();
            reader.onload = function(){
                const result = reader.result;
                enrollment.selectedImage = result;
                imgEl.src = result;
            }
            reader.readAsDataURL(image);

        });
        return function(event){
            const typeCoose = event.target.id;
            switch (typeCoose) {

                case 'change':
                    inputFile.click();
                    break;

                case "cancel":

                    if(inputFile.value = "") return;
                    inputFile.value = "";
                    enrollment.selectedImage = enrollment.currentImage;
                    imgEl.src = enrollment.currentImage;
                    break;

                case "no picture":
                    inputFile.value = "";
                    enrollment.selectedImage = null;
                    imgEl.src = enrollment.defaultPic;
            }
            menuPic.style.display = 'none';
        }
        
    }




