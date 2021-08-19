import { fileSharingComp, newFile } from '../htmlComponent/plugin/fileSharing.js';
import { popupNotice, menu } from '../initAllClasses/init.js';
import { socket } from '../initAllClasses/initSocket.js'
import { messageScroll, statusScroll, isNewReporting, updateLocalStorage } from '../htmlComponent/plugin/pluginFunction.js';
import { getProfile, checkUserConnect } from '../funGeneralClasses/functionsGeneral.js';

export class FileSharing{
    constructor(panel){
        this.panel = panel;
  
        this.io = socket.socket;
        this.uploadForm = this.uploadForm.bind(this);
        this.closeUpload = this.closeUpload.bind(this);
        this.chooseFile = this.chooseFile.bind(this);
        this.previewFile = this.previewFile.bind(this);
        this.cancel = this.cancel.bind(this);
        this.upload = this.upload.bind(this)
        this.fileTitle = this.fileTitle.bind(this)
        this.rate = this.rate.bind(this)
        this.offensive = this.offensive.bind(this);
        this.getFiles = this.getFiles.bind(this);
        this.profile = this.profile.bind(this);

        this.newFile();
        this.newRate();
        this.deleteOffensive();
       
    }

    fileSharingBox(){
        this.fileSharing = fileSharingComp();
        this.lastFile = 0;
        this.elements = this.getElement()
        this.getFiles();
        const { openForumUpload } = this.elements;
        openForumUpload.addEventListener('click', this.uploadForm());

        const { buttonExitUpload } = this.elements;
        buttonExitUpload.addEventListener('click', this.closeUpload());

        const { selectFile } = this.elements;
        selectFile.addEventListener('click', this.chooseFile);

        const { fileTitle } = this.elements;
        fileTitle.addEventListener('input', this.fileTitle());

        const { inputFile } = this.elements;
        inputFile.addEventListener('change', this.previewFile());

        const { buttonCancel } = this.elements;
        buttonCancel.addEventListener('click', this.cancel())

        const { buttonUpload } = this.elements;
        buttonUpload.addEventListener('click', this.upload());

        const { allFiles } = this.elements;
        allFiles.addEventListener('click', this.profile);
        allFiles.addEventListener('click', this.rate);
        allFiles.addEventListener('click', this.offensive);

        allFiles.autoScroll = true;
        allFiles.addEventListener('scroll',(event)=>{  
            statusScroll(allFiles);
            if(event.target.scrollTop < 600)  this.getFiles();
        });

        this.panel.currentComp = 'fileSharing';
        this.panel.innerHTML="";

        this.panel.appendChild(this.fileSharing); 
    }
    
    getElement(){
        const openForumUpload = this.fileSharing.querySelector('.open-forum-upload');
        const forumUpload = this.fileSharing.querySelector('.form-upload');
        const inputFile = this.fileSharing.querySelector('.input-file');
        const selectFile = this.fileSharing.querySelector('.button-select');
        const buttonExitUpload = this.fileSharing.querySelector('.exit');
        const buttonCancel = this.fileSharing.querySelector('.button-cancel');
        const buttonUpload = this.fileSharing.querySelector('.button-upload');
        const preview = this.fileSharing.querySelector('.preview-file');
        const buttonSelect = this.fileSharing.querySelector('.button-select');
        const fileTitle = this.fileSharing.querySelector('.file-title input');
        const allFiles = this.fileSharing.querySelector('.all-file-sharing');
        

        return {
            openForumUpload, forumUpload, inputFile,
            selectFile, buttonExitUpload, buttonCancel,
            buttonUpload, preview, buttonSelect,fileTitle,
            allFiles, 
        }
    }

    uploadForm(){
        const { forumUpload, buttonUpload, inputFile, fileTitle } = this.elements;

        const uploader = new SocketIOFileUpload(this.io);
        uploader.listenOnSubmit(buttonUpload, inputFile);
        uploader.addEventListener("start", function(event){
            const typeFile = inputFile.files[0].type.split('/')[0];
            event.file.meta.fileTitle = fileTitle.value;
            event.file.meta.typeFile = typeFile;
        });
        const thisClass = this;
        return function(){
            const result = checkUserConnect();
           
            if(!result) return  panel.appendChild(popupNotice.needToLoginNotice());
 
            forumUpload.style.display = 'block';
            forumUpload.style.display = 'flex';
        }
        
    }
    fileTitle(){
        const { inputFile, buttonUpload, fileTitle } = this.elements;
        return function(){
            if(inputFile.value && fileTitle.value.trim()){
                buttonUpload.classList.add('active-upload');
              }else{
                buttonUpload.classList.remove('active-upload');
              }  
            
        }
    }
    chooseFile(){
        const { inputFile } = this.elements;
        inputFile.click();
        
    }

