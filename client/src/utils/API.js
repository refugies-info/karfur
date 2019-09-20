import axios from 'axios';
// import openSocket from 'socket.io-client';

import setAuthToken from './setAuthToken'
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';

const  socket = null;
// const  socket = openSocket('http://localhost:8001');
// socket.emit('subscribeToChat');
export { socket };

const headers = {
  'Content-Type': 'application/json',
  'x-access-token' : localStorage.getItem("token") || undefined,
  'cookie-id' : Cookies.get("_ga")
}
const burl = ""

axios.withCredentials = true;

axios.interceptors.request.use(request => {
  return request;
}, error => {
  Swal.fire({
    type: 'error',
    title: 'Oops...',
    text: ((error.response.data || {}).text || ''),
    footer: '<i>'+ error.message + '</i>', 
    timer: 1500
  })
  console.log(error.response.data, error.response.status, error.message)
  return Promise.reject(error)
})

axios.interceptors.response.use(response => {
  // console.log(response)
  return response;
}, error => {
  if(error.response && error.response.status < 500){
    Swal.fire({
      type: 'error',
      title: 'Oops...',
      text: ((error.response.data || {}).text || ''),
      footer: '<i>'+ error.message + '</i>',
      timer: 1500
    })
  }else{ console.log((error.response || {}).data, (error.response || {}).status, error.message) }
  return Promise.reject(error)
})

export default {
  login : (user) => {
    return axios.post(burl + '/user/login',user, { headers: headers })
  },
  signup : (send) => {
    return axios.post(burl + '/user/signup', send,{headers: headers})
  },
  checkUserExists : (send) => {
    return axios.post(burl + '/user/checkUserExists', send,{headers: headers})
  },
  set_user_info : (user) => {
    return axios.post(burl + '/user/set_user_info', user,{headers: headers})
  },
  get_users : (query, sort) => {
    return axios.post(burl + '/user/get_users',  {query: query, sort: sort}, {headers: headers})
  },
  get_user_info : (query) => {
    return axios.post(burl + '/user/get_user_info',  query, {headers: headers})
  },
  FClogout : () => {
    return axios.post(burl + '/user/FClogout',{}, { headers: headers })
  },

  log_event : (event) => {
    return axios.post(burl + '/events/log_event', event, {headers: headers})
  },
  get_event : (query, sort) => {
    return axios.post(burl + '/events/get_event', {query: query, sort: sort}, {headers: headers})
  },
  distinct_event : (distinct) => {
    return axios.post(burl + '/events/distinct_event', distinct, {headers: headers})
  },
  distinct_count_event : (query) => {
    return axios.post(burl + '/events/distinct_count_event', query, {headers: headers})
  },
  
  add_article : query => {
    return axios.post(burl + '/article/add_article', query, {headers: headers})
  },
  get_article : (query, locale, sort={}, populate='', limit=null, random=false) => {
    return axios.post(burl + '/article/get_article', {query: query, locale: locale, sort: sort, populate: populate, limit: limit, random: random}, {headers: headers})
  },
  getArticle : (params={}) => { //{query, locale, sort, populate, limit, random}
    return axios.post(burl + '/article/get_article', params, {headers: headers})
  },
  add_traduction : query => {
    return axios.post(burl + '/article/add_traduction', query, {headers: headers})
  },
  get_traduction : (query, sort, populate) => {
    return axios.post(burl + '/article/get_traduction',  {query: query, sort: sort, populate: populate}, {headers: headers})
  },
  remove_traduction : query => {
    return axios.post(burl + '/article/remove_traduction', query, {headers: headers})
  },

  add_dispositif : query => {
    return axios.post(burl + '/dispositifs/add_dispositif', query, {headers: headers})
  },
  get_dispositif : (query={}, sort={}, populate='', limit=null) => {
    return axios.post(burl + '/dispositifs/get_dispositif', {query: query, sort: sort, populate: populate, limit: limit}, {headers: headers})
  },
  count_dispositifs : (query) => {
    return axios.post(burl + '/dispositifs/count_dispositifs', query, {headers: headers})
  },
  update_dispositif : query => {
    return axios.post(burl + '/dispositifs/update_dispositif', query, {headers: headers})
  },
  get_dispo_progression : query => {
    return axios.post(burl + '/dispositifs/get_dispo_progression', query, {headers: headers})
  },

  create_structure : query => {
    return axios.post(burl + '/structures/add_structure', query, {headers: headers})
  },
  get_structure : (query={}, sort={}, populate='', limit=null) => {
    return axios.post(burl + '/structures/get_structure', {query: query, sort: sort, populate: populate, limit: limit}, {headers: headers})
  },

  add_tradForReview : query => {
    return axios.post(burl + '/traduction/add_tradForReview', query, {headers: headers})
  },
  get_tradForReview : (query, sort, populate) => {
    return axios.post(burl + '/traduction/get_tradForReview',  {query: query, sort: sort, populate: populate}, {headers: headers})
  },
  validate_tradForReview : query => {
    return axios.post(burl + '/traduction/validate_tradForReview', query, {headers: headers})
  },
  get_progression : query => {
    return axios.post(burl + '/traduction/get_progression', query, {headers: headers})
  },
  get_xlm : query => {
    return axios.post(burl + '/traduction/get_xlm', query, {headers: headers})
  },
  get_laser : query => {
    return axios.post(burl + '/traduction/get_laser', query, {headers: headers})
  },
  update_tradForReview : query => {
    return axios.post(burl + '/traduction/update_tradForReview',  query, {headers: headers})
  },

  get_translation : (query = {}) => {
    return axios.post(burl + '/translate/get_translation',  query, {headers: headers})
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

  add_channel : query => {
    return axios.post(burl + '/channels/add_channel', query, {headers: headers})
  },
  get_channel : (query, sort, populate) => {
    return axios.post(burl + '/channels/get_channel',  {query: query, sort: sort, populate: populate}, {headers: headers})
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

  set_mail : query => {
    return axios.post(burl + '/miscellaneous/set_mail', query, {headers: headers})
  },

  get_tts : (query) => {
    return axios.post(burl + '/tts/get_tts',  query, {headers: headers})
  },

  set_audio : (query) => {
    return axios.post(burl + '/audio/set_audio',  query, {headers: headers})
  },
  get_audio : (query) => {
    return axios.post(burl + '/audio/get_audio',  query, {headers: headers})
  },

  isAuth : () => {
    return (localStorage.getItem('token') !== null);
  },
  logout : () => {
    setAuthToken(false);
    localStorage.removeItem("token");
    delete headers['x-access-token'];
  }
}