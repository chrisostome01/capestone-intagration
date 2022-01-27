
/* Initialize Database  */
const app = firebase.initializeApp(firebaseConfig);
const database = app.database();

// send user back to browse if he or she did not provide blog
const blogId = localStorage.getItem('blogId');
blogId == null ? location.href = './browse.html' : '' ;

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
// usefull valiable
var limitInterval = 2 ;
var addToInterVal = 3 ;
/* =====Start Getting Db ref ======= */
const Blogs = database.ref('Blogs');
/* =====End Getting Db ref ======= */

/*  ====================== Start:: Getting selected blog information ============= */
const gettingSelectBogData = (blogIdSent) => {
    const query = Blogs.orderByChild('id').limitToFirst(1).equalTo(blogIdSent);
    var blogReadingSide = document.getElementById('blog-reading-side');
    var htmlInfo = '';
    query.on("value", function(snapshot) {
        var data = snapshot.val();   
        for(var i in data){           
            htmlInfo += `
            <div class="top-banner">
                <img src="${data[i].postBanner}" alt="" srcset="">
            </div>
            <div class="blog-text">
                <div class="blog-read-header">
                    <h3 class="leon">${data[i].Title}</h3>
                </div>
                <div class="blog-read-body">
                    <span class="sub-title">
                        <p>
                        ${data[i].Subtitle}
                        </p>
                    </span>
                    <div class="discription" >
                    ${data[i].info}
                    </div>
                </div>
            </div>`;
        if(userInfo != null ) 
            htmlInfo += `<div class="voting">
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
                                <div class="comment">
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

            }
        blogReadingSide.innerHTML = htmlInfo;
    })  
}
// gettingSelectBogData(blogId);
/*  ====================== End:: Getting selected blog information =============== */

/* =======================Start::  Getting summary Blog info ============= */
const gettingSummaryBlog = (limitiParam = null) => {
    var limitValues = limitiParam != null ? limitInterval : limitInterval + 1 ;
    var query = Blogs.limitToLast(limitValues);
    var blogSide = document.getElementById('blog-side');
    query.on('value' , (snapshot) => {
        var htmlInfo = '' ;
        if(snapshot.exists()){
            var data = snapshot.val();
            for(var i in data){
                htmlInfo += `
                <div class="blog-card" onclick="revealNewBlog('${data[i].id}')" >
                    <div class="blog-summary-content">
                        <div class="blog-image-banner">
                        <img src="${data[i].postBanner}" alt="" />
                        </div>
                        <div class="blog-content-s">
                            <h3 class="leon">${data[i].Title}</h3>
                            <span class="sub-title">
                                <p>
                                    ${data[i].Subtitle}
                                </p>
                            </span>
                            <div class="blog-info">
                                <p>
                                    ${data[i].info}
                                </p>                                       
                            </div>
                        </div>
                    </div>
                </div>
                `;
            }
            htmlInfo += `
            <div class="next-card">
                <div class="icon-next">
                    <img src="../assets/svgs/next-icon.svg" alt="" srcset="">     
                </div>
            </div>      
            <div class="next-card-w">
                <div class="icon-next-w">
                    <img src="../assets/svgs/next-icon-w.svg" alt="" srcset="">     
                </div>
            </div> 
            `;
            blogSide.innerHTML = htmlInfo;

        }
    })
}
gettingSummaryBlog();
/* =======================End::  Getting summary Blog info =============== */
/* =======================Start::  Select Blog =========================== */
const revealNewBlog = (newBlogId) => {
    gettingSelectBogData(newBlogId);
}
/* =======================Start::  Select Blog =========================== */
//Implimanting commenting

const commentBtn = document.getElementById('commentbtn');
commentBtn != null ? 
    commentBtn.addEventListener('click' , () => {
        const commentingSection = document.getElementById('commenting-section');     
        commentingSection.classList.toggle('hidden-comment');
    })
: '';

const postBtn = document.getElementById('post-comment');
postBtn != null ?
    postBtn.addEventListener('click' , () => {
        const commentInfo = isEmpty('commenting-area' , 'Comment');
        // getting date 
        const today = new Date();
        const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate() + " " + today.getHours() + ":" + today.getMinutes() ;

        if(commentInfo.pass){
            const commentTable = database.ref('Comments');
            const uniqueId = commentTable.push().key;
            if(userInfo != null){
                commentTable.push().set({
                    "id": uniqueId,
                    "userId":userInfo.id,
                    "commentedOn":blogId,
                    "comment":commentInfo.value,
                    "commentedDate":date
                })
                .then(() => {
                    showNotification('!','Your comment have been posted','success');
                    document.getElementById('commenting-area').value = '';
                })
                .catch((error) =>{
                    showNotification('!','Please try to make sure you are connected to the internet and try again','error');
                })
            }
        }
        addToInterVal += 1;
        getComment();
    })
: '';

var moreComent = document.getElementById('moreComment');
const getComment = (addTo = null) =>{
    const commentDetail = document.getElementById('comment-details-section');
    const commentTable = database.ref('Comments');
    const userTable = database.ref('users');
    const query  = commentTable.orderByChild('commentedOn').limitToFirst(addToInterVal).equalTo(blogId);
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
        
    query.on('value', (snap) =>{
        let data = snap.val();
        if(snap.exists()){
            htmlInfo = ``;
            
            for(let i in data){
                const commentedByQuery  = userTable.orderByChild('id').limitToFirst(1).equalTo(data[i].userId);
                var commenterUsername = '';
                var commenterProfile = '';
                commentedByQuery.on('value' , (snap) =>{
                    const userData = snap.val();
                   
                    for(let i in userData){
                        commenterUsername = userData[i].Username;
                        commenterProfile = userData[i].profile;
                    }
                    htmlInfo +=`
                    <div class="commenters-details">
                        <div class="user-comment">
                            <div class="user-profile">
                                <img src="${commenterProfile}" id="profile"  alt="sezerano">
                            </div>
                            <div class="user-comment-info">
                                <p class="leon" > ${commenterUsername}</p>
                                <div class="comment-words">
                                   ${data[i].comment}
                                </div>
                            </div>
                        </div>                     
                        <div class="comment-divider"></div>
                    </div>
                    `;
                    moreComent.innerHTML = 'Get more comments';
                }) 
                
               
            }
            commentDetail.innerHTML = htmlInfo;
            moreComent.innerHTML = 'Get more comments';
        }
        else{
            moreComent.remove();
            commentDetail.innerHTML = htmlInfo;
        }
        
    })
}

getComment();
moreComent.addEventListener('click' , () => {
    addToInterVal += 1 ;
    getComment();
})