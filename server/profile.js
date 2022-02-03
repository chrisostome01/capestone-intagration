if(userInfo == 'null' ){
    location.href = './login.html';
}


/* Initialize Firebase storage  */
const app = firebase.initializeApp(firebaseConfig);
elementLeader();
var limitInterval = 4 ;

const getContactInfo = (limitSent =  null) => {
    var limit = limitSent == null ? limitInterval : limitSent + limitInterval;
    const contactInfo = document.getElementById('contacts-info');
    var htmlInfo = '';
    const removeNotification = showNotification(`<i class="fas fa-bell"></i>`,'Fetching queries','success','noEnd');
    fetch(`${baseUrl}api/v1/contacts?limit=${limit}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'auth-token': token
        },
        referrer: 'no-referrer'
    })
    .then(function (response) {
        removeNotification();
        if (response.ok) {
            return response.json();
        } else {
            return Promise.reject(response);
        }
    })
    .then(function (response) {
        if(response.data.length != 0){
            showNotification(`<i class="fas fa-bell"></i>`,'Queries fetched','success');
          
            response.data.forEach(value => {
                htmlInfo += `
                <div class="cbody shodow-none content-padding">
                    <div class="set"> 
                        <div class="r-card post-card" id="postCard" >
                            <div class="user-profile " id="profile-image">
                                <img src="../assets/images/L8tWZT4CcVQ.jpg" id="profile-p" alt="sezerano">
                            </div>  
                            <div class="comment-field">
                                <div class="label-and-value quot">
                                    <img src="../assets/svgs/quotes.svg"  alt="chrysostome" srcset="">
                                </div>                            
                                <div class="label-and-value">
                                    <label for="">Email :</label> <span>${value.email}</span>
                                </div>
                                <div class="label-and-value">
                                    <label for="">Subject :</label> <span> ${value.subject}</span>
                                </div>
                                <div class="label-and-value">
                                    <label for="">Comment :</label>
                                    <span>  
                                       ${value.comment}                               
                                    </span>
                                </div>
                            </div>     
                            <div class="add-button" id="reply" onclick="replyTo('${value._id}')" >
                                <img src="../assets/svgs/paper-plane.svg" alt="" srcset="">
                            </div>     
                        </div>
                    </div>                      
                </div>
                `;
            })
            contactInfo.innerHTML = htmlInfo;
        }
        else{
            showNotification(`<i class="fas fa-bell"></i>`,'No Queries found','success');
        }
        
        
    }).catch(function (err) {
        showNotification(`<i class="fas fa-bell"></i>`,'You don\'t have right to this functionality','error');
      
    });

}

window.addEventListener('load',() => {
    userInfo.userType == 'admin' ?
        getContactInfo()
    : '' ;    
});
const replyTo = (contactId) => {
    localStorage.setItem('cid',contactId);
    console.log(contactId);
} 

const imageInput = document.getElementById('newImage');
const imageToUpload = document.getElementById('imageToUpload');
imageInput.addEventListener('change', function () {
    var singleFile = imageInput.files[0];
    var path = imageInput.value;
    const reader = new FileReader();
    reader.addEventListener('load', (event) => {
        setImage('imageToUpload' ,  event.target.result)
    });
    reader.readAsDataURL(singleFile);
  }, false);

const saveProfile = document.getElementById('save-profile');

saveProfile.addEventListener('click' , () => {    
    const imageInput = document.getElementById('newImage');
    const imageToUpload = document.getElementById('imageToUpload');
    var singleFile = imageInput.files[0];
    if(singleFile != null){
        var image = imageInput.files[0];
        var imageName = image.name;
        let uniqueid = userInfo.id;
        var storageRef = firebase.storage().ref("profile/"+uniqueid+"/"+ imageName);
        var uploading = storageRef.put(image);
        uploading.on('state_changed',
        (snapshot)=> {
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("upload is " + progress + " done");
        },
        (error)=> {
            showNotification(`Techinical error!`,'Please try again ','error');
        },
        ()=> {
            uploading.snapshot.ref.getDownloadURL().then(function (downloadURL) {                   
                //Updating user profile
                fetch(`http://localhost:3500/api/v1/user/update`, {
                    method: 'PUT',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json',
                        'auth-token' : token
                    },
                    body: JSON.stringify({
                        "profile": downloadURL,
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
                    showNotification(`!`,`Your profile have been updated`,'success');
                    setImage('imageToUpload', downloadURL );
                })
                .catch(function (err) {                
                    removeNotification();
                    if(err.status == 401 ){
                        localStorage.setItem('token' , null);
                        showNotification(`<i class="fas fa-bell" > </i>`,`Invalid credentials`,'error');
                    }
                    if(err.status == 404 ){
                        showNotification(`<i class="fas fa-bell" > </i>`,`Make sure you all inputs are valid`,'error');
                    }
                    if(err.status == 204 ){
                        showNotification(`<i class="fas fa-bell" > </i>`,`Please login again`,'error');
                        
                    }
                });
           });
        });
    }
    else{
        showNotification(`<i class="fas fa-bell" > </i>`,'Please make sure you have selected image','error');
    }
})

 
window.addEventListener('load',() => {
    setImage('imageToUpload', !userInfo.profile ? '../assets/images/profile.png' : userInfo.profile );
})