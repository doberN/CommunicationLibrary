const db = require('../sequelize/models');


class Friends{
    async create(friendOne, friendTwo){
    if(friendOne == friendTwo) return false;
       const existFriend = await db.User.findOne({where:{id:friendTwo}});
       if(!existFriend) return false;

       const [user, create] = await db.Friends.findOrCreate({
           where: {friend_one: friendOne,friend_two:friendTwo},
           defaults: {friend_one:friendOne, friend_two:friendTwo}});

        if(!create) return 'already';
        return 'success';
    }   

    async remove(friendOne, friendTwo){
        if(friendOne == friendTwo) return false;
        const existFriend = await db.User.findOne({where:{id:friendTwo}});
        if(!existFriend) return false;

        const remove =  await db.Friends.destroy({where: {friend_one:friendOne, friend_two:friendTwo}});
        if(!remove) return 'fails';
        return 'success';
     }

     async FriendList(usreId){
        const ListFriend = await db.Friends.findAll({
            attributes:[],
            where:{ friend_one:usreId }, 
            include:{as:'friendTwo', model: db.User, required: false, attributes: ['name','id','image']}
        });
        return ListFriend;
     }//await db.Friend.findAll({  include: [{ as:'friendOne',model: db.User, required: false, attributes: ['name']},{as:'friendTwo', model: db.User, required: false, attributes: ['name']}] 

}

module.exports = Friends;