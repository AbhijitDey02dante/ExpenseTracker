const url = "http://18.237.245.17:3000";

const email=document.querySelector('#email');
const form=document.querySelector('.forgotPwdForm');


form.addEventListener('submit',(e)=>{
    e.preventDefault();
    const span =document.querySelector('#submitMessage span');
    axios.post(`${url}/password/forgotpassword`,{email:email.value})
    .then(res=>{
        span.innerText='Sent link to reset password';
        span.classList.add('active');
        setTimeout(()=>{
            span.innerText='';
            span.classList.remove('active');
        },3000);

    })
    .catch(error=>{
        span.innerText='Error incorrect mail ID';
        span.classList.add('errorMessage');
        setTimeout(()=>{
            span.innerText='';
            span.classList.remove('errorMessage');
        },3000);
        console.log(error)
    });

})
