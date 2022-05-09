const buyButton=document.querySelector('#payButton');
const header2=document.querySelector('.container h2');
const header3=document.querySelector('.container p');


const token=localStorage.getItem('token');
configToken = {
    headers: {
       Authorization: "Bearer " + token
    }
 }
 axios.get("http://localhost:3000/authenticate",configToken)
 .then(()=>{
     axios.get('http://localhost:3000/getOrder',configToken)
     .then((result)=>{
         if(result.data.length>0){
            mode.style.display='inline';
            buyButton.remove();
            header2.innerText='You are already a Prime Member';
            header3.innerText='Enjoy the different modes from navigation menu';
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


//  ****************************************************************

buyButton.addEventListener('click',(e)=>{
    axios.post("http://localhost:3000/buy_premium",{amount:100},configToken)
    .then(res=>{
        let options = {
            "key": "rzp_test_UPoGzuJVY1Mszz", // Enter the Key ID generated from the Dashboard
            "amount": "100", // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
            "currency": "INR",
            "name": "Premium Membership of Expense Tracker",
            "description": "Test Transaction",
            "order_id": res.data.orderId, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
            "handler": function (response){
                // alert(response.razorpay_payment_id);
                // alert(response.razorpay_order_id);
                // alert(response.razorpay_signature)
                axios.post("http://localhost:3000/payment/verify",{response})
                .then(result=>{
                    console.log("entered");
                    axios.post("http://localhost:3000/add_order",{orderid:response.razorpay_order_id},configToken)
                    .then(()=>{
                        mode.style.display='inline';
                        buyButton.remove();
                        header2.innerText='You are already a Prime Member';
                        header3.innerText='Enjoy the different modes from navigation menu';
                        localStorage.setItem('mode',0);
                    })
                    .catch(error=>console.log(error));
                })
                .catch(error=>console.log(error));
            },
            "theme": {
                "color": "#3399cc"
            }
        };
        let rzp1 = new Razorpay(options);
        rzp1.on('payment.failed', function (response){
            // alert(response.error.code);
            // alert(response.error.description);
            // alert(response.error.source);
            // alert(response.error.step);
            // alert(response.error.reason);
            // alert(response.error.metadata.order_id);
            // alert(response.error.metadata.payment_id);
        });
        rzp1.open();
        e.preventDefault();

    })
    .catch(error=>console.log(error));
})