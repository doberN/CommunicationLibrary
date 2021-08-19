const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken');
const multer = require('multer');
const request = require('request');
const fs = require('fs');
const { Op } = require('sequelize');

const db = require('../sequelize/models');
const emailExistence = require('email-existence');

const Notification = require('./notification');
const notification = new Notification();


class User{
    async signUp(detailsUser){

        const resultErrorClient = await this.checkValidInformation(detailsUser);

        //Checks for data error
        if(Object.keys(resultErrorClient).length>0)   return resultErrorClient;

            const userResult = await this.createUser(detailsUser);

            const subject = 'היכנס לקישור לאמת את חשבונך';
            const html = `<a href='https://web-dober.herokuapp.com/users/signUp/authentication?param=${userResult.userEmailJwt}'>לחץ כאן על מנת לאמת את חשבונך<a>`;
            
            notification.sendEmail(userResult.email, subject, html);
            //await notification.sendEmailToAutenticate(userResult.email, userResult.userEmailJwt);

            return { success:'We will send you an email for verification' }
       
    }
   
    async checkValidInformation(detailsUser){

        let resultErrorClient = {};
        
        //check Check valid name
        if('name' in detailsUser){
            const { name } = detailsUser;

            if( name == ""  ){
                resultErrorClient.name = "at least four characters";
            }
            else{
                const uniqueUser = await db.User.findOne({where: { name:name }});
                if(uniqueUser){
                    resultErrorClient.name = "This user already exists";
                }
            }

        }

         //check Check valid password
        if('password' in detailsUser){
            const { password } = detailsUser;

            const regularExpressionPassword =/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;/*/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/*/
            const checkPassword = regularExpressionPassword.test(password);

            if( !checkPassword){
                resultErrorClient.password = "at least: eight characters, one letter, one number";
            }
        }

        if('email' in detailsUser){
            const { email } = detailsUser;

            const resultLegalEmail = await this.checkEmailValid(email);
            if(!resultLegalEmail) {
                resultErrorClient.email =  "Type a real email"
            }else{
                const uniqueEmail = await db.User.findAll({where: { email:email }});
                if(uniqueEmail != ""){
                    resultErrorClient.email =   "This email already exists";
                }
            };

        }
         
        return resultErrorClient;
    }
 
    async checkEmailValid(email){
        let promisValidEmail = await new Promise((resolve, reject) => {

            emailExistence.check(email, function(error, response){
                if(response){
                    resolve(true)
                }else{
                    resolve(false)
                }
            });  

          });
          return promisValidEmail;
     
    }

    async createUser(detailsUser){

        const myPlaintextPassword = detailsUser.password;
        detailsUser.password = bcrypt.hashSync(myPlaintextPassword, 10);
        
    
        const image = 'https://web-dober.herokuapp.com/usersImages/user23454644322456765545.jpg';
        const result = await db.User.create({
            name:detailsUser.name,
            password:detailsUser.password,
            email:detailsUser.email,
            active:/*false*/1,/*need to change to false*/
            image:image,
        });

        const userEmail = result.email;
        const userEmailJwt = jwt.sign({ email: userEmail },process.env.SECRET_TOKEN,);

        return {userEmailJwt, email:detailsUser.email};
    
    }

    async doActiveUser(emailUserJwt){


        if(emailUserJwt == null) return false;
        let userEmail="";

        jwt.verify(emailUserJwt, process.env.SECRET_TOKEN, (err, user)=>{
            if(err) return false;
           userEmail = user.email;
        });
       
        const active =  await db.User.update({ active:true },{ where: { email:userEmail, active:false } });
        return active;
    }; 
      
    checklegalFile() {
       
        const postPhotoUpload = multer({
            storage: multer.memoryStorage(),
            limits: {
                fileSize: 2 * 1024 * 1024,
            },
            fileFilter: function (req, file, cb) {
                const fname = file.originalname;
                const valid = [
                    '.jpg',
                    '.png', 
                    '.jpeg' 
                ].find(ext => fname.endsWith(ext));
                cb(null, valid);
            }  
        }).single('image');
         
        return postPhotoUpload;
 
        }

        async login(userDetails){
            
            const exist = await this.checkExistUser(userDetails);
            if(!exist) return { err:'your name/email or password are incorrect' };
            if(!exist.active) return{ notActive: 'check your email to active account' }; 

            const userId = exist.id;
            const userJwt = jwt.sign({ userId: userId },process.env.SECRET_TOKEN,{expiresIn:'7d'});

            return {success:'welcome', token:userJwt, };
            
        }

        async checkExistUser(userDetails){
            const { userNameOrEmail, password } = userDetails;

            const result =  await db.User.findOne({where: { [Op.or]: [{ name: userNameOrEmail }, { email: userNameOrEmail }] } } );
            if(!result)return false;
                     
            let compare = bcrypt.compareSync(password, result.password);
            if(!compare) return false;

            return result;
        }
        
