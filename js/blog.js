
// send user back to browse if he or she did not provide blog
var blogId = localStorage.getItem('blogId');
blogId == null ? location.href = './browse.html' : '' ;
var interval = 6; 
/* ===================== Start:: Folding blog function ============================ */
const folder = document.getElementById('folder');
folder.addEventListener('click',() =>{
    const blogSide = document.getElementById('blog-side');
    const blogReadingSide = document.getElementById('blog-reading-side');
    blogSide.classList.toggle('folded');
    blogReadingSide.classList.toggle('unfolded');
})
/* ===================== End:: Folding blog function ============================= */
/* == Start::removing useful elemnt if user is not logged in */
elementLeader();
/* == End:: removing useful elemnt if user is not logged in */



const getComment = (addTo = null) =>{
   
    var commentSection = document.getElementById('comment-details-section');
    var commentInfo = '';
    console.log(commentSection);
    fetch(`${baseUrl}api/v1/comments?limit=${commentInteval}&q=${blogId}`, {
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
            return Promise.reject(response);
        }
    })
    .then(function (response) {
        let data = response.data;
        var htmlInfo = `
        <div class="commenters-details">
            <div class="user-comment">       
                <div class="user-comment-info ">
                    <div class="comment-words success">
                        No Comment found
                    </div>
                </div>
            </div>
            <div class="comment-divider"></div>
        </div>`;

        if(data){
            htmlInfo = ''
            data.forEach(value => {
                fetch(`${baseUrl}api/v1/user/find/${value.userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'auth-token': token
                    }
                })
                .then( (response) => {                  
                    return response.json();                    
                })
                .then((response) => {
                    let commenterData = response.data;
                    let commenterProfile  = commenterData.profile;
                    htmlInfo +=`
                    <div class="commenters-details">
                        <div class="user-comment">
                            <div class="user-profile">
                                <img src="${commenterProfile ? commenterProfile : '../assets/images/profile.png'}" id="profile"  alt="sezerano">
                            </div>
                            <div class="user-comment-info">
                                <p class="leon" >${commenterData.Fullname}</p>
                                <div class="comment-words">
                                   ${value.comment}
                                </div>
                            </div>
                        </div>                     
                        <div class="comment-divider"></div>
                    </div>
                    `;
                    commentSection.innerHTML = htmlInfo;
                })
                .catch((error) => {
                    console.log(error)
                })
            });
            
        }
        
        
    }).catch(function (err) {     
       showNotification('<i class="fas fa-bell"></i>',err.statusText,'error');
    });


}



// usefull valiable
var limitInterval = 3 ;
var addToInterVal = 3 ;
var commentInteval = 2;
var moreComent = null;
/*  ====================== Start:: Getting selected blog information ============= */
const gettingSelectBogData = (blogIdSent) => {

    var blogDisplay = document.getElementById('blog-reading-side');
    var dataPlacer = ` `;
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
        data.forEach(value => {
                   
                dataPlacer += `
                <div class="top-banner">
                    <img src="${value.postBanner}" alt="" srcset="">
                </div>
                <div class="blog-text">
                    <div class="blog-read-header">
                        <h3 class="leon">${value.Title}</h3>
                    </div>
                    <div class="blog-read-body">
                        <span class="sub-title">
                            <p>
                            ${value.Subtitle}
                            </p>
                        </span>
                        <div class="discription" >
                        ${value.info}
                        </div>
                    </div>
                </div>`;
            if(userInfo != null ) 
                dataPlacer += `<div class="voting">
                                <div class="icons">
                                    <div class="up-vote">
                                        <div class="up-vote-icon">
                                            <img src="../assets/svgs/up-vote.svg" alt="" srcset="">                                                      
                                        </div>
                                        <div class="up-vote-counter">
                                            <span>
                                                12
                                            </span>
                                        </div>
                                    </div>
                                    <div class="divider">
                                        <svg width="2" height="36" viewBox="0 0 2 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M1 0V36" stroke="black" stroke-opacity="0.33" stroke-width="2"/>
                                        </svg>                                                    
                                    </div>
                                    <div class="down-vote">
                                        <div class="down-vote-icon">
                                            <img src="../assets/svgs/down-vote.svg" alt="">                                                                                                        
                                        </div>
                                        <div class="down-vote-counter">
                                            <span>
                                                12
                                            </span>
                                        </div>
                                    </div>
                                    <div class="divider">
                                        <svg width="2" height="36" viewBox="0 0 2 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M1 0V36" stroke="black" stroke-opacity="0.33" stroke-width="2"/>
                                        </svg>                                                    
                                    </div>
                                    <div class="comment" onclick="commentHub()" >
                                        <div class="comment-icon" id="commentbtn" >
                                            <img src="../assets/svgs/comment.svg" alt="" srcset="">                                                                                                             
                                        </div>
                                        <div class="comment-counter">
                                            <span>
                                                05
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>`;
                            
        });
        dataPlacer += `
        <div class="comments-class hidden-comment" id="commenting-section"> 
            <div class="comment-information" id="comment-details-section">
            
            </div>  
            <div class="link" > <p class="lean"  id="moreComment" onclick="getMoreComment()" > Get comments</p> </div>
            <div class="send-comment" id="comment-form">
               `;
            if(userInfo == null ) 
                dataPlacer += `
                <div class="link" > <p class="lean"  id="moreComment"><br> Inorder to be commenting you need to be logged in</p> </div>
                `;
            if(userInfo != null )
                dataPlacer += `
                    <div class="postComment" action="#" method="post"> 
                        <div class="input-field">
                            <textarea name="comment" id="commenting-area" placeholder="Comment" cols="30" rows="10"></textarea>
                        </div>
                        <div class="input-field">
                            <div class="send">
                                <button type="submit" id="post-comment" onclick="enableComment()" >Post</button>
                            </div>
                        </div> 
                    </div>
                `;

        dataPlacer += `
                    </div>                         
                </div>`;
        blogDisplay.innerHTML = dataPlacer;
        // removeNotification();
    }).catch(function (err) {
        // removeNotification();
        console.warn('Something went wrong.', err);
    });
}
gettingSelectBogData(blogId);
/*  ====================== End:: Getting selected blog information =============== */

/* =======================Start::  Getting summary Blog info ============= */
const gettingSummaryBlog = (limitiParam = null) => {
    getComment();
    let limit = limitiParam === null ? interval : interval + limitiParam; 
    interval = limit; 
    const removeNotification = showNotification(`<i class="fas fa-bell"></i>`,'Fetching more blogs','success','noEnd');
  

    var blogDisplay = document.getElementById('blog-side');
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
            return Promise.reject(response);
        }
    })
    .then(function (response) {
        let data = response.data;
        if(data){
            data.forEach(value => {
                dataPlacer += `
                <div class="blog-card" onclick="revealNewBlog('${value._id}')" >
                    <div class="blog-summary-content">
                        <div class="blog-image-banner">
                        <img src="${value.postBanner}" alt="" />
                        </div>
                        <div class="blog-content-s">
                            <h3 class="leon">${value.Title}</h3>
                            <span class="sub-title">
                                <p>
                                    ${value.Subtitle}
                                </p>
                            </span>
                            <div class="blog-info">
                                <p>
                                    ${value.info}
                                </p>                                       
                            </div>
                        </div>
                    </div>
                </div>
                `;
            });
            dataPlacer += `
            <div class="next-card">
                <div class="icon-next" onClick="gettingSummaryBlog(2)">
                    <img src="../assets/svgs/next-icon.svg" alt="" srcset="">     
                </div>
            </div>      
            <div class="next-card-w">
                <div class="icon-next-w" onClick="gettingSummaryBlog(2)">
                    <img src="../assets/svgs/next-icon-w.svg" alt="" srcset="">     
                </div>
            </div> 
            `;
           
            blogDisplay.innerHTML = dataPlacer;
        }
        
        removeNotification();
    }).catch(function (err) {
        removeNotification();
        console.warn( err);
    });
}
gettingSummaryBlog();
/* =======================End::  Getting summary Blog info =============== */
/* =======================Start::  Select Blog =========================== */
const revealNewBlog = (newBlogId) => {
    localStorage.setItem('blogId',newBlogId);
    blogId = localStorage.getItem('blogId');
    gettingSelectBogData(newBlogId);
}
/* =======================Start::  Select Blog =========================== */
//Implimanting commenting


const commentHub = () => {
    const commentingSection = document.getElementById('commenting-section');
    commentingSection.classList.toggle('hidden-comment');        
    getComment();
}

const enableComment = () => {
    
var postBtn = document.getElementById('post-comment');
postBtn.addEventListener('click' , () => {
    const commentInfo = isEmpty('commenting-area' , 'Comment');
    // getting date 
    const today = new Date();
    const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate() + " " + today.getHours() + ":" + today.getMinutes() ;
    const removeNotification = showNotification(`<i class="fas fa-laugh"></i>`,'Creating your comments','success','noEnd');
    /* ============= Start:: Creating a comment =============== */    
        fetch(`${baseUrl}api/v1/comments/create`, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': token
            },
            body: JSON.stringify({
                "comment" :commentInfo.value,
                "blogId" : blogId
            })
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
            let token = response.data.token;
            showNotification(`<i class="fas fa-laugh"></i>`,`Comments created`,'success');
        })
        .catch(function (err) {    
            if(err.status == 401 ){
                showNotification(`<i class="fas fa-exclamation-circle"></i>`,`Please login`,'error');
            }
            if(err.status == 404 ){
                showNotification(`<i class="fas fa-exclamation-circle"></i>`,`Make sure you all comment is not empty`,'error');
            }
        });
    /* ============== End:: Creating a comment ================ */    
  
    commentInteval++;
    gettingSelectBogData(blogId);
})
}



const getMoreComment = () => {
    commentInteval++;
    getComment();
}