if(!isObject(userInfo) || isUndifined(userInfo) ){
    location.href = './login.html';
}


/* Initialize Database  */
const app = firebase.initializeApp(firebaseConfig);
const database = app.database();
elementLeader();
var limitInterval = 4 ;

const getContactInfo = (limitSent =  null) => {
    var limit = limitSent == null ? limitInterval : limitSent + limitInterval;
    const contactInfo = document.getElementById('contacts-info');
    var htmlInfo = '';
    let query = database.ref('contact').orderByChild('isNew').limitToLast(limit).equalTo(true);
    query.once('value', (snap) => {
        let data = snap.val();
        for(let i in data){
            htmlInfo += `
                <div class="cbody shodow-none content-padding">
                    <div class="set"> 
                        <div class="r-card post-card" id="postCard" >
                            <div class="user-profile " id="profile-image">
                                <img src="../images/L8tWZT4CcVQ.jpg" id="profile-p" alt="sezerano">
                            </div>  
                            <div class="comment-field">
                                <div class="label-and-value quot">
                                    <img src="../assets/svgs/quotes.svg"  alt="chrysostome" srcset="">
                                </div>                            
                                <div class="label-and-value">
                                    <label for="">Email :</label> <span>${data[i].email}</span>
                                </div>
                                <div class="label-and-value">
                                    <label for="">Subject :</label> <span> ${data[i].subject} </span>
                                </div>
                                <div class="label-and-value">
                                    <label for="">Comment :</label>
                                    <span>  
                                       ${data[i].comment}                               
                                    </span>
                                </div>
                            </div>     
                            <div class="add-button" id="reply" onclick="replyTo('${data[i].id}')" >
                                <img src="../assets/svgs/paper-plane.svg" alt="" srcset="">
                            </div>     
                        </div>
                    </div>                      
                </div>
                `;
        } 
        if(userInfo.userType == 'admin'){
            contactInfo.innerHTML = htmlInfo;
            document.getElementById('contact-label').classList.toggle('hidden');
        }    
    });
}

window.addEventListener('load',() => {
    getContactInfo();
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
                //Creating a blog 
                var query = database.ref('users').orderByChild('id').limitToFirst(1).equalTo(uniqueid);
                query.once('value',(snap) => {
                    snap.forEach(child => {
                        child.ref.update({
                            profile: downloadURL
                        })
                    });
                    location.href = './login.html';
                });
           });
        });
    }
    else{
        showNotification(`!`,'Please make sure you have selected image','error');
    }
})

 
window.addEventListener('load',() => {
    setImage('imageToUpload',userInfo.profile);
})