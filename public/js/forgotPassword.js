const email=document.querySelector('#email');
const form=document.querySelector('.forgotPwdForm');


form.addEventListener('submit',(e)=>{
    e.preventDefault();
    axios.post("http://localhost:3000/password/forgotpassword",{email:email.value})
    .then(res=>{
        console.log(res);
    })
    .catch(error=>console.log(error));

})
