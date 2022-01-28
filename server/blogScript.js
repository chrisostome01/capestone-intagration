
window.addEventListener("load" , () => {
    var blogDisplay = document.getElementById('blogDisplay');
    var dataPlacer = ` `;
    fetch('https://capstonetyu.herokuapp.com/api/v1/blogs', {
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
            <div class="r-card">
                <div class="top-image">
                    <img src="${value.postBanner}" alt="" srcset="">
                </div>
                <div class="r-card-body">
                    <div class="r-card-title">
                        <h5 class="leon">${value.Title}</h5>
                    </div>
                    <div class="r-infomation">
                        <p>
                            ${value.info}
                        </p>
                    </div>
                    <div class="r-card-footer">
                        <button class="read-more" >Read more</button>
                    </div>
                </div>
            </div>  
            `;                
        });
        dataPlacer += `
        <div class="more" >
            <button class="browse-more"  onclick="location.href='./ui/browse.html'">Browse more blog</button>
        </div>`;
        blogDisplay.innerHTML = dataPlacer;
    }).catch(function (err) {
        console.warn('Something went wrong.', err);
    });
})

