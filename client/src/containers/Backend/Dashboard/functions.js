import moment from 'moment/min/moment-with-locales';
import update from 'react-addons-update'; // ES6
import _ from "lodash";

import API from "../../../utils/API";
import DateOffset from '../../../components/Functions/DateOffset';

moment.locale('fr');

let minDate, maxDate;

const display_traffic = function(duree){
  const week_lag = DateOffset(new Date(), duree);
    const sort = {
      created_at: 1
    }
    const numElements = 27;

    const queries = [
      { 
        app: "App", 
        action: "mount", 
        cookie: {$exists: true}, 
        created_at : {"$gte": week_lag}, 
        value: {$exists: true} 
      },{
        page:'Dispositif',
        component: { "$exists": false }, 
        created_at : {"$gte": week_lag}
      },{
        page:'AdvancedSearch',
        component: { "$exists": false }, 
        created_at : {"$gte": week_lag}
      },{
        page:'UserProfile',
        component: { "$exists": false }, 
        created_at : {"$gte": week_lag}
      }
    ]
    this.execute_search(queries, sort, numElements);
    // let query={}

    // query={ 
    //   app: "App", 
    //   action: "mount", 
    //   cookie: {$exists: true}, 
    //   created_at : {"$gte": week_lag}, 
    //   value: {$exists: true} 
    // }
    // this.execute_search(query, sort, numElements, 1);

    // query={
    //   page:'Dispositif',
    //   component: { "$exists": false }, 
    //   created_at : {"$gte": week_lag}
    // }
    // this.execute_search(query, sort, numElements, 2);

    // query={
    //   page:'AdvancedSearch',
    //   component: { "$exists": false }, 
    //   created_at : {"$gte": week_lag}
    // }
    // this.execute_search(query, sort, numElements, 3);

    // query={
    //   page:'UserProfile',
    //   component: { "$exists": false }, 
    //   created_at : {"$gte": week_lag}
    // }
    // this.execute_search(query, sort, numElements, 4);
}

const execute_search = async function(queries, sort, numElements){
  //On récupère les données
  const data = [];
  await asyncForEach(queries, async (query) => {
    data.push((await API.get_event({query, sort})).data.data)
  });
  console.log(data)
  //On les met sur les mêmes abscisses :
  let date_min= new Date( Math.min.apply(null, data.map(arr => new Date(_.get(arr, "0.created_at", ""))  ) ) );
  date_min.setTime(date_min.getTime() - 1);
  const date_max=new Date( Math.max.apply(null, data.map(arr => new Date(_.get(arr, (arr.length - 1 ) + ".created_at", ""))  ) ) ); 
  
  let date_array = [],
    traffic_data = new Array(data.length).fill([]),
    dummy_date=null;
  for (var i = 0; i <= numElements; i++) {
    var intermDate = new Date(date_min.getTime() + i * (date_max.getTime() - date_min.getTime()) / numElements );
    date_array.push( moment(intermDate).format('DD/MM à HH:mm') );

    if(i>0){
      data.forEach((arr, j) => {
        const trafficInWindow = cluster_dates(arr, dummy_date, intermDate)
        traffic_data[j] = [...traffic_data[j], trafficInWindow.length];
        console.log(i, j, arr.length, trafficInWindow.length, traffic_data)
      })
    }
    dummy_date=intermDate;
  }

  console.log(date_min, date_max, date_array, traffic_data)

  this.setState(pS => ({
    mainChart: {
      ...pS.mainChart,
      labels: date_array,
      datasets: pS.mainChart.datasets.map((x,i) => (
        { ...x, data: traffic_data[i], label: queries[i].app || queries[i].page }
      )),
    },
    max_traffic: Math.max( traffic_data.map(arr => Math.max(arr)) ),
  }))

  //   if(this.state.max_traffic < filtered_events.max_traffic){
  //     this.setState({
  //       max_traffic : filtered_events.max_traffic,
  //       mainChartOpts:{
  //         ...this.state.mainChartOpts,
  //         scales: {
  //           ...this.state.mainChartOpts.xAxes,
  //           yAxes: [
  //             {
  //               ticks: {
  //                 beginAtZero: true,
  //                 maxTicksLimit: 5,
  //                 stepSize: Math.ceil(400 / 5),
  //                 max: filtered_events.max_traffic,
  //               },
  //             }],
  //         }
  //       }
  //     });
  //   }
  //   return true; 
  // })
  // .catch(err => console.log('Une erreur est survenue :' + err));
}

