export default class Offensive{
    reporting(offensiveId, room, socket){
        const check = this.checkNewReporting(room, offensiveId);
        if(!check)return 'you already reporting';

        const reporting = JSON.parse(localStorage.getItem("offensive"));
        reporting.push({room, offensiveId})

        socket.emit('offensive', {room, offensiveId});
        
        localStorage.setItem("offensive", JSON.stringify(reporting));
        return 'you reporting';
       
    }

    checkNewReporting(room, offensiveId){

        const reporting = JSON.parse(localStorage.getItem("offensive"));
        if(reporting.length==0) return true

        for(let item of reporting){
            if(item.room==room && item.offensiveId==offensiveId){
                return false
            }
        }
        return true;
        
    }
}