logout();
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
             /* ============= Start:: User Logging =============== */    
            fetch(`${baseUrl}api/v1/user/register`, {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "Username" : username,
                    "password" : password,
                    "Email" : email,
                    "Fullname" : fullname
                })
            })
            .then(function (response) {
                removeNotification();              
                return response.json();
                
            })
            .then(function (response) {
                if(response.data != null){
                    showNotification(`<i class="fas fa-bell"></i>`,response.message,'success');
                    location.href  = './login.html';
                }
                else{
                    showNotification(`<i class="fas fa-bell"></i>`,response.message,'error');
                    
                }
            })
            .catch(function (err) {  
                showNotification('<i class="fas fa-bell"></i>',err.message, 'error')
            });
        /* ============== End:: User Logging ================ */    
        }   
    }    
})

const signUpGoogle = document.getElementById('with-gkk');
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