async function initHtml(){

    const body = document.querySelector('body'); 
    const head = document.querySelector('head');

    //Adds a socket
    await initSocket(body);
   
    //init rate and offensive cookies
    await initCookies(body);

    //adds all information to head tag
    await initHeadApp(head);

    //adds main file and panel to dom
    await addAppDom(body)
     
    //init local storage: rate and offensive
    initLocalStorage();
  
}
export default initHtml();




//function of init html

function initHeadApp(head){
    
    //adds viewport
    return new Promise((resolve, reject) => {
        
        const viewPortTag = document.createElement('meta');
        viewPortTag.id = "viewport";
        viewPortTag.name = "viewport";
        viewPortTag.content = "width=device-width, initial-scale=1";
        document.querySelector('head').appendChild(viewPortTag);

        //adds fontawesome
        const fontawesome = document.createElement("script"); 
        fontawesome.src = "https://kit.fontawesome.com/fe7c245d79.js";
        fontawesome.crossorigin ='anonymous';
        head.appendChild(fontawesome); 

        //adds enrollment css file
        const enrollment  = document.createElement('link');
        enrollment.rel  = 'stylesheet';
        enrollment.type = 'text/css';
        enrollment.href = 'https://web-dober.herokuapp.com/stylesheets/main.css';
        head.appendChild(enrollment);

        //adds fonts
        const font = document.createElement('link');
        font.href = 'https://fonts.googleapis.com/css2?family=Assistant:wght@300&display=swap';
        font.rel  = 'stylesheet';
        head.appendChild(font);
    
        resolve();
    });
    
}

function initCookies(body){   
    const cookies = document.createElement("script"); 
    cookies.src = "https://cdn.jsdelivr.net/npm/js-cookie@rc/dist/js.cookie.min.js"; 
    body.appendChild(cookies);


    return new Promise((resolve, reject) => {
    cookies.onload = (() => {
            
            resolve();
        })
      });
   
}

function initSocket(body){
    return new Promise((resolve, reject) => {
        const siofu = document.createElement("script"); 
        siofu.src = "https://web-dober.herokuapp.com/siofu/client.js"; 
        body.appendChild(siofu); 

            
        const io = document.createElement("script"); 
        io.src = "https://web-dober.herokuapp.com/socket.io/socket.io.js"; 
        body.appendChild(io); 

        resolve();
    });
}

function addAppDom(body){ 
    return new Promise((resolve, reject) => {
      
        const main = document.createElement("script"); 
        main.src = "https://web-dober.herokuapp.com/javascripts/main.js"; 
        main.type = 'module';
        body.appendChild(main);

        

        /*const fullScreenPlugin = document.createElement('div');
        fullScreenPlugin.id = "full-screen-plugin";
        fullScreenPlugin.classList.add("hide");
        body.appendChild(fullScreenPlugin);*/
        

    resolve();

    });

}

function initLocalStorage(){
    const rate = localStorage.getItem("rate");
    if(!rate){
        localStorage.setItem("rate", JSON.stringify([]));
    }
    const offensive = localStorage.getItem("offensive");
    if(!offensive){
        localStorage.setItem("offensive", JSON.stringify([]));
    }
}