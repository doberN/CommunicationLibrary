export function usersComp(roomName){
  let iconRoom;

  switch(roomName){
    case 'נעקבים':
      iconRoom = 'far fa-shoe-prints';
      break;

      case 'עוקבים':
      iconRoom = 'far fa-shoe-prints';
      break;

      case 'חברים':
      iconRoom = 'fas fa-user-friends';
      break;
  }
    const userdDiv = document.createElement('div');
    userdDiv.classList.add("users-box"); 

    const user = `     
    <div class="users-header">

    <div class="left">
      <i class='${iconRoom}'><span class = "room-name"> ${roomName}</span></i>
    </div>
    <div class="right">
    <i class='fas fa-list-ul menu-general'></i>
    <i class="fas fa-times close-panel"></i>
    </div>
    </div>

    <div class="all-users scroll">
    
    </div>`;

    userdDiv.insertAdjacentHTML('afterbegin', user);

    return userdDiv;
}

export function newUser(userObj, roomName){

  let user ;
  switch(roomName){

    case 'נעקבים':
      user = userObj.my_followed;
      break;

    case 'עוקבים':
      user = userObj.my_following;
      break;

    case 'חברים':
      user = userObj.friendTwo;
      break;
  }
 

  let setting;

  if(roomName == 'נעקבים'){
      setting = `
        <div class="setting">
          <i class="fas fa-cog icon-setting"> </i>
          <button class = "button hide">הפסק לעקוב</button>       
        </div>
      `; 
  }

  if(roomName == 'חברים'){
    setting = `
      <div class="setting">
        <i class="fas fa-cog icon-setting"> </i>
        <button class = "button hide">הסר חבר</button>       
      </div>
    `; 
}

  const userDiv =`
   <div class="user" id="${user.id}">
    <div class="img">
      <img src="${user.image}" alt="">
    </div>
    <div class="content">
      <div class="name">${user.name}</div>
    
    </div>
    ${setting || ""}
  </div>
`;

  return userDiv;
}