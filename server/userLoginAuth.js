// amLoggedin();
login.addEventListener('submit',(e)=>{
   
    e.preventDefault();
    showPassword();  
    let email = document.getElementById('Email').value; 
    let password = document.getElementById('password').value;    
    if(isLoginInputValid.emailIsValid && isLoginInputValid.passwordIsValid){
        const removeNotification = showNotification(`!`,'Fetching your account information','success','noEnd');
    /* ============= Start:: User Logging =============== */    
    fetch(`${baseUrl}api/v1/user/login`, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "Email": email,
            "Password": password
        })
    })
    .then(function (response) {
        if (response.ok) {
            return response.json();
        } else {
            return Promise.reject(response);
        }
    })
    .then(function (response) {
       removeNotification();
       let token = response.data.token;
       showNotification(`!`,`You are now logged in`,'success');
       localStorage.setItem("token",token);
       location.href  = './browse.html';
    }).catch(function (err) {
       
        removeNotification();
        if(err.status == 401 ){
            showNotification(`!`,`Invalid credentials`,'error');
        }
       if(err.status == 404 ){
            showNotification(`!`,`Make sure you all inputs are valid`,'error');
        }
    });
    /* ============== End:: User Logging ================ */    
       
    }
    else{
        showNotification(`!`,'Please make sure all field are not empty','error');     
        login.reset();
    }
  
})

const logInGoogle = document.getElementById('with-g');
logInGoogle.addEventListener('click',()=>{
    hidePassword();
    const removeNotification = showNotification(`!`,'Proccesing information','success','noEnd');
    let email = document.getElementById('Email') ; 
    auth.signInWithPopup(googleProvider)
    .then((result) => {
        const user = result.user;
        if (result.credential) {
            var credential = result.credential;
            var token = credential.accessToken;
        } 
        let isNotNewUser = result.additionalUserInfo.isNewUser;
        if( !isNotNewUser ){ 
            /* ==== End:: Getting user Info ====== */  
            /* ==========Start:: Updating user profile ========= */
            const query = userTable.orderByChild('Email').limitToFirst(1).equalTo(user.email);   
            query.once('value' , (snap) => { 
                snap.forEach((child) => { 
                    child.ref.update({
                        'profile' : user.photoURL,
                        'emailIsVerified':true
                    })
                    .then(() => {
                        console.log('done');
                    })  
                    .catch(error => {
                        console.log(error);
                    })
                })
               
                let userRecord = snap.val(); 
                
                /* ==== start:: keeping user info in localstorage ==== */ 
                for(var i in userRecord){
                    if(userRecord[i].Email == user.email){
                        localStorage.setItem("userInfo",JSON.stringify(userRecord[i]));
                        location.href  = './browse.html';
                    }
                }
                /* ==== End:: keeping user info in localstorage ==== */ 
                removeNotification();
            }) 
            /* =========End:: Updating user profile =========== */  
            
            /* ===== Start:: Setting Email ========= */
                email.value = user.email;
            /* ===== End:: Setting Email ========= */ 
           
        }
        else{
            var latitudei = 0000;
            var longitudei = 0000;
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
       
    })
    .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(error);
        location.reload();
    });
});
