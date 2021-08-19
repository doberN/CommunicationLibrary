
const FileSharing = require('./fileSharing.js');
const fileSharing = new FileSharing();

const db = require('../sequelize/models');

class Offensive{
  async reporting(data){
    const table = data.room; 
    await db[table].increment({offensive:+1},{where:{id:Number(data.offensiveId)}});
    
    if(table == 'FileSharing'){
        const file = await db.FileSharing.findAll({where:{offensive:4}})
         fileSharing.deleteFile(file);
    }
    const remove =  await db[table].destroy({where: {offensive:4}});
    if(remove>0) return data;
    return false;
  }
}

module.exports = Offensive;