    closeUpload(){
        const { forumUpload } = this.elements;
        return function(){
            forumUpload.style.display = 'none';
        }
    }

    previewFile(){

        const imgPreview = document.createElement('img');

        const { preview, buttonSelect, buttonCancel, buttonUpload, inputFile, fileTitle } = this.elements;

        return function(event){   

            if(event.target.value){
                const file = event.target.files[0];
                const typeFile = file.type.split('/')[0];
              
                if(typeFile == 'image'){
                 
                    const reader = new FileReader();
                    reader.onload = function(){
                        const result = reader.result;
                        imgPreview.src = result 
                        preview.appendChild(imgPreview);
                    }
                    
                    reader.readAsDataURL(file);
                }
                else if(typeFile == 'audio'){
                    imgPreview.src = "https://web-dober.herokuapp.com/picture/audio.png";
                    preview.appendChild(imgPreview);
                }
                else if(typeFile == 'video'){
                    imgPreview.src = "https://web-dober.herokuapp.com/picture/video.png";
                    preview.appendChild(imgPreview);
                }
                else{
                    imgPreview.src = "https://web-dober.herokuapp.com/picture/file.jpg";
                    preview.appendChild(imgPreview);
                }

            buttonSelect.style.display = 'none';
            preview.classList.add("remove-border");
            buttonCancel.classList.add('active-cancel');

            if(inputFile.value && fileTitle.value.trim()){
                buttonUpload.classList.add('active-upload');
              };
            
            }

        }
    }

    cancel(){
        const { inputFile, buttonCancel, buttonUpload, preview, buttonSelect, } = this.elements;


        return function(){
            if(!inputFile.value) return;
            inputFile.value = "";
            buttonCancel.classList.remove('active-cancel');
            buttonUpload.classList.remove('active-upload');
            preview.querySelector('img').remove();
            preview.classList.remove("remove-border");
            buttonSelect.style.display = 'block';
        }
    }

    upload(){
        const { forumUpload, inputFile, buttonCancel, buttonUpload, preview, buttonSelect, fileTitle } = this.elements;
        const thisClass = this;
        return function(){
            if(!inputFile.value || !fileTitle.value.trim()){
              return  thisClass.panel.appendChild(popupNotice.errorUpload());
            };

            thisClass.panel.appendChild(popupNotice.successUploadNotice())
            inputFile.value = "";
            buttonCancel.classList.remove('active-cancel');
            buttonUpload.classList.remove('active-upload');
            preview.querySelector('img').remove();
            preview.classList.remove("remove-border");
            buttonSelect.style.display = 'block';
            fileTitle.value = "";
            forumUpload.style.display = "none";
            
        }
    }

    newFile(){

 
        this.io.on('sendFile', file =>{
            if(this.panel.currentComp != 'fileSharing') return;
            const allFileSharing = this.fileSharing.querySelector('.all-file-sharing');
            
            this.removeStartCompText();
          
            const htmlfile = newFile(file)
           
            allFileSharing.insertAdjacentHTML('beforeend', htmlfile);
       
            messageScroll(allFileSharing);
        });
    }
    
    newRate(){
        
        this.io.on('rate', rate =>{
            if(this.panel.currentComp != 'fileSharing') return;
            const allFileSharing = Array.from(this.fileSharing.querySelectorAll('.box-file'));
            
    
            const element = allFileSharing.find(element => element.id == rate.idData);
            if(!element) return;

            const rateEl = element.querySelector('.number');
            rate.statusRate == 'like' ? rateEl.innerHTML++:rateEl.innerHTML--;

        });
    }

    async getFiles(){
        const { allFiles } = this.elements;
        if(allFiles.Loading == true) return;
        allFiles.Loading = true;

        this.removeStartCompText();
        fetch(`https://web-dober.herokuapp.com/fileSharing/fileList`, {
            method:'POST',
            headers: {
                'Content-Type': 'application/json',
                },
            body: JSON.stringify({lastFile:this.lastFile}),   
            })
            
            .then( res => res.json())
            .then( filesFromServer => {
              
                if(filesFromServer.result.length === 0) return

                this.lastFile = filesFromServer.result[0].id;
                let fileList ="";
                allFiles.Loading = false;
                filesFromServer.result.forEach((value)=>{
                    fileList += newFile(value);
                });
                
              allFiles.insertAdjacentHTML('afterbegin', fileList);
              messageScroll(allFiles);
    
                
            });  
        
    }
    
