createAccount.addEventListener('submit',(e) =>{
    showFullForm();
    e.preventDefault();
    var latitudei = 0000;
    var longitudei = 0000;
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(posistion => {
            latitudei = posistion.coords.latitude;
            longitudei = posistion.coords.longitude;
        });
        
        if(isSignupInputValid.emailIsValid && isSignupInputValid.passwordIsValid && isSignupInputValid.userNameIsValid && isSignupInputValid.fullNameIsValid){
            const removeNotification = showNotification(`!`,'Proccesing information','success','noEnd');
            let email = document.getElementById('Email').value;
            let password = document.getElementById('password').value;
            let fullname = document.getElementById('Fullname').value;
            let username = document.getElementById('username').value;
            auth.createUserWithEmailAndPassword(email ,password)
            .then((userCredential) => {
                const user = userCredential.user;  
                const isNewEmail = userCredential.additionalUserInfo.isNewUser; 
                const id = userTable.push().key;
                console.log(user);
                removeNotification();
                if(isNewEmail){
                    userTable.child(user.uid).set({
                        'id' :  user.uid ,
                        'Fullname' : fullname,
                        'Email' : email,
                        'Username' : username,
                        'emailIsVerified' : false,
                        'profile' : user.photoURL,
                        'parentId' : id,
                        'userType' : 'normal',
                        'longitude':longitudei,
                        'latitude':latitudei
                    });
                    var userInfo = { };
                    userTable.once("value", snap => {
                        let userRecord = snap.val();
                        /* keeping user info in localstorage */ 
                        for(var i in userRecord){
                            console.log(userRecord[i]);
                            if(userRecord[i].Email == email ){
                                localStorage.setItem("userInfo",JSON.stringify(userRecord[i]));
                                location.href  = './browse.html';
                            }
                        }
                    })
                    
                    createAccount.reset();
                }
                else{
                    showNotification(`!`,'You email is already sign up','success');
                }
            }) 
            .catch((error) => {
                console.log(error);
            });
        }   
    }    
    else{
        
        if(isSignupInputValid.emailIsValid && isSignupInputValid.passwordIsValid && isSignupInputValid.userNameIsValid && isSignupInputValid.fullNameIsValid){
            let email = document.getElementById('Email').value;
            let password = document.getElementById('password').value;
            let fullname = document.getElementById('Fullname').value;
            let username = document.getElementById('username').value;
            auth.createUserWithEmailAndPassword(email ,password)
            .then((userCredential) => {
                const user = userCredential.user;  
                const isNewEmail = userCredential.additionalUserInfo.isNewUser; 
                const id = userTable.push().key;
                console.log(user);
                if(isNewEmail){
                    userTable.child(user.uid).set({
                        'id' :  user.uid ,
                        'Fullname' : fullname,
                        'Email' : email,
                        'Username' : username,
                        'emailIsVerified' : false,
                        'profile' : user.photoURL,
                        'parentId' : id,
                        'userType' : 'normal',
                        'longitude':longitudei,
                        'latitude':latitudei
                    });
                    var userInfo = { };
                    userTable.once("value", snap => {
                        let userRecord = snap.val();
                        /* keeping user info in localstorage */ 
                        for(var i in userRecord){
                            console.log(userRecord[i]);
                            if(userRecord[i].Email == email ){
                                localStorage.setItem("userInfo",JSON.stringify(userRecord[i]));
                                location.href  = './browse.html';
                            }
                        }
                    })
                    
                    createAccount.reset();
                }
            }) 
            .catch((error) => {
                console.log(error);
            });
        }   
    }     
})
logout();
const signUpGoogle = document.getElementById('with-g');
signUpGoogle.addEventListener('click',()=>{
    hideFullForm();
    var latitudei = 0000;
    var longitudei = 0000;
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(posistion => {
            latitudei = posistion.coords.latitude;
            longitudei = posistion.coords.longitude;
        });
        const removeNotification = showNotification(`!`,'Proccesing information','success','noEnd');
        let email = document.getElementById('Email') ; 
        auth.signInWithPopup(googleProvider)
        .then((result) => {
            removeNotification();
            if (result.credential) {                    
                var credential = result.credential;
                var token = credential.accessToken;
            } 
            let isNotNewUser = result.additionalUserInfo.isNewUser;
            if( isNotNewUser ){ 
                /* ==== Start:: Getting user Info ====== */ 
                    var user = result.user;
                    //userNameCreation
                    const userNameCreator = () => {                        
                        let uname = user.email;
                        let newUsername = uname.split('@')[0];
                        return newUsername;
                    } 
                    let userName = userNameCreator();
                    userTable.child(user.uid).set({
                        'id' :  user.uid ,
                        'Fullname' : user.displayName,
                        'Email' : user.email,
                        'Username' : userName,
                        'emailIsVerified' : false,
                        'profile' : user.photoURL,
                        'parentId' : user.uid,
                        'userType' : 'normal',
                        'updatedProfie': false ,
                        'longitude':longitudei,
                        'latitude':latitudei
                    });
                /* ==== End:: Getting user Info ====== */
                /* ===== Start:: Setting Email ===== */
                    email.value = user.email;
                /* ===== End:: Setting Email ======= */ 
                const query = userTable.orderByChild('Email').limitToFirst(1).equalTo(user.email);   
                query.once('value' , (snap) => { 
                    let userRecord = snap.val();                     
                    /* ==== start:: keeping user info in localstorage ==== */ 
                    for(var i in userRecord){
                        if(userRecord[i].Email == user.email){
                            localStorage.setItem("userInfo",JSON.stringify(userRecord[i]));
                            location.href  = './browse.html';
                        }
                    }
                    /* ==== End:: keeping user info in localstorage ==== */                   
                }) 
            }
            else{
                showNotification('!','Your Email have already been signed up here', 'error');
            }
           
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            location.reload();
        });
    }
    else{
        const removeNotification = showNotification(`!`,'Proccesing information','success','noEnd');
        let email = document.getElementById('Email') ; 
        auth.signInWithPopup(googleProvider)
        .then((result) => {
            removeNotification();
            if (result.credential) {                    
                var credential = result.credential;
                var token = credential.accessToken;
            } 
            let isNotNewUser = result.additionalUserInfo.isNewUser;
            if( isNotNewUser ){ 
                /* ==== Start:: Getting user Info ====== */ 
                    var user = result.user;
                    //userNameCreation
                    const userNameCreator = () => {                        
                        let uname = user.email;
                        let newUsername = uname.split('@')[0];
                        return newUsername;
                    } 
                    let userName = userNameCreator();
                    userTable.child(user.uid).set({
                        'id' :  user.uid ,
                        'Fullname' : user.displayName,
                        'Email' : user.email,
                        'Username' : userName,
                        'emailIsVerified' : false,
                        'profile' : user.photoURL,
                        'parentId' : user.uid,
                        'userType' : 'normal',
                        'updatedProfie': false ,
                        'longitude':longitudei,
                        'latitude':latitudei
                    });
                /* ==== End:: Getting user Info ====== */
                /* ===== Start:: Setting Email ===== */
                    email.value = user.email;
                /* ===== End:: Setting Email ======= */ 
                const query = userTable.orderByChild('Email').limitToFirst(1).equalTo(user.email);   
                query.once('value' , (snap) => { 
                    let userRecord = snap.val();                     
                    /* ==== start:: keeping user info in localstorage ==== */ 
                    for(var i in userRecord){
                        console.log(userRecord[i]);
                        if(userRecord[i].Email == user.email){
                            localStorage.setItem("userInfo",JSON.stringify(userRecord[i]));
                            location.href  = './browse.html';
                        }
                    }
                    /* ==== End:: keeping user info in localstorage ==== */                   
                }) 
            }
            else{
                showNotification('!','Your Email have already been signup here', 'error');
            }
           
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(error);
            location.reload();
        });
    }
});