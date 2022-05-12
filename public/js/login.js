const url = "http://18.237.245.17:3000";

const email=document.querySelector('#email');
const password=document.querySelector('#password');

const form=document.querySelector('.signupForm');

localStorage.removeItem('token');


form.addEventListener('submit',(e)=>{
    e.preventDefault();
    const obj={
        email:email.value,
        password:password.value
    }
    // console.log(obj);

    axios.post(`${url}/login`,obj)
    .then((res)=>{
        localStorage.setItem('token',res.data);
        window.location='expense.html';
    })
    .catch(error=>{
        const span=document.querySelector('#submitMessage span');

        span.innerText='Incorrect Username or Password';
        span.classList.add('errorMessage');

        console.log(error);
        setTimeout(()=>{
            span.classList.remove('errorMessage');
            span.innerText='';
        },3000);
    });
})