

export function messageScroll(scrollDiv){

    if(!scrollDiv.autoScroll) return;
    
    scrollDiv.scrollTop = scrollDiv.scrollHeight;
  
}

export function statusScroll(scrollDiv){
    Math.ceil(scrollDiv.scrollTop + scrollDiv.offsetHeight) >= scrollDiv.scrollHeight-20? scrollDiv.autoScroll = true:scrollDiv.autoScroll = false;
}

export function isNewReporting(room, idData, typeReporting){

    const rate = JSON.parse(localStorage.getItem(typeReporting));
    if(rate.length == 0) return true

    for(let item of rate){
        if(item.room == room && item.idData == idData) return false;       
    }
    return true;

}

export function updateLocalStorage(room, idData, typeStorage){

    const rate = JSON.parse(localStorage.getItem(typeStorage));
    rate.push({room, idData})

   localStorage.setItem(typeStorage, JSON.stringify(rate));

}


