console.log(userInfo);

$.ajax({
    url:'http://capstonetyu.herokuapp.com/api/v1/comments?limit=30&q=61e66297ce945bbaff5682d9',
    method:'GET',
    success:(data)=>{
        console.log(data);
    } 

});