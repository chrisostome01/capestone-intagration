
/* Initialize Database  */
const app = firebase.initializeApp(firebaseConfig);
const database = app.database();

// Element Auth
elementLeader();

// usefull varible
var interval = 6;


// initializing tinmyce

tinymce.init({
    selector: '#blog-info',
    plugins: 'a11ychecker advcode casechange export formatpainter image  linkchecker autolink lists checklist pageembed permanentpen powerpaste table advtable tinycomments tinymcespellchecker',
    toolbar: 'a11ycheck addcomment showcomments casechange checklist image code export formatpainter  permanentpen table',
    toolbar_mode: 'floating',
    tinycomments_mode: 'embedded',
  });
// function for showing blog

const bloglist = document.getElementById("blog-list");
const displayBlog = (inter = null) => {
    let limit = inter === null ? interval : interval + inter; 
    interval = limit; 
    const removeNotification = showNotification(`!`,'Fetching blogs','success','noEnd');
  

    var blogDisplay = document.getElementById('blog-list');
    var dataPlacer = ` `;
    fetch(`${baseUrl}api/v1/blogs?limit=${limit}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        referrer: 'no-referrer'
    })
    .then(function (response) {
        if(response.status == 200){
            return response.json();  
        }     
        else{
            return response
        }
    })
    .then(function (response) {
        let data = response.data;
        if(data){
            data.forEach(value => {
                dataPlacer += `
                <div class="r-card">
                    <div class="top-image">
                        <img src="${value.postBanner}" alt="" srcset="">
                    </div>
                    <div class="r-card-body">
                        <div class="r-card-title ">
                            <h5 class="leon" >${ellpsIt(value.Title,35)}</h5>
                        </div>
                        <div class="r-infomation">
                            <p>
                                ${ellpsIt(value.Subtitle,70)}
                            </p>
                        </div> 
                        `  
                        if(userInfo != null ) {
                            dataPlacer += userInfo.userType != null && userInfo.userType == 'admin' ? `<div class="r-card-footer flexed-footer">`:`<div class="r-card-footer">`;
                            dataPlacer += userInfo.userType != null && userInfo.userType == 'admin' ? ` <button class="read-more update"  onClick="updateThisBlog('${value._id}')">
                                                                            <svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                <path d="M4.29163 10.4243L6.682 10.4155L11.8993 4.85051C12.1041 4.63001 12.2167 4.33718 12.2167 4.02568C12.2167 3.71418 12.1041 3.42135 11.8993 3.20085L11.0402 2.27568C10.6307 1.83468 9.91629 1.83701 9.51004 2.27393L4.29163 7.8401V10.4243V10.4243ZM10.2743 3.10051L11.135 4.02393L10.27 4.94676L9.41092 4.02218L10.2743 3.10051ZM5.37496 8.3266L8.64121 4.84235L9.50029 5.76751L6.23458 9.2506L5.37496 9.25351V8.3266Z" fill="white"/>
                                                                                <path d="M3.20833 12.75H10.7917C11.3891 12.75 11.875 12.2267 11.875 11.5833V6.527L10.7917 7.69367V11.5833H4.91892C4.90483 11.5833 4.89021 11.5892 4.87613 11.5892C4.85825 11.5892 4.84038 11.5839 4.82196 11.5833H3.20833V3.41667H6.91713L8.00046 2.25H3.20833C2.61087 2.25 2.125 2.77325 2.125 3.41667V11.5833C2.125 12.2267 2.61087 12.75 3.20833 12.75Z" fill="white"/>
                                                                            </svg> 
                                                                            </button>` : '';
    
                            dataPlacer += userInfo.userType != null && userInfo.userType == 'admin' ? ` <button class="read-more delete"  onClick="deleteThisBlog('${value._id}')">
                                                                                <svg width="11" height="10" viewBox="0 0 11 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                    <path d="M9.89214 0L5.5 3.99286L1.10786 0L0 1.00714L4.39214 5L0 8.99286L1.10786 10L5.5 6.00714L9.89214 10L11 8.99286L6.60786 5L11 1.00714L9.89214 0Z" fill="white"/>
                                                                                </svg>
                                                                            </button>` : '';
                            
                         }
                         dataPlacer += ` <button class="read-more" onClick="readThisBlog('${value._id}')">Read more</button>
                                    </div>
                                </div>
                            </div> 
                            `; 
            });
            dataPlacer +=`<div class="more" >
              <button class="browse-more" id="next-for-new-blog" onclick="displayBlog(3)" >Browse more blog</button>
            </div>`;
            blogDisplay.innerHTML = dataPlacer;
        }
        
        removeNotification();
    }).catch(function (err) {
        removeNotification();
        console.warn( err);
    });
}
displayBlog();

const blogForm = document.getElementById('new-blog-form');
blogForm.addEventListener('submit',(sub) => {
    sub.preventDefault();
    // getting unique id
    const imagefield = document.getElementById("image");
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
        var storageRef = firebase.storage().ref("images/"+ imageName);
        var uploadTask = storageRef.put(image);
        let title = blogForm.querySelector('#title').value;
        let Subtitle = blogForm.querySelector('#Subtitle').value;
        let Information = tinymce.activeEditor.getContent();
        uploadTask.on(
            "state_changed",
            function (snapshot) {
              var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log("upload is " + progress + " done");
            },
            function (error) {
                console.log(error.message);
              },
              function () {
                uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                 const removeNotification =   showNotification('!','Uploading the image ','success',"noEnd");
                // getting date 
                const today = new Date();
                const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate() + " " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds(); ;
                /* ========== Start:: Adding blogs ============ */
                    fetch(`${baseUrl}api/v1/blogs/create`, {
                        method: 'POST',
                        mode: 'cors',
                        headers: {
                            'Content-Type': 'application/json',
                            'auth-token': token
                        },
                        body: JSON.stringify({
                            "Subtitle": Subtitle,
                            "Title": title,
                            "dateCreated": date,
                            "Description": Information,
                            "postBanner": downloadURL
                        })
                    })
                    .then(function (response) {
                        return response.json();
                    })
                    .then(function (response) {
                        removeNotification();
                        let status = response.status;
                        console.log(response);
                        let notificationColor = 'success';                        
                        if(status === "Fail" || status === "error"  ) {
                            showNotification('!',response.message,'error'); 
                        }
                        else{
                            showNotification('!',response.message,notificationColor);
                            displayBlog();
                        }
            
                    }).catch(function (response) {
                        const notificationColor = 'error';
                        removeNotification();
                        showNotification('!','Please try again sometime',notificationColor);
                    
                    });
                /* ========== End:: Adding blog  ============= */ 
               
                blogForm.reset(); 
                
                showNotification(`!`,'Fetching','success');
                document.getElementById('blog-model').classList.remove('blog-active');
                
               
               
                });
              }
          
          );
    }
})

0
/* ============= Start: Deleting a blog  ======================= */
var removeNot = null;
var blogIdToDelete = '';
const deleteThisBlog = (blogId) => {
    blogIdToDelete = blogId;
    removeNot = showNotification(`<i class="fas fa-bell"></i>`,`

    <div style="margin-button:90px" >
        <span> Click confirm to delete or close to close it </span>
    </div>

    <button class="read-more delete"  onClick="deleteBlog()">
        <i class="fas fa-check"></i>
    </button>
    
    <button class="read-more update" onClick="closeNotification()">
        <i class="fas fa-close"></i>
    </button>

    `,'error' , 'noEnd');
   
}
/* =============== End: Deleting a blog ======================= */

/* ============= Start: Updating a blog  ====================== */
const updateThisBlog = (blogId) => {
    localStorage.setItem("blogId",blogId);
    location.href = `./blogupdate.html`;    
}
/* ============= End: Updating a blog  ======================= */

/* ============== start:: Close ============================== */
const closeNotification = () => {
    removeNot(); 
}
/* ================ end:: Close ============================= */

const deleteBlog =  () => {
    fetch(`${baseUrl}api/v1/blogs/delete/${blogIdToDelete}`, {
        method: 'DELETE',
        mode: 'cors',
        headers: {
            'Content-Type' : 'application/json',
            'auth-token' : token
        }
    })
    .then( (response) => {
        if(response.ok){
            return response.json();
        }
        else{
            return Promise.reject(response);
        }
    })
    .then((response) => {
        removeNot(); 
        showNotification(` <i class="fas fa-check"></i>`,`
                <div style="margin-button:90px" >
                    <span>Blog have been deleted </span>
                </div>
            `,'success');
        displayBlog();
        localtion.reload();
    })
    .catch((error) => {
        removeNot(); 
        showNotification(` <i class="fas fa-check"></i>`,`
        <div style="margin-button:90px" >
            <span>Please try again</span>
        </div>
    `,'success');
        displayBlog();
    })
}