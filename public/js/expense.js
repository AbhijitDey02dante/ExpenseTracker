const url = "http://18.237.245.17:3000";

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

const rowPerPage = document.querySelector('#rowPerPage');


// Authenticate if logged in 
const token=localStorage.getItem('token');
configToken = {
    headers: {
       Authorization: "Bearer " + token
    }
 }
axios.get(`${url}/authenticate`,configToken)
.then(result=>{
    welcomeMessage.innerText="Welcome, "+result.data[0].name+"!!!";
    axios.get(`${url}/getOrder`,configToken)
    .then((result)=>{
        if(result.data.length>0){
            mode.style.display='inline';
            document.querySelector('#records').style.display='inline';

            const sortReport= document.querySelector('#sortReport');
            // const button1=document.createElement('button');
            // button1.innerText='Default';
            // button1.classList.add('active');
            // sortReport.appendChild(button1);
            // const button2=document.createElement('button');
            // button2.innerText='Daily(Within 24hrs)';
            // sortReport.appendChild(button2);
            // const button3=document.createElement('button');
            // button3.innerText='Monthly';
            // sortReport.appendChild(button3);
            // const button4=document.createElement('button');
            // button4.innerText='Yearly';
            // sortReport.appendChild(button4);

            //Display mode
           if(localStorage.getItem('mode')!=0)
           {
               console.log('dark');
               document.body.classList.toggle('active');
           }

           const download=document.querySelector('#download');
           const downBtn=document.createElement('button');
           // downBtn.classList.add('btn');
           downBtn.innerHTML='<img src="image/icons8.gif">';
           download.appendChild(downBtn);
           
           //Download button.............................................
           const downloadButton=document.querySelector('#download button');

           downloadButton.addEventListener('click',()=>{
               axios.get(`${url}/download`,configToken)
               .then((result)=>{
                   window.open(result.data.response.Location,"_blank");
                   return axios.post(`${url}/download_record`,result.data.response,configToken)
               })
               .then(()=>console.log("downloaded file"))
               .catch(error=>{console.log(error)});
           })
        }
    })
    .catch(()=>console.log("not a premium member"));
})
.catch((error)=>{
    window.location='login.html'
});
// ************************************************************

//display after loading the DOM
if(!(localStorage.getItem('pageItem'))){
    localStorage.setItem('pageItem',10);
}
else{
    rowPerPage.value=(localStorage.getItem('pageItem'));
}

let page=1;
let currentPage=1;
const pageNumber=document.querySelector('#pageNumber');
//add more page number dynamically so remove old
const pageButton=document.querySelectorAll('#pageNumber span');
pageButton.forEach(btn=>btn.remove());

axios.get(`${url}/get_expense?pageItem=${localStorage.getItem('pageItem')}&page=1`,configToken)
.then((result)=>{
        let totalPages=Math.ceil(result.data[0].total / localStorage.getItem('pageItem'));
        for(let i=0;i<totalPages;i++){
            const span=document.createElement('span');
            span.id=`page${page}`
            span.innerText=page;
            page++;

            pageNumber.appendChild(span);
        }
        result.data[1].forEach(element=>{
            const tr=document.createElement('tr');
            tr.id='expense'+element.id;
            tr.classList.add('expenses');


            const td1=document.createElement('td');
            td1.innerText=element.createdAt.substring(0,element.createdAt.lastIndexOf('T'));
            const delButton=document.createElement('button');
            delButton.innerHTML=`<i class="bi bi-trash-fill"></i>`;
            delButton.classList.add('delete');
            td1.append(delButton);
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
        })
})


//button for adding data forum
const space=document.querySelector('#emptySpace');
expenseButton.addEventListener('click',()=>{
    form.style.transform=`translateX(0)`;
    expenseButton.style.transform=`translateX(150%)`;
    space.classList.add('active');
})