    rate(e){
        const rateClass = String(e.target.classList);
        if(!rateClass.includes("like","dislike")) return;

        const result = checkUserConnect();
        
        if(!result) return panel.appendChild(popupNotice.needToLoginNotice());
        
        const idFile = e.target.closest('.box-file').id;
        const room = 'FileSharing';

        const newRate = isNewReporting(room, idFile, 'rate');

        if(!newRate) return this.panel.appendChild(popupNotice.alreadyRateNotice());
        let statusRate;

        if(rateClass.includes("dislike")){
            statusRate = "dislike";
        }else{
            statusRate = "like";
        }

        updateLocalStorage(room, idFile, 'rate');
        this.io.emit('rate', {room, idData:idFile, statusRate})
        
    }

    removeStartCompText(){
        if(this.fileSharing.querySelector('.start-file-sharing')){
            const start = this.fileSharing.querySelector('.start-file-sharing');
            start.remove();
        }
    }

    offensive(e){
        const classEl = e.target.className;

        if(!classEl.includes("offensive")) return;

        const result = checkUserConnect();
   
        if(!result) return panel.appendChild(popupNotice.needToLoginNotice());

        const offensiveId = e.target.closest('.box-file').id;
        const room = 'FileSharing';

        const newReporting = isNewReporting(room, offensiveId, 'offensive');

        if(!newReporting) return this.panel.appendChild(popupNotice.alreadyOffensive());

        updateLocalStorage(room, offensiveId, 'offensive');
        this.io.emit('offensive', {room, offensiveId});

        this.panel.appendChild(popupNotice.succefullyReported())
    }

    deleteOffensive(){

        this.io.on('offensive',(file)=>{
           
            if(file.room!='FileSharing' || this.panel.currentComp != 'fileSharing') return;
            const allFiles =  Array.from(this.fileSharing.querySelectorAll('.box-file'));
            const element = allFiles.find(element => element.id == file.offensiveId);
            if(!element) return;
            element.remove();
        });
    }


    profile(e){

        const className = e.target.className;
        if(!className.includes('name')) return;
        const userId = e.target.id;
        getProfile(userId);
  
    }

}




