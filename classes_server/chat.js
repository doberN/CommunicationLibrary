
const { Op } = require("sequelize");
const db = require('../sequelize/models');
const { sequelize } = require('../sequelize/models/index.js');

class Chat{
    async sendMessage(messageDetails){ 

        if(messageDetails == "") return false; 
        const result = await db.Chat.create(messageDetails);     
        return result;
    }

    async getMessage(domain,lastMessage){
        
        const condition =  { domain }
        if(lastMessage) condition.id = { [Op.lt]: lastMessage } 
        const messagesList = await db.Chat.findAll({
            attributes:['id', 'message', 'date', 'reply_idMessage'],
            where:  condition ,
            include:[
                {     
                   as:'reply', model: db.Chat, required: false, attributes: ['message'],
                    include:{as:'name', model: db.User, required: false, attributes: ['name']}
                },
                {as:'name', model: db.User, required: false, attributes: ['name', 'id','image']}
            ],   
            limit: 10,
            order: [
                ['id', 'DESC']
            ],
        })  
        Array.prototype.reverse.call(messagesList);
        
        const messageObj = messagesList.map((item) => {
            const date = item.date.toLocaleTimeString([], { hour: '2-digit', minute: "2-digit", hour12: false });
            const message = 
                { 
                    id:item.id,
                    name:item.name.name,
                    userId:item.name.id,
                    message:item.message,
                    replyIdMessage:item.reply_idMessage,
                    date,
                    image:item.name.image
                }
                if(item.reply){
                    message.reply = {}
                    message.reply.name = item.reply.name.name;
                    message.reply.message = item.reply.message;
                }
            return message ;
        })

        return messageObj;
        
    }

}



module.exports = Chat; 
