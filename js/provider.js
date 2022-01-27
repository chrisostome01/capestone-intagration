const showMsg = (id ,errorMsg ,status ) =>{
    let place = document.getElementById(`${id}`);
    let msgField = place.querySelector(`#msg`);
    place != null ? place.classList.toggle(`${status}`) : '' ;
    msgField != null ? msgField.innerHTML = errorMsg : '' ;
    setTimeout(() => {
        msgField != null ?  msgField.innerHTML = '': '' ;
        place.classList.toggle(`${status}`) ;
    } ,2000);
}
const showNotification = (title = '',msg = '',errorType = '' , lastIn = null) =>{
  
    let place = document.getElementById(`notification`);
    let msgTitleField = place.querySelector(`#error-title`);
    let notInfo = place.querySelector(`#not-info`);
    msgTitleField.innerHTML =  title;
    notInfo.innerHTML = msg  ;
    place.classList.add(`${errorType}-msg`);
    if(lastIn == null){        
        setTimeout(() => {
            msgTitleField != null ?  msgTitleField.innerHTML = '': '' ;
            notInfo != null ?  notInfo.innerHTML = '': '' ;
            place.classList.remove(`${errorType}-msg`);
        } ,4000);
    }
    else{

        return () => {
            msgTitleField != null ?  msgTitleField.innerHTML = '': '' ;
            notInfo != null ?  notInfo.innerHTML = '': '' ;
            place.classList.remove(`${errorType}-msg`);
        }
    }
}
function ellpsIt(info , upto) {
    if (info.length > upto) {
       return info.substring(0, upto) + '...';
    }
    return info;
 };
const hideElement = (id) =>{
    let place = document.getElementById(`${id}`);
    place.classList.add('hidden');
}
const showElement = (id) =>{
    let place = document.getElementById(`${id}`);
    place.classList.remove('hidden'); 
}
const showFullForm = () => {
    showElement('full-name-input');
    showElement('username-input');
    showElement('password-input');    
}
const hideFullForm = () => {
    hideElement('full-name-input');
    hideElement('username-input');
    hideElement('password-input');    
}
const hidePassword = () => {
    hideElement('password-input');    
}
const showPassword = () => {
    showElement('password-input'); 
}
const pushInError  = (errorState , value) => {
    let errorsStateClone = [...errorState];
    let index = errorsStateClone.indexOf(value);
    if(index === -1 ){
        errorsStateClone.push(value);
    }
    return errorsStateClone ;
}
const validateFullName = () => {
    let fullName = document.getElementById(`Fullname`).value.trim();    
    let errorStatus = {
        msg:'',
        pass: false,
        errors:[]
    }
    document.getElementById(`Fullname`).addEventListener('keyup',() => {
        let fullName = document.getElementById(`Fullname`).value.trim();     
        if(fullName == ''){
            showMsg('full-name-input' ,'Please fill this field','error');
        }
        else if(/\d/.test(fullName)){
            showMsg('full-name-input' ,'Full name should not contain numbers','error');
        }
        else if(fullName.split(' ').length < 2){
            showMsg('full-name-input' ,'Please you have to provide two or more of your name','error');
        }
        else{
            showMsg('full-name-input' ,'Success','success');
        }
    });
    if(fullName == ''){
        showMsg('full-name-input' ,'Please fill this field','error');
        errorStatus.errors = pushInError(errorStatus.errors,'Please fill this field');
    }
    else if(/\d/.test(fullName)){
        showMsg('full-name-input' ,'Full name should not contain numbers','error');
        errorStatus.errors = pushInError(errorStatus.errors,'Full name should not contain numbers');
    }
    else if(fullName.split(' ').length < 2){
        showMsg('full-name-input' ,'Please you have to provide two of your name','error');
        errorStatus.errors = pushInError(errorStatus.errors,'Please you have to provide two of your name');
    }
    else{
        showMsg('full-name-input' ,'Success','success');
        errorStatus.errors = [];
        errorStatus.pass = true;
    }
    return errorStatus;
}
const validateEmail = () => {
    let email = document.getElementById(`Email`).value.trim();
    
    var isValid = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
    let errorStatus = {
        msg:'',
        pass: false,
        errors:[]
    }
    document.getElementById(`Email`).addEventListener('keyup',() => {
        let email = document.getElementById(`Email`).value.trim();
        
        isValid = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
      
        if(email == ''){
            showMsg('email-input' ,'Please fill this field','error');
        }
        else if(!(email.includes('@'))){
            showMsg('email-input' ,'Please email shoud have @','error');
        }  
        else if(!isValid){
            showMsg('email-input' ,'Please email is not valid','error');
        }
        else{
            showMsg('email-input' ,'Success','success');
        }
    });
   
    if(email == ''){
        showMsg('email-input' ,'Please fill this field','error');
        errorStatus.errors = pushInError(errorStatus.errors,'Please fill this field');
    }
    else if(!(email.includes('@'))){
        showMsg('email-input' ,'Please email shoud have @','error');
        errorStatus.errors = pushInError(errorStatus.errors,'Please email shoud have @');
    } 
    else if(!isValid){
        showMsg('email-input' ,'Please email is not valid','error');
        errorStatus.errors = pushInError(errorStatus.errors,'Please email is not valid');
    }
    else{
        showMsg('email-input' ,'Success','success');
        errorStatus.errors = [];
        errorStatus.pass = true;
    }
    return errorStatus;
}
const validatUsername = () => {
    let username = document.getElementById(`username`).value.trim();
    let indexOfAt = username.indexOf('@');
    var errorStatus = {
        msg:'',
        pass: false,
        errors:[]
    }
    document.getElementById(`username`).addEventListener('keyup',() => {
        let username = document.getElementById(`username`).value.trim();
        if(username == ''){
            showMsg('username-input' ,'Please fill this field','error');
        }   
        else if((username.trim().includes(' '))){
            showMsg('username-input' ,'Please username should not contain spaces','error');
        } 
        else if((username.trim().length < 5)){
            showMsg('username-input' ,'Please username should be atleast 5 charactors','error');
        }      
        else{
            showMsg('username-input' ,'Success','success');
        }
    });
    if(username == ''){
        showMsg('username-input' ,'Please fill this field','error');
        errorStatus.errors = pushInError(errorStatus.errors,'Please fill this field');
    }    
    else if((username.trim().includes(' '))){
        showMsg('username-input' ,'Please username should not contain spaces','error');
        errorStatus.errors = pushInError(errorStatus.errors,'Please username should not contain spaces');
    } 
    else if((username.trim().length < 5)){
        showMsg('username-input' ,'Please username should be atleast 5 charactors','error');
        errorStatus.errors = pushInError(errorStatus.errors,'Please username should be atleast 5 charactors');
    } 
    else{
        showMsg('username-input' ,'Success','success');
        errorStatus.errors = [];
        errorStatus.pass = true;
    }
    return errorStatus;
}
const validatPassword = () => {
    let password = document.getElementById(`password`).value.trim();
    let errorStatus = {
        msg:'',
        pass: false,
        errors:[]
    }
    document.getElementById(`password`).addEventListener('keyup',() => {
        let password = document.getElementById(`password`).value.trim();
       
        if(password == ''){
            showMsg('password-input' ,'Please fill this field','error');
        }   
        else if((password.trim().length < 8)){
            showMsg('password-input' ,'Please password should be atleast 8 charactors','error');
        }      
        else{
            showMsg('password-input' ,'Success','success');
        }
    });
  
    if(password == ''){
        showMsg('password-input' ,'Please fill this field','error');
        errorStatus.errors = pushInError(errorStatus.errors,'Please fill this field');
    }   
    else if((password.trim().length < 8)){
        showMsg('password-input' ,'Please password should be atleast 8 charactors','error');
        errorStatus.errors = pushInError(errorStatus.errors,'Please password should be atleast 8 charactors');
    } 
    else{
        showMsg('password-input' ,'Success','success');
        errorStatus.errors = [];
        errorStatus.pass = true;
    }
    return errorStatus;
}
/* =============  validating contact email ====================== */ 
const validateContactEmail = (elementId) => {
    let email = document.getElementById(`${elementId}`).value.trim();
    
    var isValid = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
    let errorStatus = {
        msg:'',
        pass: false,
        errors:[],
        value:''
    }   
    if(email == ''){
        showNotification('Email' ,'Please fill this field','error');
        errorStatus.errors = pushInError(errorStatus.errors,'Please fill this field');
    }
    else if(!(email.includes('@'))){
        showNotification('Email' ,'Please email shoud have @','error');
        errorStatus.errors = pushInError(errorStatus.errors,'Please email shoud have @');
    } 
    else if(!isValid){
        showNotification('Email' ,'Please email is not valid','error');
        errorStatus.errors = pushInError(errorStatus.errors,'Please email is not valid');
    }
    else{
        // showNotification('Email' ,'Success','success');
        errorStatus.errors = [];
        errorStatus.pass = true;
        errorStatus.value = email;
    }
    return errorStatus;
}
/* ============= end validating email ============================ */ 
/* =============== validating subject and comment ====================== */
const isEmpty = (elementId , comment) => {
    let field = document.getElementById(`${elementId}`).value.trim();    
    let errorStatus = {
        msg:'',
        pass: false,
        errors:[],
        value:''
    }   
    if(field == ''){
        showNotification(`${comment}`,'Please fill this field','error');
        errorStatus.errors = pushInError(errorStatus.errors,'Please fill this field');
    }   
    else{
        // showNotification(`${comment}` ,'Success','success');
        errorStatus.errors = [];
        errorStatus.pass = true;
        errorStatus.value = field;
    }
    return errorStatus;
} 
/* =============== end:: validating subject and comment====================== */

