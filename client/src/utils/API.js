import axios from 'axios';
const headers = {
    'Content-Type': 'application/json'
}
const burl = "http://localhost:8000"

export default {
    login : function(email,password) {
      return axios.post(burl + '/user/login',{
        'email' : email,
        'password' : password
      },{
        headers: headers
      })
    },
    signup : function(send){
      return axios.post(burl + '/user/signup',send,{headers: headers})
    },
    
    isAuth : function() {
      return (localStorage.getItem('token') !== null);
    },
    logout : function() {
      localStorage.clear();
    }
}