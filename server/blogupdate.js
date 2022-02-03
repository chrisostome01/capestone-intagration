
/* Initialize Firebase  */
const app = firebase.initializeApp(firebaseConfig);
const database = app.database();


// send user back to browse if he or she did not provide blog
const blogId = localStorage.getItem('blogId');
if(blogId == null){
    location.href = './browse.html';
}

// Element Auth
elementLeader();



// initializing tinmyce
tinymce.init({
    selector: '#blog-info',
    plugins: 'a11ychecker advcode casechange export formatpainter image linkchecker autolink lists checklist pageembed permanentpen powerpaste table advtable tinycomments tinymcespellchecker',
    toolbar: 'a11ycheck addcomment showcomments casechange checklist image code export formatpainter  permanentpen table',
    toolbar_mode: 'floating',
    tinycomments_mode: 'embedded',
    mode : "specific_textareas",
  });

//   Updatig 

var blogForm = document.getElementById('new-blog-form');
blogForm.addEventListener('submit' , (e) => {
    e.preventDefault(); 
    var BlogTable = database.ref('Blogs');
    const imagefield = document.getElementById("image");
    var uniqueid = blogId;
    if(imagefield.value.trim() == ''){
        showNotification(`image!`,'You have to select image','error');
    }
    else if( blogForm.querySelector('#title').value.trim() == '' ){
        showNotification(`title!`,'Title field should not be empty','error');
    }
    else if( blogForm.querySelector('#Subtitle').value.trim() == ''){
        showNotification(`Sub-title!`,'Sub-title field should not be empty','error');
    }
    else if( blogForm.querySelector('#blog-info').value.trim() == '' || blogForm.querySelector('#blog-info').value.trim().length < 200){
        showNotification(`Comment!`,'Comment field should not be empty and it should be over 200 charactors','error');
    }
    else{
        // gettinng information from input
       var image = document.getElementById("image").files[0];
       var imageName = image.name;
       var storageRef = firebase.storage().ref("images/"+uniqueid+"/"+ imageName);
       var uploadTask = storageRef.put(image);
       let title = blogForm.querySelector('#title').value;
       let Subtitle = blogForm.querySelector('#Subtitle').value;
       let Information = tinymce.activeEditor.getContent();
       const removeNotification =  showNotification(`!`,'Comment field should not be empty and it should be over 200 charactors','success','noEnd');
       uploadTask.on(
           "state_changed",
           function (snapshot) {
             var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
             console.log("upload is " + progress + " done");
           },
           function (error) {
               console.log(error.message);
               removeNotification();
               showNotification(`Techinical error!`,'Please try again, failed to upload ','error');
            },
            function () {
               uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {                   
                    //updating a blog 
                    blogForm.reset(); 
                    removeNotification();
                 
                    fetch(`${baseUrl}api/v1/blogs/update/${blogId}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'auth-token': token
                        },
                        body: JSON.stringify({           
                            "Subtitle": Subtitle,
                            "Title": title,
                            "Description": Information,
                            "postBanner": downloadURL
                        }),
                        referrer: 'no-referrer'
                    })
                    .then(function (response) {
                        if (response.ok) {
                            return response.json();
                        } else {
                            return Promise.reject(response);
                        }
                    })
                    .then(function (response) {
                        showNotification(`<i class="fas fa-bell"></i>`,'Successfully updated','success');
                        readThisBlog(blogId);
                    }).catch(function (err) {
                        console.warn('Something went wrong.', err);
                    });
               });
            } 
         );
   }
})


/*  ====================== Start:: Getting selected blog information =======================*/

var content = '';
const gettingSelectBogData = (blogIdSent) => {
    var title = document.getElementById('title');
    var Subtitle = document.getElementById('Subtitle'); 
    var textArea = document.getElementById('blog-info');    
    const blogTitle = document.getElementById("blogTitle");

    fetch(`${baseUrl}api/v1/blogs/find?blogId=${blogIdSent}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        referrer: 'no-referrer'
    })
    .then(function (response) {
        if (response.ok) {
            return response.json();
        } else {
            return Promise.reject(response);
        }
    })
    .then(function (response) {
        let data = response.data;
        blogTitle.innerHTML = data[0].Title;
        title.value = data[0].Title;
        Subtitle.value = data[0].Subtitle;  
        content = data[0].info ;
    }).catch(function (err) {    
        console.warn('Something went wrong.', err);
    });
}
gettingSelectBogData(blogId);
window.addEventListener('load',() => { 
    tinymce.get('blog-info').setContent(content); 
})
/*  ====================== End:: Getting selected blog information =======================*/ 