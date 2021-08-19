import { getProfile } from '../../funGeneralClasses/functionsGeneral.js';
export function setting(){
    return function(e){
       const typeClass = e.target.className;

       if(!typeClass.includes('icon-setting')) return;
       const button = e.target.nextElementSibling;
 
        button.classList.toggle('hide')
    }
}

export function profile(){
    return function(e){
        
       const typeClass = e.target.className;
       const exceptionArr = ['icon-setting', 'button','scroll'];
       const find = exceptionArr.find(exception => typeClass.includes(exception))

       if(find) return;
       const userId = e.target.closest('.user').id;

       getProfile(userId);
      
    }
}