closeAddScreen.addEventListener('click',()=>{
    form.style.transform=`translateX(100%)`;
    expenseButton.style.transform=`translateX(0)`;
    space.classList.remove('active');
})
// *************************************************************

addExpenseForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    const obj={
        category:category.value,
        amount:amount.value,
        description:description.value
    }
    axios.post(`${url}/add_expense`,obj,configToken)
    .then((data)=>{
        const result=data;
        axios.post(`${url}/update_user_amount`,{amount:amount.value},configToken)
        .then(()=>{
            // Test**********************************************************************
            //add more page number dynamically so remove
            const pageButton=document.querySelectorAll('#pageNumber span');
            pageButton.forEach(btn=>btn.remove());

            axios.get(`${url}/get_expense?pageItem=${localStorage.getItem('pageItem')}&page=1`,configToken)
            .then((result)=>{
                    let totalPages=Math.ceil(result.data[0].total / localStorage.getItem('pageItem'));
                    page=1;
                    for(let i=0;i<totalPages;i++){
                        const span=document.createElement('span');
                        span.id=`page${page}`
                        span.innerText=page;
                        page++;
            
                        pageNumber.appendChild(span);
                    }
                    currentPage=totalPages;
                    return axios.get(`${url}/get_expense?pageItem=${localStorage.getItem('pageItem')}&page=${totalPages}`,configToken)
            })
            .then(result=>{
                // remove old data
                const expenseRow=document.querySelectorAll('.expenses');
                expenseRow.forEach(element=>element.remove());
    
                // add new data
                result.data[1].forEach(element=>{
                    const tr=document.createElement('tr');
                    tr.id='expense'+element.id;
                    tr.classList.add('expenses');
        
        
                    const td1=document.createElement('td');
                    td1.innerText=element.createdAt.substring(0,element.createdAt.lastIndexOf('T'));
                    const delButton=document.createElement('button');
                    delButton.innerHTML=`<i class="bi bi-trash-fill"></i>`;
                    delButton.classList.add('delete');
                    td1.append(delButton);
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

                })
            })
            .catch(error=>console.log(error));
            // TEST END******************************************************************
        
            // const tr=document.createElement('tr');
            // tr.id='expense'+result.data.id;
            // tr.classList.add('expenses');
    
            // const td1=document.createElement('td');
            // const today=new Date();
            // td1.innerText=today.getFullYear()+"-"+today.getMonth()+"-"+today.getDate();
            // const delButton=document.createElement('button');
            // delButton.innerHTML=`<i class="bi bi-trash-fill"></i>`;
            // delButton.classList.add('delete');
            // td1.append(delButton);
            // tr.appendChild(td1);
    
            // const td2=document.createElement('td');
            // td2.innerText=category.value;
            // tr.appendChild(td2);
    
            // const td3=document.createElement('td');
            // td3.innerText='"'+description.value+'"';
            // tr.appendChild(td3);
    
            // const td4=document.createElement('td');
            // td4.innerText="Rs. "+amount.value;
            // tr.appendChild(td4);
    
            // table.appendChild(tr);
    
            // amount.value='';
            // description.value='';    
        })
        .catch(error=>console.log(error));
    })
    .catch(e=>console.log(e));
})

