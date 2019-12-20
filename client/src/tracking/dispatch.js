import Cookies from 'js-cookie';

import API from '../utils/API';

// checks dataLayer[] to be available and pushes data to it
const pushtoDataLayer = data => {
  (window.dataLayer = window.dataLayer || []).push(data);
};
// dispatch() will decide whether to push directly into the DL
// or enhance with API-provided data first
export const dispatch = data => {
  data.cookie=Cookies.get("_ga");
  console.log('dispatching : ', data);
  API.log_event(data).then(function(data_res){
    pushtoDataLayer(data);
  },function(error){
    console.log(error);
    return;
  })
};