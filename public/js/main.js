const mode=document.querySelector('#mode');

mode.addEventListener('click',()=>{
    document.body.classList.toggle('active');
    if(localStorage.getItem('mode'))
    {
        localStorage.removeItem('mode');
    }
    else
        localStorage.setItem('mode',0);
})