// delete
table.addEventListener('click',(e)=>{
    if(e.target.tagName=='I')
    {
        const id=e.target.parentElement.parentElement.parentElement.id;
        const expenseId=id.replace('expense','');
        axios.post(`${url}/delete_expense`,{id:expenseId},configToken)
        .then(output=>{
            // test*********************************************
            //add more page number dynamically so remove old
            const pageButton=document.querySelectorAll('#pageNumber span');
            pageButton.forEach(btn=>btn.remove());
            // remove old data
            // const expenseRow=document.querySelectorAll('.expenses');
            // expenseRow.forEach(element=>element.remove());

            const expense=document.getElementById('id');
            expense.remove();

            axios.get(`${url}/get_expense?pageItem=${localStorage.getItem('pageItem')}&page=${currentPage}`,configToken)
            .then((result)=>{
                    let totalPages=Math.ceil(result.data[0].total / localStorage.getItem('pageItem'));
                    page=1;
                    for(let i=0;i<totalPages;i++){
                        const span=document.createElement('span');
                        span.id=`page${page}`
                        span.innerText=page;
                        page++;

                        pageNumber.appendChild(span);
                    }
            //         result.data[1].forEach(element=>{
            //             const tr=document.createElement('tr');
            //             tr.id='expense'+element.id;
            //             tr.classList.add('expenses');


            //             const td1=document.createElement('td');
            //             td1.innerText=element.createdAt.substring(0,element.createdAt.lastIndexOf('T'));
            //             const delButton=document.createElement('button');
            //             delButton.innerHTML=`<i class="bi bi-trash-fill"></i>`;
            //             delButton.classList.add('delete');
            //             td1.append(delButton);
            //             tr.appendChild(td1);
                
            //             const td2=document.createElement('td');
            //             td2.innerText=element.category;
            //             tr.appendChild(td2);
                
            //             const td3=document.createElement('td');
            //             td3.innerText='"'+element.description+'"';
            //             tr.appendChild(td3);
                
            //             const td4=document.createElement('td');
            //             td4.innerText="Rs. "+element.amount;
            //             tr.appendChild(td4);
                
            //             table.appendChild(tr);
            //         })
            })
            // TEST END*****************************************
        })
        .catch(error=>console.log(error))
    }
})

// Pagination********************************************
pageNumber.addEventListener('click',(e)=>{
    if(e.target.tagName=='SPAN'){
        const pageNo = e.target.id.replace('page','');
        currentPage=pageNo;
        axios.get(`${url}/get_expense?pageItem=${localStorage.getItem('pageItem')}&page=${pageNo}`,configToken)
        .then((result)=>{
            // remove old data
            const expenseRow=document.querySelectorAll('.expenses');
            expenseRow.forEach(element=>element.remove());

            // add new data
            result.data[1].forEach(element=>{
                const tr=document.createElement('tr');
                tr.id='expense'+element.id;
                tr.classList.add('expenses');
    
    
                const td1=document.createElement('td');
                td1.innerText=element.createdAt.substring(0,element.createdAt.lastIndexOf('T'));
                const delButton=document.createElement('button');
                delButton.innerHTML=`<i class="bi bi-trash-fill"></i>`;
                delButton.classList.add('delete');
                td1.append(delButton);
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
            })

        })
        .catch(error=>console.log(error));
    }
})

//set Items per page
rowPerPage.addEventListener('change',()=>{
    localStorage.setItem('pageItem',rowPerPage.value);
    //add more page number dynamically so remove old
    const pageButton=document.querySelectorAll('#pageNumber span');
    pageButton.forEach(btn=>btn.remove());
    // remove old data
    const expenseRow=document.querySelectorAll('.expenses');
    expenseRow.forEach(element=>element.remove());


    axios.get(`${url}/get_expense?pageItem=${localStorage.getItem('pageItem')}&page=1`,configToken)
    .then((result)=>{
            let totalPages=Math.ceil(result.data[0].total / localStorage.getItem('pageItem'));
            page=1;
            for(let i=0;i<totalPages;i++){
                const span=document.createElement('span');
                span.id=`page${page}`
                span.innerText=page;
                page++;

                pageNumber.appendChild(span);
            }
            result.data[1].forEach(element=>{
                const tr=document.createElement('tr');
                tr.id='expense'+element.id;
                tr.classList.add('expenses');


                const td1=document.createElement('td');
                td1.innerText=element.createdAt.substring(0,element.createdAt.lastIndexOf('T'));
                const delButton=document.createElement('button');
                delButton.innerHTML=`<i class="bi bi-trash-fill"></i>`;
                delButton.classList.add('delete');
                td1.append(delButton);
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
            })
    })
    .catch(error=>console.log(error))
})