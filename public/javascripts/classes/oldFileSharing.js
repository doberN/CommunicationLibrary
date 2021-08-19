import Rating from './rating.js';  
const rating = new Rating();

import Offensive from './offensive.js';  
const offensive = new Offensive();

export default class FileSharing{
    constructor(io){
        this.panel;
        this.socket = io;
        this.listenFile();
        this.listenToOffensive();
    }
    
    async showBoxFileSharing(){
        const socket = this.socket;
        const fileList = await this.getFileList();
        console.log(fileList);
           //!!!!!!!! its need to write in user client class !!!!!!!!
           const jwt = localStorage.getItem("jwt");
          
           socket.emit('login', jwt); 
           
           //!!!!!!!! its need to write in user client class !!!!!!!!
           const rate = this.rate.bind(this);

           const form = document.createElement('div');

           let offensive = this.offensive.bind(this)
     
             form.innerHTML=`
                <label>title</label>
                <input type="text" id="title-fileSharing"><br>
                <span id="span-title-fileSharing"></span>
                <label>image</label>
                <input type="file" id="upload-fileSharing"><br>
                <span id="span-upload-fileSharing"></span>
                <label>send</label>
                <button  id="button-upload-fileSharing">Upload file!</button><br><br>
                
                <label>like</label>
                <input type="submit" id="send-like-fileSharing" value="like"><br>   
                <label>dislike</label>
                <input type="submit" id="send-dislike-fileSharing" value="dislike"><br>
                <input type="text"  id="rate-fileSharing"><br>
                
                <input type="submit" value="sendOffensive" id="sendOffensive" class="sendOffensive"><br>
                <input type="text" id="inputoOffensive" class="offensive">`;

               
                 const file = form.querySelector('#upload-fileSharing');
                 const title = form.querySelector('#title-fileSharing')
                 const button = form.querySelector('#button-upload-fileSharing');
                const inputRate = form.querySelector('#rate-fileSharing')

                const likeButton = form.querySelector('#send-like-fileSharing');        
                likeButton.addEventListener('click', function(event){
                    const idFileRate = inputRate.value;
                    rate(idFileRate, 'FileSharing', socket, '+')
                });

                const disllikeButton = form.querySelector('#send-dislike-fileSharing');
                disllikeButton.addEventListener('click', function(event){
                    const idFileRate = inputRate.value;
                    rate(idFileRate, 'FileSharing', socket, '-')
                });
               
                var uploader = new SocketIOFileUpload(this.socket);
                uploader.listenOnSubmit(button, file);
                

                uploader.addEventListener("start", function(event){
                    event.file.meta.title = title.value;
                });

                   /*Offensive*/ 

                   const inputeOffensive = form.querySelector('#inputoOffensive');
                   const submitOffensive = form.querySelector('#sendOffensive');
                       
                   submitOffensive.addEventListener('click', function(){
                       offensive(inputeOffensive.value, 'FileSharing');
                   })
                /*Offensive*/ 
     
             this.panel.appendChild(form);

    }


    async getFileList(){
        const fileList = await fetch('http://localhost:3000/fileSharing/fileList',);
        const json = await fileList.json();

        return json;
    }

    async rate(idFileRate, room, socket, statusLike){
        const result = rating.rate(idFileRate, room, socket, statusLike);
        console.log(result)
        socket.on('rate', function(data){
            console.log(data);
        })
    }

    listenFile(){
        this.socket.on('sendFile',(data) =>{console.log(data)})
    }

    offensive(offensiveId, room){
        
        const socket = this.socket;
        const result = offensive.reporting(offensiveId, room, socket);
        console.log(result)
        
    }

    listenToOffensive(){
        socket.on('offensive', function(data){
            console.log(data);
        });
    }

}



const socket = io('http://localhost:3000');



const fileSharing = new FileSharing(socket);

document.querySelector('#panel').innerHTML ='<div class="fileSharing"></div>';
let FileSharingDiv = document.querySelector('.fileSharing');


fileSharing.panel = FileSharingDiv;
fileSharing.showBoxFileSharing();