const email=document.querySelector('#email');

axios.post("http://localhost:3000/password/forgotpassword",{email:email})
.then(res=>{
    console.log(res);
})
.catch(error=>console.log(error));