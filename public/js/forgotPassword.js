const url = "http://18.237.245.17:3000";

const email=document.querySelector('#email');
const form=document.querySelector('.forgotPwdForm');


form.addEventListener('submit',(e)=>{
    e.preventDefault();
    axios.post(`${url}/password/forgotpassword`,{email:email.value})
    .then(res=>{
        const message=document.querySelector('#submitMessage');
        const span=document.createElement('span');
        span.innerText='Link to reset your password has been sent to your mail';
        span.classList.toggle('active');
        message.appendChild(span);
        setTimeout(()=>span.remove(),3000);

    })
    .catch(error=>{
        const message=document.querySelector('#submitMessage');
        const span=document.createElement('span');
        span.innerText='There was some error sending the request please try again later';
        message.appendChild(span);
        setTimeout(()=>span.remove(),3000);
        console.log(error)
    });

})
