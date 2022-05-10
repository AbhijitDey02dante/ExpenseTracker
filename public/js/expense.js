const expenseButton=document.querySelector('#expenseButton');
const closeAddScreen=document.querySelector('.closeAddScreen');
const form=document.querySelector('#formContainer');
const addExpenseForm=document.querySelector('#formContainer form');

const category=document.querySelector('#category');
const description=document.querySelector('#description');
const amount=document.querySelector('#amount');

const welcomeMessage=document.querySelector('.expenseContainer h2');

const expenseList=document.querySelector('#expenseList');
const table=document.querySelector('#expenseTable');


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

            const sortReport= document.querySelector('#sortReport');
            const button1=document.createElement('button');
            button1.innerText='Default';
            button1.classList.add('active');
            sortReport.appendChild(button1);
            const button2=document.createElement('button');
            button2.innerText='Daily(Within 24hrs)';
            sortReport.appendChild(button2);
            const button3=document.createElement('button');
            button3.innerText='Monthly';
            sortReport.appendChild(button3);
            const button4=document.createElement('button');
            button4.innerText='Yearly';
            sortReport.appendChild(button4);

            const download=document.querySelector('#download');
            const downBtn=document.createElement('button');
            // downBtn.classList.add('btn');
            downBtn.innerHTML='<img src="image/icons8.gif">';
            download.appendChild(downBtn);


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

        const tr=document.createElement('tr');
        tr.id='expense'+element.id;

        const td1=document.createElement('td');
        td1.innerText=element.createdAt.substring(0,element.createdAt.lastIndexOf('T'));
        tr.appendChild(td1);

        const td2=document.createElement('td');
        td2.innerText=element.category;
        tr.appendChild(td2);

        const td3=document.createElement('td');
        td3.innerText='"'+element.description+'"';
        tr.appendChild(td3);

        const td4=document.createElement('td');
        td4.innerText="Rs. "+element.amount;
        tr.appendChild(td4);

        table.appendChild(tr);
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
        // const li=document.createElement('li');
        // li.id='expense'+result.data.id;

        // const span1=document.createElement('span');
        // span1.innerText=category.value;
        // li.appendChild(span1);

        // const span2=document.createElement('span');
        // span2.innerText='"'+description.value+'"';
        // li.appendChild(span2);

        // const span3=document.createElement('span');
        // span3.innerText="Rs. "+amount.value;
        // li.appendChild(span3);

        // expenseList.appendChild(li);

        
        const tr=document.createElement('tr');
        tr.id='expense'+result.data.id;

        const td1=document.createElement('td');
        const today=new Date();
        td1.innerText=today.getFullYear()+"-"+today.getMonth()+"-"+today.getDate();
        tr.appendChild(td1);

        const td2=document.createElement('td');
        td2.innerText=category.value;
        tr.appendChild(td2);

        const td3=document.createElement('td');
        td3.innerText='"'+description.value+'"';
        tr.appendChild(td3);

        const td4=document.createElement('td');
        td4.innerText="Rs. "+amount.value;
        tr.appendChild(td4);

        table.appendChild(tr);
        
        axios.post("http://localhost:3000/update_user_amount",{amount:amount.value},configToken)
        .then()
        .catch(error=>console.log(error));
    })
    .catch(e=>console.log(e));
})