/* =============== validating subject and comment =========================== */
const fillin = (elementId , comment) => {
    let place = document.getElementById(`${elementId}`);
    place != null ? place.innerHTML = comment : ''; 
} 
/* =============== end:: validating subject and comment====================== */

/* =============== Start:: Element customisation ================================= */ 
const elementLeader = () => {
    const comment = document.getElementById('comment-form') ;
    if(userInfo == null){
        const postCard = document.getElementById('postCard') ;
        postCard != null ? postCard.remove() : '' ;
        
        comment != null ? comment.remove() : '' ;
    }
    else{
        if(userInfo.userType != 'admin'){
            const showBlogFormButton = document.getElementById('showBlogCreatModel') ;
            showBlogFormButton != null ? showBlogFormButton.remove() : '' ;
        }
        comment != null ? comment.classList.toggle('hidden-comment'): '' ;
        
    }
    
    // Getting profile
    if(userInfo != null){
        if(userInfo.profile != null){
            setImage('profile',userInfo.profile);
            setImage('profile-p',userInfo.profile);
        }
        addThisElement('profile-image');
        fillin('username',userInfo.Fullname);
        removeThisElement('loginBtn');
        removeThisElement('signUpBtn');
    }
    else{
        removeThisElement('profile-image');
    }
}
/* =============== End:: Element customisation ================================= */ 
/* =============== Is it object functin =========================== */
function isObject(val) {
    return (typeof val === 'object');
}
/* =============== end:: Is it object functin====================== */
/* =============== Is it object functin =========================== */
function isUndifined(val) {
    return (typeof val === 'undifined');
}
/* =============== end:: Is it object functin====================== */