/**
 * import { fileSharingComp, newFile } from '../htmlComponent/plugin/fileSharing.js';
import { popupNotice } from '../initAllClasses/init.js';
import { socket } from '../initAllClasses/initSocket.js'
import { messageScroll, statusScroll, isNewReporting, updateLocalStorage, checkUserConnect } from '../htmlComponent/plugin/pluginFunction.js';

export class FileSharing{
    constructor(panel){
        this.panel = panel;
        this.fileSharing = fileSharingComp();
        this.io = socket.socket;
        this.uploadForm = this.uploadForm.bind(this);
        this.closeUpload = this.closeUpload.bind(this);
        this.chooseFile = this.chooseFile.bind(this);
        this.previewFile = this.previewFile.bind(this);
        this.cancel = this.cancel.bind(this);
        this.upload = this.upload.bind(this)
        this.fileTitle = this.fileTitle.bind(this)
        this.rate = this.rate.bind(this)
        this.offensive = this.offensive.bind(this);
        this.elements;
        this.newFile();
        this.newRate();
        this.deleteOffensive();
        this.lastFile = 0;
        this.getFiles = this.getFiles.bind(this);
    }

    fileSharingBox(){
        this.elements = this.getElement()
        this.getFiles();
        const { openForumUpload } = this.elements;
        openForumUpload.addEventListener('click', this.uploadForm());

        const { buttonExitUpload } = this.elements;
        buttonExitUpload.addEventListener('click', this.closeUpload());

        const { selectFile } = this.elements;
        selectFile.addEventListener('click', this.chooseFile);

        const { fileTitle } = this.elements;
        fileTitle.addEventListener('input', this.fileTitle());

        const { inputFile } = this.elements;
        inputFile.addEventListener('change', this.previewFile());

        const { buttonCancel } = this.elements;
        buttonCancel.addEventListener('click', this.cancel())

        const { buttonUpload } = this.elements;
        buttonUpload.addEventListener('click', this.upload());

        const { allFiles } = this.elements;
        allFiles.addEventListener('click', this.rate);
        allFiles.addEventListener('click', this.offensive);

        allFiles.autoScroll = true;
        allFiles.addEventListener('scroll',(event)=>{  
            statusScroll(allFiles);
            if(event.target.scrollTop < 600)  this.getFiles();
        });

        this.panel.currentComp = 'fileSharing';
        this.panel.innerHTML="";
        this.panel.appendChild(this.fileSharing); 
    }
    
    getElement(){
        const openForumUpload = this.fileSharing.querySelector('.open-forum-upload');
        const forumUpload = this.fileSharing.querySelector('.form-upload');
        const inputFile = this.fileSharing.querySelector('.input-file');
        const selectFile = this.fileSharing.querySelector('.button-select');
        const buttonExitUpload = this.fileSharing.querySelector('.exit');
        const buttonCancel = this.fileSharing.querySelector('.button-cancel');
        const buttonUpload = this.fileSharing.querySelector('.button-upload');
        const preview = this.fileSharing.querySelector('.preview-file');
        const buttonSelect = this.fileSharing.querySelector('.button-select');
        const fileTitle = this.fileSharing.querySelector('.file-title input');
        const allFiles = this.fileSharing.querySelector('.all-file-sharing');
        
        return {
            openForumUpload, forumUpload, inputFile,
            selectFile, buttonExitUpload, buttonCancel,
            buttonUpload, preview, buttonSelect,fileTitle,
            allFiles, 
        }
    }

    uploadForm(){
        const { forumUpload, buttonUpload, inputFile, fileTitle } = this.elements;

        const uploader = new SocketIOFileUpload(this.io);
        uploader.listenOnSubmit(buttonUpload, inputFile);
        uploader.addEventListener("start", function(event){
            const typeFile = inputFile.files[0].type.split('/')[0];
            event.file.meta.fileTitle = fileTitle.value;
            event.file.meta.typeFile = typeFile;
        });
        const thisClass = this;
        return function(){
            const result = checkUserConnect();
            if(!result) return;
 
            forumUpload.style.display = 'block';
            forumUpload.style.display = 'flex';
        }
        
    }
    fileTitle(){
        const { inputFile, buttonUpload, fileTitle } = this.elements;
        return function(){
            if(inputFile.value && fileTitle.value.trim()){
                buttonUpload.classList.add('active-upload');
              }else{
                buttonUpload.classList.remove('active-upload');
              }  
            
        }
    }
    chooseFile(){
        const { inputFile } = this.elements;
        inputFile.click();
        
    }

    closeUpload(){
        const { forumUpload } = this.elements;
        return function(){
            forumUpload.style.display = 'none';
        }
    }

    previewFile(){

        const imgPreview = document.createElement('img');

        const { preview, buttonSelect, buttonCancel, buttonUpload, inputFile, fileTitle } = this.elements;

        return function(event){   

            if(event.target.value){
                const file = event.target.files[0];
                const typeFile = file.type.split('/')[0];
              
                if(typeFile == 'image'){
                 
                    const reader = new FileReader();
                    reader.onload = function(){
                        const result = reader.result;
                        imgPreview.src = result 
                        preview.appendChild(imgPreview);
                    }
                    
                    reader.readAsDataURL(file);
                }
                else if(typeFile == 'audio'){
                    imgPreview.src = "http://localhost:3000/picture/audio.png";
                    preview.appendChild(imgPreview);
                }
                else if(typeFile == 'video'){
                    imgPreview.src = "http://localhost:3000/picture/video.png";
                    preview.appendChild(imgPreview);
                }
                else{
                    imgPreview.src = "http://localhost:3000/picture/file.jpg";
                    preview.appendChild(imgPreview);
                }

            buttonSelect.style.display = 'none';
            preview.classList.add("remove-border");
            buttonCancel.classList.add('active-cancel');

            if(inputFile.value && fileTitle.value.trim()){
                buttonUpload.classList.add('active-upload');
              };
            
            }

        }
    }

    cancel(){
        const { inputFile, buttonCancel, buttonUpload, preview, buttonSelect, } = this.elements;


        return function(){
            if(!inputFile.value) return;
            inputFile.value = "";
            buttonCancel.classList.remove('active-cancel');
            buttonUpload.classList.remove('active-upload');
            preview.querySelector('img').remove();
            preview.classList.remove("remove-border");
            buttonSelect.style.display = 'block';
        }
    }

    upload(){
        const { forumUpload, inputFile, buttonCancel, buttonUpload, preview, buttonSelect, fileTitle } = this.elements;
        const thisClass = this;
        return function(){
            if(!inputFile.value || !fileTitle.value.trim()){
              return  thisClass.panel.appendChild(popupNotice.errorUpload());
            };

            thisClass.panel.appendChild(popupNotice.successUploadNotice())
            inputFile.value = "";
            buttonCancel.classList.remove('active-cancel');
            buttonUpload.classList.remove('active-upload');
            preview.querySelector('img').remove();
            preview.classList.remove("remove-border");
            buttonSelect.style.display = 'block';
            fileTitle.value = "";
            forumUpload.style.display = "none";
            
        }
    }

    newFile(){
        const allFileSharing = this.fileSharing.querySelector('.all-file-sharing');
 
        this.io.on('sendFile', file =>{
            if(this.panel.currentComp != 'fileSharing') return;
          
            this.removeStartCompText();
          
            const htmlfile = newFile(file)
           
            allFileSharing.insertAdjacentHTML('beforeend', htmlfile);
       
            messageScroll(allFileSharing);
        });
    }
    
    newRate(){
        
        this.io.on('rate', rate =>{
            if(this.panel.currentComp != 'fileSharing') return;
            const allFileSharing = Array.from(this.fileSharing.querySelectorAll('.box-file'));
            
    
            const element = allFileSharing.find(element => element.id == rate.idData);
            if(!element) return;

            const rateEl = element.querySelector('.number');
            rate.statusRate == 'like' ? rateEl.innerHTML++:rateEl.innerHTML--;

        });
    }

    async getFiles(){
        const { allFiles } = this.elements;
        if(allFiles.Loading == true) return;
        allFiles.Loading = true;

        this.removeStartCompText();
        fetch(`http://localhost:3000/fileSharing/fileList`, {
            method:'POST',
            headers: {
                'Content-Type': 'application/json',
                },
            body: JSON.stringify({lastFile:this.lastFile}),   
            })
            
            .then( res => res.json())
            .then( filesFromServer => {
              
                if(filesFromServer.result.length === 0) return

                this.lastFile = filesFromServer.result[0].id;
                let fileList ="";
                allFiles.Loading = false;
                filesFromServer.result.forEach((value)=>{
                    fileList += newFile(value);
                });
                
              allFiles.insertAdjacentHTML('afterbegin', fileList);
              messageScroll(allFiles);
    
                
            });  
        
    }
    
    rate(e){
        const rateClass = String(e.target.classList);
        if(!rateClass.includes("like","dislike")) return;

        const result = checkUserConnect();
        if(!result) return;
        
        const idFile = e.target.closest('.box-file').id;
        const room = 'FileSharing';

        const newRate = isNewReporting(room, idFile, 'rate');

        if(!newRate) return this.panel.appendChild(popupNotice.alreadyRateNotice());
        let statusRate;

        if(rateClass.includes("dislike")){
            statusRate = "dislike";
        }else{
            statusRate = "like";
        }

        updateLocalStorage(room, idFile, 'rate');
        this.io.emit('rate', {room, idData:idFile, statusRate})
        
    }

    removeStartCompText(){
        if(this.fileSharing.querySelector('.start-file-sharing')){
            const start = this.fileSharing.querySelector('.start-file-sharing');
            start.remove();
        }
    }

    offensive(e){
        const classEl = e.target.className;

        if(!classEl.includes("offensive")) return;

        const result = checkUserConnect();
        if(!result) return;

        const offensiveId = e.target.closest('.box-file').id;
        const room = 'FileSharing';

        const newReporting = isNewReporting(room, offensiveId, 'offensive');

        if(!newReporting) return this.panel.appendChild(popupNotice.alreadyOffensive());

        updateLocalStorage(room, offensiveId, 'offensive');
        this.io.emit('offensive', {room, offensiveId});

        this.panel.appendChild(popupNotice.succefullyReported())
    }

    deleteOffensive(){

        this.io.on('offensive',(file)=>{
           
            if(file.room!='FileSharing') return;
            const allFiles =  Array.from(this.fileSharing.querySelectorAll('.box-file'));
            const element = allFiles.find(element => element.id == file.offensiveId);
            if(!element) return;
            element.remove();
        });
    }

}
 */