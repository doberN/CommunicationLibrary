const fs = require('fs')
const db = require('../sequelize/models');
const { Op } = require("sequelize");
const { Gone } = require('http-errors');

class FileSharing{
    constructor(){
        this.listLegalImage = ['apng', 'avif', 'avif', 'jpg', 'jpeg', 'jfif', 'pjpeg', 'pjp', 'png', 'svg', 'webp'];
        this.listLegalAudio = ['3gp', 'adts', 'flac', 'mpeg', 'mp4', 'ogg', 'mov', 'webm','wav'];
        this.listLegalFile = ['pdf','txt','pptx','giv'];
    }

    legalExtension(extensionName){
        

        this.uploadLegal = this.listLegalFile.concat(this.listLegalAudio,this.listLegalImage)
        console.log(this.uploadFile)
        const extension = /^.+\.([^.]+)$/.exec(extensionName);
        const checkTypeFile =  extension == null ? "" : extension[1];

        const valid = this.uploadLegal.includes(checkTypeFile);
        if(!valid) return false;

        return extension[1];
    }

    folderNameForSave(typeFolder){
        let nameFolder;
          switch (typeFolder) 

          {
          case 'image':
            nameFolder = 'picture';
            break;

          case 'audio':
            nameFolder = 'music';
            break; 

          case "video":
            nameFolder = 'video';
            break;

            default:  
            nameFolder = 'file';
            break;   
          }
       
          return nameFolder;
      }

      async uploadFile(upload){
       const result = await db.FileSharing.create(upload);
       return result;
      } 

    async getFiles(domain, lastFile){

        const condition =  { domain }
        if(lastFile) condition.id = { [Op.lt]: lastFile } 

        const filesList = await db.FileSharing.findAll({
            attributes: ['id','userId', 'fileTitle',  'filePath', 'fileName',  'rating', 'date'],
            where: condition ,
            include: { model: db.User, required: true, attributes: ['name', 'image']},
            limit: 10,
            order: [
                ['id', 'DESC']
            ], });
            Array.prototype.reverse.call(filesList);
            const filesObj = filesList.map((item) => {
    
                const date = item.date.toLocaleTimeString([], { hour: '2-digit', minute: "2-digit", hour12: false });
                const file = 
                    { 
                        id:item.id,
                        user:item.User.name,
                        image:item.User.image,
                        userId:item.userId,
                        fileTitle:item.fileTitle,
                        filePath:item.filePath,
                        fileName:item.fileName,
                        rate:item.rating,
                        date
                    }

                return file ;
            });
        return filesObj;
    }
    
    async deleteFile(file){
       
        if(file.length > 0) {
            for(let item of file){
                const arrPath = item.filePath.split('/');
                const arrLength = arrPath.length;
                fs.unlink(`filesAndImages/${arrPath[arrLength-2]}/${arrPath[arrLength-1]}`, (err) => {
                    if (err) {
                      console.error(err)
                      return
                    }
                  })
               
            }
        }
    }
}

module.exports = FileSharing;