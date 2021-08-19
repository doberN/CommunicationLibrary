const db = require('../sequelize/models');
const { Op } = require("sequelize");

class Forum {
    async sendThread(thread){
 
       if(thread.message == "" || thread.title =="") return false;
       const result = await db.Forum.create( thread );
       return result;
    }

    async sendComment(comment){
 
        if(comment.message == "") return false;
 
        const result = await db.Forum.create( comment );
        return result;
     }

    async getThreads(domain, lastThread){
        const condition =  { domain,parent:{[Op.eq]:null} }
        if(lastThread) condition.id = { [Op.lt]: lastThread }

        const threadslist = await db.Forum.findAll( {
            attributes: [ 'id', 'title','date','rating','message'],
            where:condition,
            include:[
                {as:'name', model: db.User, required: true, attributes: ['name', 'id','image']},
                {as:'response',model: db.Forum},
            ],
            
            limit: 10,
            order: [
                ['id', 'DESC']
            ], });

           const threadObj = threadslist.map((item) => {
    
                //const date = item.date.toLocaleTimeString([], { hour: '2-digit', minute: "2-digit", hour12: false });
                const response = Object.keys(item.response).length
                const thread = 
                    { 
                        response,
                        id:item.id,
                        title:item.title,
                        message:item.message,
                        rating:item.rating,
                        date:item.date,
                        name:item.name.name,
                        userId:item.name.id,
                        image:item.name.image,
                    }
                return thread ;
            })

        return threadObj;
    }

    async getComments(lastComment, parent){
        const condition =  { parent} 
        if(lastComment) condition.id = { [Op.lt]: lastComment }

        const commendslist = await db.Forum.findAll( {
            attributes: [ 'id', 'title','message','rating','date','reply_idForum'],
            where:condition,
            include:[
                {
                    as:'reply', model: db.Forum, required: false,attributes: ['id','message'],
                    include:{as:'name', model: db.User, required: false, attributes: ['name']}
                },
                {as:'name', model: db.User, required: true, attributes: ['name', 'id','image']},
            ],
            limit: 10,
            order: [
                ['id', 'DESC']
            ], });

        const commentObj = commendslist.map((item) => {
            
            const comment = 
                { 
                    id:item.id,
                    name:item.name.name,
                    userId:item.name.id,
                    message:item.message,
                    reply_idForum:item.reply_idForum,
                    rating:item.rating,
                    date:item.date,
                    image:item.name.image,
                }
                if(item.reply){
                    comment.reply = {}
                    comment.reply.name = item.reply.name.name;
                    comment.reply.message = item.reply.message;
                    comment.reply.name = item.reply.name.name;
                }
            return comment ;
        });
        return commentObj;
    }
}

module.exports = Forum;