import API from '../../utils/API';
import Moment from 'moment';

Moment.locale('fr');

const cluster_dates = (traffic, date_low, date_high) => {
  return traffic.filter(l => {
    return (new Date(l.created_at)).getTime() > date_low.getTime() && (new Date(l.created_at)).getTime()<=date_high.getTime();
  });
}

const get_filtered_events = (query, sort, numElements) => {
  return new Promise((resolve, reject) => {
    API.get_event(query, sort).then((data) => {
      let traffic=data.data.data;
      if(traffic.length>0){
        let date_min=new Date(traffic[0].created_at) ;
        date_min.setTime(date_min.getTime() - 1);
        let date_max=new Date(traffic[traffic.length-1].created_at);

        var date_array = [],
          traffic_data = [],
          dummy_date=null;
        for (var i = 0; i <= numElements; i++) {
          var intermDate = new Date(date_min.getTime() + i * (date_max.getTime() - date_min.getTime()) / numElements );
          date_array.push( Moment(intermDate).format('DD/MM à HH:mm') );

          if(i>0){
            let trafficInWindow = cluster_dates(traffic, dummy_date, intermDate)
            traffic_data.push(trafficInWindow.length);
          }
          dummy_date=intermDate;
        }
        
        resolve({
          traffic_data: traffic_data,
          date_array : date_array,
          max_traffic: Math.max(...traffic_data)
        })
      }
    }, (error) => {
      reject('Erreur')
    })
  })
}

export {get_filtered_events};