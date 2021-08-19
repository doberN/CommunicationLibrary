const db = require('../sequelize/models');


const Notification = require('./notification');
const notification = new Notification();

class Followers{
    async create(followingId, followedId){
        if(followingId == followedId) return false;

        const existFriend = await db.User.findOne({where:{id:followedId}});
        if(!existFriend) return false;

        const [user, create] = await db.Followers.findOrCreate({
            where: {following: followingId,followed:followedId},
            defaults: {following: followingId, followed:followedId}})
 
         if(!create) return 'already'
         return 'success'
    }

    async remove(followingId, followedId){
        if(followingId == followedId) return false;

        const existFriend = await db.User.findOne({where:{id:followedId}});
        if(!existFriend) return false;

        const remove =  await db.Followers.destroy({where: {following: followingId, followed:followedId}});
        if(!remove) return 'fails';
        return 'success';
        
    }

    async followedList(usreId){
        const ListFollowed = await db.Followers.findAll({
            attributes:[],
            where:{ following:usreId }, 
            include:{as:'my_followed', model: db.User, required: false, attributes: ['name','id','image']}
        });
        return ListFollowed;  
    }

    async followersList(usreId){
        const ListFollowed = await db.Followers.findAll({
            attributes:[],
            where:{ followed:usreId }, 
            include:{as:'my_following', model: db.User, required: false, attributes: ['name','id','image']}
        });
        return ListFollowed;  
    }

    async sendToFollowers(userId, domain, message, io){
        const alreadySent =  await db.Forum.findAll( {
       
            where:{userId, domain},
            include:[
                {as:'name', model: db.User, required: true, attributes: ['name', 'id','image']},
            ],});
        if(alreadySent.length > 1) return;

        const nameFollowed = alreadySent[0].name.name;

        const usersIdAndEmails = await db.Followers.findAll({ 
            attributes:['following'],
            where:{followed:userId},
            include:{as:'my_following', model: db.User, required: false, attributes: ['email','name']} });
    
        usersIdAndEmails.forEach(function(id){
            io.to(id.following).emit('alertFollowers', `your follower ${nameFollowed} write in some website check your email`)
        });

        usersIdAndEmails.forEach(function(id){
        
            const nameFollowing = id.my_following.name;
            const link = `<a href="${domain}">הזה</a>`;
            const messageId = alreadySent[0].id;

            const email = id.my_following.email;
            const subject = `התראת עוקב`;
            const html = `<h3>שלום ${nameFollowing} הנעקב שלך ${nameFollowed} כתב באתר ${link}</h3><br> <h1>כותרת הפוסט: ${message.title} </h1><br><h2>תוכן הפוסט: ${message.message} </h2> `;

            notification.sendEmail(email, subject, html);
        });
    }
     
}

module.exports = Followers;