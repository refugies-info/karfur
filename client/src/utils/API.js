import axios from 'axios';
import openSocket from 'socket.io-client';

import setAuthToken from './setAuthToken'

const  socket = openSocket('http://localhost:8001');
socket.emit('subscribeToChat');
export { socket };

const headers = {
  'Content-Type': 'application/json',
  'x-access-token' : localStorage.getItem("token")
}
const burl = "http://localhost:8000"

export default {
    login : (user) => {
      return axios.post(burl + '/user/login',user,
      {
        headers: headers
      })
    },
    signup : (send) => {
      return axios.post(burl + '/user/signup', send,{headers: headers})
    },
    set_user_info : (user) => {
      return axios.post(burl + '/user/set_user_info', user,{headers: headers})
    },
    get_users : (query, sort) => {
      return axios.post(burl + '/user/get_users',  {query: query, sort: sort}, {headers: headers})
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
    get_article : (query, locale) => {
      return axios.post(burl + '/article/get_article', {query: query, locale: locale}, {headers: headers})
    },
    add_traduction : query => {
      return axios.post(burl + '/article/add_traduction', query, {headers: headers})
    },
    get_traduction : (query, sort, populate) => {
      return axios.post(burl + '/article/get_traduction',  {query: query, sort: sort, populate: populate}, {headers: headers})
    },

    create_langue : query => {
      return axios.post(burl + '/langues/create_langues', query, {headers: headers})
    },
    get_langues : (query, sort, populate) => {
      return axios.post(burl + '/langues/get_langues',  {query: query, sort: sort, populate: populate}, {headers: headers})
    },
    
    create_theme : query => {
      return axios.post(burl + '/themes/create_theme', query, {headers: headers})
    },
    get_themes : (query, sort, populate) => {
      return axios.post(burl + '/themes/get_themes',  {query: query, sort: sort, populate: populate}, {headers: headers})
    },

    get_roles : (query, sort) => {
      return axios.post(burl + '/roles/get_role',  {query: query, sort: sort}, {headers: headers})
    },

    set_image : query => {
      return axios.post(burl + '/images/set_image', query, {headers: headers})
    },
    get_image : (query, sort) => {
      return axios.post(burl + '/images/get_image',  {query: query, sort: sort}, {headers: headers})
    },

    isAuth : () => {
      return (localStorage.getItem('token') !== null);
    },
    logout : () => {
      setAuthToken(false);
      localStorage.removeItem("token");
    }
}