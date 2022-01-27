logout();
login.addEventListener('submit',(e)=>{
   
    e.preventDefault();
    showPassword();  
    let email = document.getElementById('Email').value; 
    let password = document.getElementById('password').value;    
    if(isLoginInputValid.emailIsValid && isLoginInputValid.passwordIsValid){
        const removeNotification = showNotification(`!`,'Fetching your account information','success','noEnd');
        var userInfo = {};
       
        auth.signInWithEmailAndPassword(email,password)
        .then(Credentials => {
            userTable.once("value", snap => {
                removeNotification();
                let userRecord = snap.val();
                // console.log('returned record' , userRecord);
                /* keeping user info in localstorage */ 
                for(var i in userRecord){
                    console.log(userRecord[i]);
                    if(userRecord[i].Email == email ){
                        localStorage.setItem("userInfo",JSON.stringify(userRecord[i]));
                        location.href  = './browse.html';
                    }
                }
            })
            
            login.reset();
            
        })
        .catch(error => {
            removeNotification();
            showNotification(`!`,error.code.split('/')[1].replace('-',' '),'error');       
            login.reset();   
        })     
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
