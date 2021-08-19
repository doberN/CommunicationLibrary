/********************************************************** */
/* MODULE Socket                                            */
/* Version 0.5                                              */
/* Date: 21/01/21                                           */
/* Author: Dovbear Nimitz                                   */
/* (c) 2021                                                 */
/************************************************************/

var siofu = require("socketio-file-upload");  
const socketio = require('socket.io');
const jwt = require('jsonwebtoken');
const db = require('../sequelize/models');
const multer = require('multer')
const { sequelize } = require('../sequelize/models/index.js');

const logger = require('../logger')

var FileSharing = require('../classes_server/fileSharing.js');
const fileShaing = new FileSharing();

var User = require('../classes_server/user.js');
const user = new User();

var Chat = require('../classes_server/chat.js');
const chat = new Chat();

var Forum = require('../classes_server/forum.js');
const forum = new Forum();

var Rating = require('../classes_server/rating.js');
const rating = new Rating();

var Offensive = require('../classes_server/offensive.js');
const offensive = new Offensive();

var Followers = require('../classes_server/followers.js');
const { json } = require("express");
const followers = new Followers();

const users = [];

class socket{
    constructor(){
      this.io;
    }
    
    connection(server){ 
         
        const sendMessageChat = this.sendMessageChat.bind(this);
        const uploadFile = this.uploadFile.bind(this)
        const sendThreadForum = this.sendThreadForum.bind(this);
        const sendCommentForum = this.sendCommentForum.bind(this)
        const rate = this.rate.bind(this);
        const offensive = this.offensive.bind(this)

        this.io = socketio(server,{ cors: {origin:process.env.APPROVE_DOMAINS}});
        let io = this.io;

        io.on('connection',async function(socket){
    
            //console.log('user was connect')
            const domain = socket.handshake.headers.referer;

            socket.join(domain);
            socket.on('login',async function(token){
                
                const userId = user.verifyUser(token)
                if(!userId) return false;
                //console.log(`user ${userId} was login`)
            

                ////
              
                socket.emit('userId',userId);
            
                const userNane = await db.User.findOne({where: { id:userId }});
                socket.join(userId);
               

                socket.domain = domain;
                socket.userId = userId;
                socket.image = userNane.image;
                socket.name = userNane.name;
                logger.info('is connected' + socket.name)
                logger.info('is connected')
                sendMessageChat(socket);
                uploadFile(socket);
                sendThreadForum(socket);
                sendCommentForum(socket)
                rate(socket);
                offensive(socket);
               
            });

            socket.on('disconnect', function(){
                //console.log('leave')
                socket.leave(socket.domain);
                socket.leave(socket.userId);
            })
           
        }); 
    }
    
    sendMessageChat(socket){
        const io = this.io;

        socket.on('sendMessageChat',async function(data){

            const { userMessage } = data;
            if(userMessage.message == "") return;
            const { reply } = data.userMessage;
      
            userMessage.userId = socket.userId;
            userMessage.domain = socket.domain;
            userMessage.reply_idMessage = userMessage.reply.id
            const createMessage = await chat.sendMessage(userMessage);

            const message = 
            {
                id:createMessage.id,
                userId:createMessage.userId,
                message:createMessage.message,
                name:socket.name,
                replyIdMessage:userMessage.reply.id,
                image:socket.image,
            }
            if(Object.keys(reply).length != 0){
                message.reply = reply;
            }

           io.to(socket.domain).emit('sendMessageChat', message);
        })
    }
 
    uploadFile(socket){
     
     
       const io = this.io;            
        var uploader = new siofu();
        
        let fileName;
        let filePathIndb;
        let fileTitle;
        let rsultUpload;

        uploader.listen(socket);
        uploader.on('start',async function(event){
            try{
               
            const extensionValid = fileShaing.legalExtension(event.file.name);
            if(!extensionValid){return uploader.abort(event.file.id, socket)};
            if(!event.file.meta.fileTitle) return;
  
            const typeFile = event.file.meta.typeFile;
            const category = fileShaing.folderNameForSave(typeFile);

            if(!category){ uploader.abort(event.file.id, socket)};

            fileName = event.file.name;
            event.file.name = Date.now() + fileName;

            uploader.dir =  `./filesAndImages/${category}`;

            const { userId, domain } = socket;
            filePathIndb = `https://web-dober.herokuapp.com/${category}/`+event.file.name;
            const fileTitle = event.file.meta.fileTitle;
            rsultUpload = await fileShaing.uploadFile({ userId, domain, fileName, fileTitle, filePath:filePathIndb} )
            logger.info('was upload')
        }catch(err){
            logger.error(err)
        } 
        
        })
        uploader.on('saved', function(event){
            try{
            const nowDate = new Date().toLocaleTimeString([],{ hour: '2-digit', minute: "2-digit", hour12: false });
            const  { id, fileTitle , filePath, userId, fileName } = rsultUpload;
            const newFile = { id, userId, fileTitle,  filePath, fileName, user:socket.name, image:socket.image, rate:0, date:nowDate };
            io.to(socket.domain).emit('sendFile', newFile);

            logger.info('was save and send user')
        }catch(err){
            logger.error(JSON.stringify(err))
        } 
        })
        uploader.on("error", function(event){
            logger.error(JSON.stringify(event))
        });
        
    }

    sendThreadForum(socket){
        const io = this.io;
       
        
        socket.on('sendThreadForum',async function(data){
            try{
                const nowDate = new Date().toLocaleTimeString([],{ hour: '2-digit', minute: "2-digit", hour12: false });
                data.userId = socket.userId;
                data.domain = socket.domain;
                
                const result = await forum.sendThread(data);
                if(!result) return;
    
                const { id, userId, title, message } = result;
    
                const newThread = { id, userId, name:socket.name, image:socket.image, title, message, response:0, rating:0, date:nowDate };
    
                io.to(socket.domain).emit('sendThreadForum', newThread);
    
                followers.sendToFollowers(socket.userId, socket.domain, result, io);

                logger.info(socket.name + ': is success')
            }catch(err){
                logger.error(err)
            }
      
           
        })
    }
    sendCommentForum(socket){
 
        const io = this.io;

        socket.on('sendCommentForum', async function(comment){
            try{

            const { data, reply } = comment; 
            data.userId = socket.userId;
            data.domain = socket.domain;
            if(data.replyPostId == data.parent) return;
  
            const result = await forum.sendComment(data);
            if(!result) return;
           

            const { id, userId, parent, message, reply_idForum, } = result;

            const newComment = { id,
                userId,
                name:socket.name,
                parent,
                message,
                reply_idForum,
                image:socket.image, 
                date:new Date(),
                rating:0,
            }
            if(reply){
                newComment.reply = reply; 
            }
         
           io.to(socket.domain).emit('sendCommentForum', newComment);
           logger.info(socket.name+' :is success')
        }
           catch(err){
            logger.error(JSON.stringify(err))
            }
           
        });

    }
    rate(socket){
        const io = this.io;
        socket.on('rate',async function(data){
            try{
                logger.info('was rating')
            const result = await rating.rate(data);
            io.to(socket.domain).emit('rate', data);
            } 
            catch(err){
                logger.error(JSON.stringify(err))
            }
        });
    }

    offensive(socket){
        const io = this.io;
        socket.on('offensive',async function(data){
            const deleteMessage = await offensive.reporting(data)
            if(deleteMessage != false){
                io.to(socket.domain).emit('offensive', data);
            }
           
        });
    }
}

module.exports = socket;