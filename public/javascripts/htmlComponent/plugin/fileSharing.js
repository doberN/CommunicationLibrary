export function fileSharingComp(){
    const fileSharingDiv = document.createElement('div');
    fileSharingDiv.classList.add("box-file-sharing"); 
    const fileSharing = `

        <div class="box-file-sharing-header">
            
            <div class="left">
                <i class='far fa-folder-open'> שיתוף קבצים</i>
            </div>
            <div class="right">
                <i class='fas fa-list-ul menu-general'></i>
                <i class="fas fa-times closeWindow close-panel"></i>
            </div>

            </div>

            <div class="all-file-sharing scroll">

                <div class="start-file-sharing">Be the first to comment....</div>
    
            </div>


        <div class="open-forum-upload">
            <i class="fas fa-upload"></i>
        </div>
        <div class="form-upload">
        <div class="exit">
          <i class="fas fa-times"></i>
        </div>
      
        <div class="form-title">
        העלאת קובץ
        </div>
        <div class="upluad-logo">
          <i class="fas fa-cloud-upload-alt upload"></i>
        </div>
        
      
        <div class="file-title">
          <input type="text" placeholder=" כותרת קובץ.....">
        </div>
        <input type="file" hidden class ="input-file">
        <div class="preview-file">
           <button class="button-select">בחר קובץ</button>
        </div>
      
        <div class="buttons-bottom">
          <button class="button-upload">שלח</button>
          <button class="button-cancel">ביטול</button>
        </div>
      
      </div>`;
     
       
        fileSharingDiv.insertAdjacentHTML('afterbegin', fileSharing);

        return fileSharingDiv;
}

export function newFile(file){
 
  //
  let myId;
  if(Cookies.get("myIdForPlugin")){
      myId =  Cookies.get("myIdForPlugin");
  }
  const  { id, userId, fileTitle,  filePath, fileName, user, rate, date, image } = file;
  const newFile = `
  <div class="box-file ${myId == userId?'my':""}" id="${id}">
    <div class="img">
      <img src="${image}"  >
    </div>

    <div class="content-file">

      <div class="name" id="${userId}">
        ${myId == userId?'אני':user}
      </div>

      <div class="title">
        ${fileTitle} 
      </div>

      <div class="file">
        <span class="file-name">${fileName}</span>
        <a href="${filePath}" download>
          <i class="fas fa-arrow-circle-down"></i>
        </a>
      </div>

      <div class="data-bottom-file">
      
        <span class="date">${date}</span>
        <span class="offensive">דווח</span>
        <i class="far fa-thumbs-up like"></i>
        
        <span class="number">${rate}</span>
      
        <i class="far fa-thumbs-down dislike"></i>
        
      </div>

    </div>

  </div>
  `;
  
  return newFile;
}
