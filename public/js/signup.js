const url = "http://34.208.105.135:3000";

const nameId=document.querySelector('#name');
const email=document.querySelector('#email');
const mobile=document.querySelector('#mobile');
const password=document.querySelector('#password');
const cPassword=document.querySelector('#cPassword');
const confirmPasswordText = document.querySelector('#confirmPasswordText');
const  submitButton= document.querySelector('#submitButton');

const form=document.querySelector('.signupForm');

form.addEventListener('submit',(e)=>{
    e.preventDefault();
    const obj={
        name:nameId.value,
        email:email.value,
        mobile:mobile.value,
        password:password.value
    }
    axios.post(`${url}/signup`,obj)
    .then((result)=>{
        const span=document.querySelector('#submitMessage span');
        if(result.data.success){
            span.classList.add('active');
            span.innerText='Successfuly signed up';
            
            nameId.value='';
            email.value='';
            mobile.value='';
            password.value='';
            cPassword.value='';
            setTimeout(()=>{
                span.classList.remove('active');
                span.innerText='';
                window.location.href=`${url}/login.html`;
            },3000);
        }
        else{
            span.innerText='Incorrect Username or Password';
            span.classList.add('errorMessage');
            setTimeout(()=>{
                span.classList.remove('errorMessage');
                span.innerText='';
            },3000);
        }
    })
    .catch(error=>console.log(error))
})

// JAVSCRIPT CONFIRM PASSWORD VALIDATION
cPassword.addEventListener('keyup',()=>{
    if(password.value.length>0 && cPassword.value===password.value){
        confirmPasswordText.classList.add('active');
        confirmPasswordText.innerText='Password matched';
        submitButton.disabled=false;
    }
    else
    {
        confirmPasswordText.classList.remove('active');
        confirmPasswordText.innerText='Password not matched';
        submitButton.disabled=true;
    }
})

password.addEventListener('keyup',()=>{
    if(cPassword.value.length>1 && cPassword.value===password.value){
        confirmPasswordText.classList.add('active');
        confirmPasswordText.innerText='Password matched';
        submitButton.disabled=false;
    }
    else if(cPassword.value.length==0)
    {
        confirmPasswordText.innerText='';
        submitButton.disabled=true;
    }
    else{
        confirmPasswordText.classList.remove('active');
        confirmPasswordText.innerText='Password not matched';
        submitButton.disabled=true;
    }
})
// *************************************************************************