// const execute_search = function(query, sort, numElements, dataset){
//   get_filtered_events(query, sort, numElements).then(filtered_events => {
//     console.log(dataset, filtered_events)
//     this.setState({
//       traffic: filtered_events.traffic_data,
//       mainChart: {
//         ...this.state.mainChart,
//         ...(dataset===1 && {labels: filtered_events.date_array}),
//         datasets: update(this.state.mainChart.datasets, 
//           dataset===1?
//             {0: {
//               data: {$set: filtered_events.traffic_data},
//               label: {$set: query.app}
//             }} :
//             {[dataset - 1]: {
//               data: {$set: filtered_events.traffic_data},
//               label: {$set: query.page}
//             }}) 
//       }
//     })

//     if(this.state.max_traffic < filtered_events.max_traffic){
//       this.setState({
//         max_traffic : filtered_events.max_traffic,
//         mainChartOpts:{
//           ...this.state.mainChartOpts,
//           scales: {
//             ...this.state.mainChartOpts.xAxes,
//             yAxes: [
//               {
//                 ticks: {
//                   beginAtZero: true,
//                   maxTicksLimit: 5,
//                   stepSize: Math.ceil(400 / 5),
//                   max: filtered_events.max_traffic,
//                 },
//               }],
//           }
//         }
//       });
//     }
//     return true; 
//   })
//   .catch(err => console.log('Une erreur est survenue :' + err));
// }

async function asyncForEach(array, callback) {
  for (let index = 0; index < (array || []).length; index++) {
    await callback(array[index], index, array);
  }
}

const cluster_dates = (traffic, date_low, date_high) => {
  return traffic.filter(l => {
    return (new Date(l.created_at)).getTime() > date_low.getTime() && (new Date(l.created_at)).getTime()<=date_high.getTime();
  });
}

const get_filtered_events = (query, sort, numElements) => {
  return new Promise((resolve, reject) => {
    API.get_event({query, sort}).then((data) => {
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
          date_array.push( moment(intermDate).format('DD/MM à HH:mm') );

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
    }, () => {
      reject('Erreur')
    })
  })
}

