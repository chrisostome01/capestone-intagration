let login = document.getElementById('login-form');
var isLoginInputValid = {
    emailIsValid : false,
    passwordIsValid : false
} 
login.addEventListener('submit',sub =>{
    sub.preventDefault();
    const emailIsValid = validateEmail();   
    const passwordIsValid = validatPassword();
    isLoginInputValid = {
        emailIsValid : emailIsValid.pass ,
        passwordIsValid : passwordIsValid.pass
    } 
})