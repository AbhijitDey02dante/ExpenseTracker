const url = "http://34.208.105.135:3000";

const form = document.querySelector('.signupForm');
const password=document.querySelector('#password');


form.addEventListener('submit',(e)=>{
    e.preventDefault();
    const uuid=window.location.href.substring(window.location.href.lastIndexOf('=')+1);
    axios.post(`${url}/password/updatepassword`,{uuid:uuid,password:password.value})
    .then(()=>{
        password.value='';
        const heading=document.querySelector('#heading');
        heading.innerText='Password updated successfully';
        const message=document.querySelector('#submitMessage');
        message.innerText='Redirecting to login page';

        const destroyForm=document.querySelectorAll('.formDetail');
        destroyForm.forEach(element=>{
            element.remove();
            window.location.href=`${url}/login.html`;
        })
    })
    .catch(error=>console.log(error));
})