        async forgot(email){/*
            const resultLegalEmail = await this.checkEmailValid(email);

            if(!resultLegalEmail) return 'type a valid email';*/
           
            const result =  await db.User.findOne({where: {email} } );
            
            if(!result) return {err: 'type a valid email'};
            if(!result.active) return{ notActive: 'check your email to active account' }; 
   
            const myPlaintextPassword = result.password;
            const hash = bcrypt.hashSync(myPlaintextPassword, 10);

            const resetToken = jwt.sign({ email: email, passwordHash:hash },process.env.SECRET_TOKEN,{expiresIn:'30m'});

            const subject = 'איפוס סיסמא';
            const html = `<a href="https://web-dober.herokuapp.com/users/checkLinkForgotPassword?param=${resetToken}">לחץ לאיפוס סיסמא</a>`;
            notification.sendEmail(email, subject, html);
            
            return  { success:'we send you email to reset your password' };
        } 

        async checkTokenResetPassword(jwtResetPassword){
            let userDetails = "";

            jwt.verify(jwtResetPassword, process.env.SECRET_TOKEN, (err, user)=>{
                userDetails = user;
            });
            if(!userDetails) return userDetails;

            const userExist = await db.User.findOne({where: {active:true, email:userDetails.email}});
            if(!userExist) return userExist;

            let compare = bcrypt.compareSync(userExist.password, userDetails.passwordHash);
            if(!compare) return compare;

            return { jwtResetPassword, email:userExist.email} ;
        }
        async resetPassword(token, password){

            const testToken = await this.checkTokenResetPassword(token);
            if(!testToken) return false;

            const regularExpressionPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
            const checkPassword = regularExpressionPassword.test(password);
    
            if( !checkPassword){
                return { err: "at least: eight characters, one letter, one number" };   
            } 

            const myPlaintextPassword = password;
            const hash = bcrypt.hashSync(myPlaintextPassword, 10);

            const resetPassword =  await db.User.update({ password:hash },{ where: { email:testToken.email, } });
            return {success: 'your password was change' };
        }

        userAutenticate(req, res, next){
            const authHeader = req.headers['authorization'];
            const token = authHeader && authHeader.split(' ')[1];
            if(token == null) return res.sendStatus(401);

            jwt.verify(token, process.env.SECRET_TOKEN, (err, user) => {
                if(err) return res.sendStatus(401);
                req.user = user;
                next();
            });
        }
        async detailsForUpdate(user){
            const id = user.userId;
            const userDetails = await db.User.findOne({where: { id }, attributes: ['name','email', 'image', 'id']} );
            return userDetails
        }
        async updateUser(detailsUpdateUser){
   
            const { userId, oldPassword } = detailsUpdateUser;
            const userExist = await db.User.findOne({where: { id:userId } });
           
            if(!userExist) return /*{ result:'login again to system' }*/;
            
            //if(!'image' in detailsUpdateUser) return { result:'your picture not legal' };
      

            const filter = this.filterUpdate(detailsUpdateUser, userExist);

            if(detailsUpdateUser.image){
                filter.image = `https://web-dober.herokuapp.com/usersImages/${detailsUpdateUser.image}`;
            }
            

            const resultErrorClient = await this.checkValidInformation(filter);

                  
            let compare = bcrypt.compareSync(oldPassword, userExist.password);
            if(!compare) resultErrorClient.oldPassword = 'your password not good' ;
            userExist.password = oldPassword;
            
            if(Object.keys(resultErrorClient).length!=0 || !compare) return resultErrorClient;
            if(Object.keys(filter).length==0 && !filter.image) return { success: 'was update' };

            if(filter.password){
                filter.password = bcrypt.hashSync(filter.password, 10)
            }
            
            if(filter.image && filter.image != 'https://web-dober.herokuapp.com/usersImages/user23454644322456765545.jpg'){

                fs.writeFile(`./filesAndImages/usersImages/${detailsUpdateUser.image}`, detailsUpdateUser.file.buffer,'base64', function (err) {

                });
            }         
            if(filter.image && userExist.image != 'https://web-dober.herokuapp.com/usersImages/user23454644322456765545.jpg'){
                const oldImage = userExist.image.split('/')[userExist.image.split('/').length-1];
                fs.unlink(`./filesAndImages/usersImages/${oldImage}`, (err) => {
                    if (err) {
                    console.error(err)
                    return
                    }
              })
            }
            
            const result = await db.User.update(filter,{ where:{ id:userId } });
            return { success: 'was update' };
        }

         filterUpdate(user, userInDb){
            let finalDetails = {};

             if((user.password != "") && user.password != user.oldPassword){
                finalDetails.password = user.password;
             }
             if(user.email != userInDb.email){
                finalDetails.email = user.email;
             }
             if(user.name != userInDb.name){
                 finalDetails.name = user.name;
             }
             return finalDetails; 
             
        }
        
        verifyUser(token){
            
            let userId;
            jwt.verify(token, process.env.SECRET_TOKEN, (err, user) => {
                if(err) return err;
                userId = user.userId;
            });

            return userId;
        }

        async profile(userId){

            const user = await db.User.findOne({
                attributes:['name', 'image'],
                where:{ id:userId }, 
            });

            const followers = await db.Followers.count({
                where:{ followed:userId }, 
            });

            const friends = await db.Friends.count({
                where:{ friend_two:userId }, 
            });
         
            const posts = await db.Forum.count( {
                where:{ userId },
            });

            return { followers, friends, posts, user }
        }
         
    }

module.exports = User;


//it'l work only id 2 becuase youre token is id 2, please send to user when he login a real token
/* update: if no have image in file its say i dont want to change if is undefind is user
no want image */