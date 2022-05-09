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

    axios.post("http://localhost:3000/login",obj)
    .then((res)=>{
        localStorage.setItem('token',res.data);
        window.location='expense.html';
    })
    .catch(error=>console.log(error));
})