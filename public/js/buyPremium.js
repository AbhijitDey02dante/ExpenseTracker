const buyButton=document.querySelector('#payButton');
const header2=document.querySelector('.container h2');
const header3=document.querySelector('.container p');
const leaderboard=document.querySelector('#leaderboards');


const token=localStorage.getItem('token');
configToken = {
    headers: {
       Authorization: "Bearer " + token
    }
 }
 axios.get("http://localhost:3000/authenticate",configToken)
 .then((output)=>{
    if(output.data[0].spent){
        const leaderboardContainer=document.querySelector('#leaderboards');
        leaderboardContainer.style.display='block';
        mode.style.display='inline';
    }
     axios.get('http://localhost:3000/getLeaderboard',configToken)
     .then(result=>{
         console.log(result.data);
        if(result.data.length>0){
            if(localStorage.getItem('mode')!=0)
            {
                 console.log('dark');
                document.body.classList.toggle('active');
            }
            result.data.forEach(element=>{
                const p=document.createElement('p');
                p.innerText=element.name+" spent Rs. "+element.spent;
                console.log(element.spent);
    
                leaderboard.append(p);
            })
        }
     })
     .catch(error=>console.log(error));
 })
 .catch((error)=>{
     window.location='login.html'
 });


//  ****************************************************************
let amount=1;
buyButton.addEventListener('click',(e)=>{
    axios.post("http://localhost:3000/buy_premium",{amount:amount*100},configToken)
    .then(res=>{
        let options = {
            "key": "rzp_test_UPoGzuJVY1Mszz", // Enter the Key ID generated from the Dashboard
            "amount": amount*100, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
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
                    //adding Order id
                    axios.post("http://localhost:3000/add_order",{orderid:response.razorpay_order_id},configToken)
                    .then(()=>{
                        // mode.style.display='inline';
                        // header2.innerText='You are already a Prime Member';
                        // header3.innerText='Enjoy the different modes from navigation menu and you can support us more via the pay button';
                        // localStorage.setItem('mode',0);
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
            header2.innerText='Something went wrong';
            header3.innerText='Please try again';
        });
        rzp1.open();
        e.preventDefault();

    })
    .catch(error=>console.log(error));
})