const calculate_avg_time = async function(){
  const week_lag = DateOffset(new Date(), -2*7);
  
  let unmountData = (await API.get_event({query: {app: "App", action: "unmount", cookie: {$exists: true}, created_at : {"$gte": week_lag}, value: {$exists: true} }})).data.data;
  let mountData = (await API.get_event({query: {app: "App", action: "mount", cookie: {$exists: true}, created_at : {"$gte": week_lag}, value: {$exists: true} }})).data.data;
  let activeData = (await API.get_event({query: {action: 'active', label: 'App', created_at : {"$gte": week_lag}, value: {$exists: true} }})).data.data;
  let idleData = (await API.get_event({query: {action: 'idle', label: 'App', created_at : {"$gte": week_lag}, value: {$exists: true}, time: {$exists: true} }})).data.data;

  //On les apparie en filtrant ceux qui n'ont pas d'équivalent
  unmountData = unmountData.filter(x => mountData.some( y => x.value === y.value ));
  mountData = mountData.filter(x => unmountData.some( y => x.value === y.value ));
  activeData = activeData.filter(x => idleData.some( y => x.value === y.value ));
  idleData = idleData.filter(x => activeData.some( y => x.value === y.value ));

  //On les force à être de la même taile Ocazou
  const minMountingLength = Math.min(unmountData.length, mountData.length);
  const minIdleLength = Math.min(activeData.length, idleData.length);

  unmountData = unmountData.filter((_,i) => i < minMountingLength);
  mountData = mountData.filter((_,i) => i < minMountingLength);
  activeData = activeData.filter((_,i) => i < minIdleLength);
  idleData = idleData.filter((_,i) => i < minIdleLength);

  //On somme les dates
  const uSommeDates=unmountData.map(x => x.created_at).reduce((acc, curr) => acc += moment(curr), 0);
  const mSommeDates=mountData.map(x => x.created_at).reduce((acc, curr) => acc += moment(curr), 0);
  const aSommeDates=activeData.map(x => x.created_at).reduce((acc, curr) => acc += moment(curr), 0);
  const iSommeDates=idleData.map(x => x.time).reduce((acc, curr) => acc += moment(curr * 1), 0); //Je prends le temps où il est devenu inactif

  const averageTimeOnsite = (( new Date(uSommeDates).getTime() - new Date(mSommeDates).getTime()- (new Date(aSommeDates).getTime() - new Date(iSommeDates).getTime()) ) / minMountingLength  ) // / (1000 * 60) //- (new Date(aSommeDates).getTime() - new Date(iSommeDates).getTime()) / minIdleLength

  this.setState({averageTimeOnsite})

  // API.get_event({query: {app: "App", action: "unmount", cookie: {$exists: true}, created_at : {"$gte": week_lag} }}).then((uData) => {
  //   const unmountData=uData.data.data;
  //   const uSommeDates=unmountData.map(x => x.created_at).reduce((acc, curr) => acc += moment(curr), 0);
  //   const uMoyenneDate = uSommeDates / unmountData.length;
  //   API.get_event({query: {app: 'App', layout: "Layout", created_at : {"$gte": week_lag}, cookie: {$exists: true}, page: {$exists: false}, action: {$exists: false}, component: {$exists: false} }}).then((mData) => {
  //     const mountData=mData.data.data;
  //     const mSommeDates=mountData.map(x => x.created_at).reduce((acc, curr) => acc += moment(curr), 0);
  //     const mMoyenneDate = mSommeDates / mountData.length;

  //     API.get_event({query: {action: 'active', label: 'App', created_at : {"$gte": week_lag} }}).then((mData) => {
  //       const activeData=mData.data.data;
  //       const aSommeDates=activeData.map(x => x.created_at).reduce((acc, curr) => acc += moment(curr), 0);
  //       const aMoyenneDate = aSommeDates / activeData.length;
        
  //       API.get_event({query: {action: 'idle', label: 'App', created_at : {"$gte": week_lag} }}).then((mData) => {
  //         const idleData=mData.data.data;
  //         console.log(idleData[0].value, new Date(idleData[0].value*1), new Date(idleData[0].created_at))
  //         const iSommeDates=idleData.map(x => x.value).reduce((acc, curr) => acc += moment(curr * 1), 0);
  //         const iMoyenneDate = iSommeDates / idleData.length;

  //         const moyenneMounted = new Date(uMoyenneDate).getTime() - new Date(mMoyenneDate).getTime();
  //         const moyenneIdle = new Date(aMoyenneDate).getTime() - new Date(iMoyenneDate).getTime();
          
  //         const moyenneSite = ( uSommeDates - mSommeDates)
  //         console.log(mountData, unmountData, idleData, activeData, 
  //           moyenneMounted / (1000*60), 
  //           moyenneIdle / (1000*60),
  //           (moyenneMounted - moyenneIdle) / (1000*60) );
          
  //           this.setState({averageTimeOnsite: moyenneMounted - moyenneIdle})
  //       })
  //     })
  //   })
  // })
}

export {calculate_avg_time, display_traffic, execute_search, get_filtered_events};