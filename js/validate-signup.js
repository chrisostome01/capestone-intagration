let createAccount = document.getElementById('sign-up-form');
var isSignupInputValid = {
    emailIsValid : false,
    fullNameIsValid : false,
    userNameIsValid : false,
    passwordIsValid : false
} 
createAccount.addEventListener('submit',sub =>{
    sub.preventDefault();
    const userNameIsValid = validatUsername();
    const passwordIsValid = validatPassword();
    const fullNameIsValid = validateFullName();
    const emailIsValid = validateEmail();   
    isSignupInputValid = {
        userNameIsValid : userNameIsValid.pass ,
        passwordIsValid : passwordIsValid.pass ,
        fullNameIsValid : fullNameIsValid.pass ,
        emailIsValid : emailIsValid.pass
    };
})