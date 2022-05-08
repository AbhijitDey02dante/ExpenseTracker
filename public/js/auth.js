const token=localStorage.getItem('token');
config = {
    headers: {
       Authorization: "Bearer " + token
    }
 }
axios.get("http://localhost:3000/expense",config)
.then()
.catch((error)=>{
    window.location='login.html'
});