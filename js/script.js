/* ========= Adding click event for  bugger ========= */ 
var reveal =  document.getElementById('bugger');
var navbar =  document.getElementById('navbar');
reveal.addEventListener('click', function(){
    navbar.classList.toggle('showNav');
    reveal.classList.toggle('toggleBugger');
});

const contactForm = document.getElementById('contact-form-field');
contactForm.addEventListener('submit',(e) => {
    e.preventDefault();
    const isCommentValid = isEmpty('comment','Comment');
    const isSubjectValid = isEmpty('subject','Subject');
    const isEmailValid = validateContactEmail('email');
    if(isEmailValid.pass && isSubjectValid.pass && isCommentValid.pass){
        const removeNotification =  showNotification(`!`,'You form is being processed','success',"noEnd");     
        fetch(`${baseUrl}api/v1/contacts/send`, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "comment": isCommentValid.value,
                "email": isEmailValid.value,
                "subject": isSubjectValid.value
            })
        })
        .then(function (response) {
            return response.json();
        })
        .then(function (response) {
            removeNotification();
            let status = response.status;
            let notificationColor = 'success';
            if(status === "Fail" || status === "error"  ) {
                returnshowNotification('!',response.message,'error'); 
            }
            else{
                showNotification('!','You messsage have been sent',notificationColor);
            }
            

        }).catch(function (response) {
            const notificationColor = 'error';
            removeNotification();
            showNotification('!','Please try again sometime',notificationColor);
          
        });


        contactForm.reset();
    }   
})

/* ================== Start:: subscribe ========================== */ 
const subscribe = document.getElementById('subscribe');

subscribe.addEventListener('submit' , (e) => {
    e.preventDefault();
    const isEmailValid = validateContactEmail('subemail');
   
    if(isEmailValid.pass){
        const removeNotification =  showNotification(`<i class="fas fa-bell"></i>`,`Proccess your email`,'success' , 'noEnd');
        fetch(`${baseUrl}api/v1/subscribers/add`,{
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body:JSON.stringify({
                "Email" : isEmailValid.value
            })
        })
        .then(response => {
            removeNotification();
            subscribe.reset();
            // if(response.ok){
                return response.json()
            // }
        })
        .then(response => {
            
            if(response.data != null){
                showNotification(`<i class="fas fa-bell"></i>`,'Successfully subscribed','success');
            }
            else{
                showNotification(`<i class="fas fa-bell"></i>`,response.message,'error');
            }

        })
        .catch(err => {
            console.log(err)
        })
    }



})
/* ==================== End:: subscribe ========================== */ 


//model close and open
let close = document.getElementById('close');
if(close != null){
    let showBlogCreatModel = document.getElementById('showBlogCreatModel');
    close.addEventListener('click',() => {
        document.getElementById('blog-model').classList.remove('blog-active');
    })
    showBlogCreatModel != null ? 
        showBlogCreatModel.addEventListener('click',() => {
            document.getElementById('blog-model').classList.toggle('blog-active');
        })
    : '' ;
    
}
/* ================ Remove and Add element ================ */
const removeThisElement = (elementId) =>{
    document.getElementById(`${elementId}`).classList.add('hidden');
}
const setContent = (elementId,data) => {
    document.getElementById(`${elementId}`).innerHTML = data;
}
const setImage = (elementId,imageUrl) => {
    document.getElementById(`${elementId}`) != null ?
        document.getElementById(`${elementId}`).src = imageUrl 
    : '' ;
}
const addThisElement = (elementId) =>{
    document.getElementById(`${elementId}`).classList.remove('hidden');
}
//Getting user information
const token = localStorage.getItem('token');
getUserInfo(`${token}`);
const userInfo = JSON.parse(localStorage.getItem('userInfo'));

/* =========== Setting blog to read ================== */
const readThisBlog = (blogId) => {
    localStorage.setItem("blogId",blogId);
    location.href = './blog.html';
}
