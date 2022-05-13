const url = "http://34.208.105.135:3000";

const expenseButton=document.querySelector('#expenseButton');

const welcomeMessage=document.querySelector('.expenseContainer h2');



// Authenticate if logged in 
const token=localStorage.getItem('token');
configToken = {
    headers: {
       Authorization: "Bearer " + token
    }
 }

axios.get(`${url}/authenticate`,configToken)
.then(result=>{
    axios.get(`${url}/getOrder`,configToken)
    .then((result)=>{
        if(result.data.length>0){
            mode.style.display='inline';
            document.querySelector('#records').style.display='inline';

            //Display mode
           if(localStorage.getItem('mode')!=0)
           {
               console.log('dark');
               document.body.classList.toggle('active');
           }
        }
        else{
            window.location='expense.html';
        }
    })
    .catch(()=>console.log("not a premium member"));
})
.catch((error)=>{
    window.location='login.html'
});
// ************************************************************

//display after loading the DOM
const table=document.querySelector('.tableOfRecord');
document.addEventListener('DOMContentLoaded',()=>{
    axios.get(`${url}/get_record`,configToken)
    .then(result=>{
        result.data.forEach(record=>{
            const div=document.createElement('div');

            const span1=document.createElement('span');
            span1.innerText=record.date.toString().substring(0,record.date.toString().lastIndexOf('T'));
            div.appendChild(span1);

            
            const span2=document.createElement('span');
            span2.innerText=record.name;
            div.appendChild(span2);
            

            const span3=document.createElement('span');
            const a=document.createElement('a');
            a.innerHTML='<i class="bi bi-file-earmark-arrow-down-fill"></i>';
            a.href=record.url;
            span3.appendChild(a);
            div.appendChild(span3);

            table.appendChild(div);
        })
    })
    .catch()
})