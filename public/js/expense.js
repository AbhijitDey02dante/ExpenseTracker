const expenseButton=document.querySelector('#expenseButton');
const closeAddScreen=document.querySelector('.closeAddScreen');
const form=document.querySelector('#formContainer');
const addExpenseForm=document.querySelector('#formContainer form');

const category=document.querySelector('#category');
const description=document.querySelector('#description');
const amount=document.querySelector('#amount');

const welcomeMessage=document.querySelector('.expenseContainer h2');

const expenseList=document.querySelector('#expenseList');


// Authenticate if logged in 
const token=localStorage.getItem('token');
configToken = {
    headers: {
       Authorization: "Bearer " + token
    }
 }
axios.get("http://localhost:3000/authenticate",configToken)
.then(result=>{
    welcomeMessage.innerText="Welcome, "+result.data[0].name+"!!!";
    axios.get('http://localhost:3000/getOrder',configToken)
    .then((result)=>{
        if(result.data.length>0){
            mode.style.display='inline';
           if(localStorage.getItem('mode')!=0)
           {
               console.log('dark');
               document.body.classList.toggle('active');
           }
        }
    })
    .catch(()=>console.log("not a premium member"));
})
.catch((error)=>{
    window.location='login.html'
});
// ************************************************************

//display after loading the DOM
axios.get("http://localhost:3000/get_expense",configToken)
.then((result)=>{
    result.data.forEach(element => {
        const li=document.createElement('li');
        li.id='expense'+element.id;

        const span1=document.createElement('span');
        span1.innerText=element.category;
        li.appendChild(span1);

        const span2=document.createElement('span');
        span2.innerText='"'+element.description+'"';
        li.appendChild(span2);

        const span3=document.createElement('span');
        span3.innerText="Rs. "+element.amount;
        li.appendChild(span3);

        expenseList.appendChild(li);
    });
})


//button for adding data forum 
expenseButton.addEventListener('click',()=>{
    form.style.transform=`translateX(0)`;
    expenseButton.style.transform=`translateX(150%)`;
})


closeAddScreen.addEventListener('click',()=>{
    form.style.transform=`translateX(100%)`;
    expenseButton.style.transform=`translateX(0)`;
})
// *************************************************************

addExpenseForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    const obj={
        category:category.value,
        amount:amount.value,
        description:description.value
    }
    axios.post('http://localhost:3000/add_expense',obj,configToken)
    .then((result)=>{       
        const li=document.createElement('li');
        li.id='expense'+result.data.id;

        const span1=document.createElement('span');
        span1.innerText=category.value;
        li.appendChild(span1);

        const span2=document.createElement('span');
        span2.innerText='"'+description.value+'"';
        li.appendChild(span2);

        const span3=document.createElement('span');
        span3.innerText="Rs. "+amount.value;
        li.appendChild(span3);

        expenseList.appendChild(li);
    })
    .catch(e=>console.log(e));
})