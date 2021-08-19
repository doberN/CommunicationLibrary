export default class Rating{
    rate(idData, room, socket, statusLike){
      
        const check = this.checkNewRate(room, idData);
        if(!check)return 'you already rate';

        const rate = JSON.parse(localStorage.getItem("rate"));
        rate.push({room, idData})

        socket.emit('rate', {room, idData, statusLike})
        localStorage.setItem("rate", JSON.stringify(rate));
        return 'you rate';
        
    }

    checkNewRate(room, idData){

        const rate = JSON.parse(localStorage.getItem("rate"));
        if(rate.length == 0) return true

        for(let item of rate){
            if(item.room == room && item.idData == idData) return false;       
        }
        return true;
        
    }
}