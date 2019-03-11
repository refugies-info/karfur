import axios from 'axios';
import openSocket from 'socket.io-client';

const  socket = openSocket('http://localhost:8001');
socket.emit('subscribeToChat');
export { socket };

const headers = {
    'Content-Type': 'application/json'
}
const burl = "http://localhost:8000"

export default {
    login : (email,password) => {
      return axios.post(burl + '/user/login',{
        'email' : email,
        'password' : password
      },{
        headers: headers
      })
    },
    signup : (send) => {
      return axios.post(burl + '/user/signup', send,{headers: headers})
    },

    log_event : (event) => {
      return axios.post(burl + '/events/log', event, {headers: headers})
    },
    get_event : (query, sort) => {
      return axios.post(burl + '/events/get', {query: query, sort: sort}, {headers: headers})
    },
    
    add_article : query => {
      return axios.post(burl + '/article/add_article', query, {headers: headers})
    },
    get_article : query => {
      return axios.post(burl + '/article/get_article', query, {headers: headers})
    },

    isAuth : () => {
      return (localStorage.getItem('token') !== null);
    },
    logout : () => {
      localStorage.clear();
    }
}