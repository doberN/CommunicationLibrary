export default class User {
    constructor(){
        this.panel;
      //  this.signUp = this.signUp.bind(this);
    }
    showFormsSignUp(err = ""){
        
        const form = document.createElement('div');
      //  form.classList.add("form-sign-up");

        form.innerHTML=`
            <label>name</label>
            <input type="text" id="name-user-sign" value="${err.name||""}" ><br>
            <span id=" span-name-user-sign"></span>
            <label>password</label>
            <input type="password" id="password-user-sign" value="${err.password||""}"><br>
            <span id=" span-password-user-sign"></span>
            <label>email</label>
            <input type="email" id="email-user-sign" value="${err.email||""}"><br>
            <span id=" span-email-user-sign"></span>
            <label>image ${err.file||""}</label>
            <input type="file" id="file-user-sign" name="image"  accept="image/*"><br>
            <span id=" span-file-user-sign"></span>
            <label>send</label>
            <input type="submit" value="Submit" id="submit-user-sign" >`;

            const name = form.querySelector('#name-user-sign');
            const password = form.querySelector('#password-user-sign');
            const email = form.querySelector('#email-user-sign');
            const file = form.querySelector('#file-user-sign');
            const submit = form.querySelector('#submit-user-sign');
            const signUp = this.signUp;

            submit.addEventListener('click', function(){
                let fd = new FormData();
                fd.append('image', file.files[0]);
                fd.append('name', name.value);
                fd.append('password', password.value);
                fd.append('email', email.value);
                
               signUp(fd)
            
            });

        this.panel.appendChild(form);
        
    }

    async signUp(detailsSignUp){
 
        const response = await fetch(`http://localhost:3000/users/api/signUp`, {
        method:'POST',
        body: detailsSignUp,
        
        })
        .then(res => res.json())
        .then(json => console.log(json));
     
    }

    showFormsLogin(err = ""){
        const form = document.createElement('div');

        form.innerHTML=`
            <label>name</label>
            <input type="text" id="name-user-login" value="${err.name||""}" ><br>
            <span id=" span-name-user-login"></span>
            <label>password</label>
            <input type="password" id="password-user-login" value="${err.password||""}"><br>
            <span id=" span-password-user-login"></span>
            <label>send</label>
            <input type="submit" value="Submit" id="submit-user-login" >
           `;
 
            const name = form.querySelector('#name-user-login');
            const password = form.querySelector('#password-user-login');
            const submit = form.querySelector('#submit-user-login');
            const login = this.login;

            submit.addEventListener('click', function(){

                const userName = name.value;
                const userPassword = password.value;

                
               login(userName, userPassword)
            
            });
            this.panel.appendChild(form);
    }

    async login(userName, password){

        const response = await fetch(`http://localhost:3000/users/api/login`, {
            method:'POST',
            headers: {
                'Content-Type': 'application/json'
              },
            body: JSON.stringify({ userName, password }),
            })
            .then(res => res.json())   
            .then(json => {
                localStorage.setItem("jwt", json.token)
            });

    }  
    async showForgotLink(err = ""){
        const form = document.createElement('div');
        form.innerHTML=`
        <input type="email" id="email-user-forgot" value="${err.email||""}"><br>
        <input type="submit" value="Submit" id="submit-user-forgot" >
       `;
     
       const email = form.querySelector('#email-user-forgot');
       const submit = form.querySelector('#submit-user-forgot');
       const forgot = this.forgot;

       submit.addEventListener('click', function(){

        const userEmail = email.value;
        forgot(userEmail)
       
        });
        this.panel.appendChild(form);
    }
    forgot(email){
        const response = fetch(`http://localhost:3000/users/api/forgotPassword`, {
            method:'POST',
            headers: {
                'Content-Type': 'application/json'
              },
            body: JSON.stringify({ email:email }),
           
            })
            .then(res => res.json())   
            .then(json => console.log(json));
    }
    async showInputsUpdateUser(){
        let user = {};
        const jwt = localStorage.getItem("jwt");
        const response = await fetch(`http://localhost:3000/users/api/updateUser`, {
            method:'GET',
            headers: {
                'authorization': `Bearer ${jwt}`
              },
            })
            .then(res => res.json())   
            .then(json => user = json);
           
        const form = document.createElement('div');
        form.innerHTML=`
            <label>name</label>
            <input type="text" id="name-user-update" value="${user.name}" ><br>
            <span id=" span-name-user-update"></span>

            <label>new password</label>
            <input type="password" id="password-user-update" ><br>
            <span id=" span-password-user-update"></span>
   
            <label>email</label>
            <input type="email" id="email-user-update" value="${user.email}"><br>
            <span id=" span-email-user-update"></span>
            <label>old password</label>
            <input type="password" id="oldPassword-user-update" ><br>
            <span id="span-oldPassword-user-update"></span>

            <label>image</label>
            <input type="file" id="file-user-update" name="image"  accept="image/*"><br>
            <span id="span-file-user-update"></span>

            <label>send</label>
            <img src="http://localhost:3000/users/api/img/${user.id}" width="100" hight="100">
            <input type="submit" value="Submit" id="submit-user-updateUser" >`;
            
            

            const name = form.querySelector('#name-user-update');
            const nwePassword = form.querySelector('#password-user-update');
            const email = form.querySelector('#email-user-update');
            const file = form.querySelector('#file-user-update');
            const submit = form.querySelector('#submit-user-updateUser');
            const oldPassword = form.querySelector('#oldPassword-user-update');
            const updateUser = this.updateUser;

            submit.addEventListener('click', function(){
                let fd = new FormData();
                fd.append('image', file.files[0]);
                fd.append('name', name.value);
                fd.append('password', nwePassword.value);
                fd.append('email', email.value);
                fd.append('oldPassword', oldPassword.value);
                
                updateUser(fd)
            
            });
        this.panel.appendChild(form);
    }

    updateUser(fd){
        const jwt = localStorage.getItem("jwt");
        //let header = new Headers();
     
      //  header.append("Authorization",`Bearer ${jwt}`);
       // header.append("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiO…DQ1fQ.K50B1QJQse3wBGAJWpjPSBu5ahFW0rJY1dfUnWElt68");
        const response = fetch(`http://localhost:3000/users/api/updateUser`, {
            method:'POST',
            headers: {'Authorization':`Bearer ${jwt}`},
            body: fd,
            })
            .then(res => res.json())   
            .then(json => console.log(json));
    }
    
}

//////////////////
const user = new User();
    

document.querySelector('body').innerHTML = ` 
  <div class="sign"></div><br><hr><br>
<div class="login"></div><br><hr><br>
<div class="forgot"></div><br><hr><br>
<div class="updateUser"></div>`;

let login = document.querySelector('.login');
let sign = document.querySelector('.sign');
let forgot = document.querySelector('.forgot');
let updateUser = document.querySelector('.updateUser');

user.panel = login;
user.showFormsLogin();

user.panel = sign;
user.showFormsSignUp();

user.panel = forgot;
user.showForgotLink();  

user.panel = updateUser;
user.showInputsUpdateUser();



