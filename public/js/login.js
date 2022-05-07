const email=document.querySelector('#email');
const password=document.querySelector('#password');

const form=document.querySelector('.signupForm');

form.addEventListener('submit',(e)=>{
    e.preventDefault();
    const obj={
        email:email.value,
        password:password.value
    }
    // console.log(obj);

    axios.post("http://localhost:3000/login",obj)
    .then((res)=>{
        console.log(res)
    })
    .catch(error=>console.log(error));
})