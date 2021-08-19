export class Socket{
    constructor(){
        this.socket = io('https://web-dober.herokuapp.com');
        this.connectionLoginSocket = false;
        this.login();
        this.saveMyId();
    }

    login(){
       
        if(this.connectionLoginSocket) return;
     
            if(Cookies.get("jwt")){
                const jwt =  Cookies.get("jwt");
                this.socket.emit('login', jwt);
                this.connectionLoginSocket = true;        
            }         
    }

    saveMyId(){
       
        this.socket.on('userId',(id)=>{
            
        if(Cookies.get("myIdForPlugin")) return;
           Cookies.set("myIdForPlugin",id, { expires:7 });
        });
        
    }

}

