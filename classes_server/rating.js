const db = require('../sequelize/models');

class Rating {
    async rate(data){

        const table = data.room;
        const rate = data.statusRate =='like'?+1:-1;
        const result = await db[table].increment({rating:rate},{where:{id:Number(data.idData)}});
        return result;
     
    }
}

module.exports = Rating;