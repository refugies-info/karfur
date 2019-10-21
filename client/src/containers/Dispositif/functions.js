import querySearch from "stringquery";
import _ from "lodash";

import { customCriteres } from './MoteurVariantes/data';
import API from '../../utils/API';

//Je met ici toutes les fonctions relatives aux démarches pour pas encombrer

const initializeVariantes = function(itemId){
  let query = this.state.dispositif.demarcheId ? 
    { $or: [{demarcheId: this.state.dispositif.demarcheId}, {_id: this.state.dispositif.demarcheId}] } :
    {demarcheId: itemId};  //Si on est dans le cas général, on va chercher toutes les variantes. Sinon, on va aussi chercher le cas général en plus
  API.get_dispositif({query: {...query, status: "Actif"}}).then(data_res => {
    const allDemarches=[...data_res.data.data];
    this.setState({allDemarches});
  }).catch(e=>console.log(e))
}

const initializeInfoCards = function() {
  let infocards = [];
  const variante = _.get(this.state, "variantes.0", {});
  const card = { "type" : "card", "isFakeContent" : false, "editable" : false, typeIcon: "eva"};
  const {villes, ageTitle, bottomValue, topValue} = variante;
  if(villes && villes.length > 0){ infocards = [...infocards, {...card, contentTitle: (villes.length === 1 ?_.get(villes, "0.formatted_address") : (villes.length + " villes")), title:'Localisation',titleIcon:'pin-outline'}] }
  if(ageTitle){ infocards = [...infocards, {...card, title:'Âge requis',titleIcon:'calendar-outline', ageTitle, bottomValue, topValue}] }
  customCriteres.forEach(x => { if(x.query && variante[x.query] && variante[x.query].length > 0){
    let texte = ""; 
    _.get(variante, x.query, []).forEach((y, i, arr) => { texte = texte + y + (i < arr.length - 1 ? " ou " : ""); })
    infocards = [...infocards, {...card, contentTitle: texte, title: x.texte, titleIcon:'options-2-outline'}]
  } })
  this.setState(pS => ({menu: pS.menu.map((x,i) => i===1 ? {...x, children: infocards} : x)}), ()=>this.setColors());
}

const switchVariante = async function() {
  const userQuery = querySearch(this.props.history.location.search);
  const place_id = userQuery.ville, age = userQuery.age;
  let demarchesEligibles = [];
  if(age && Number(age)){
    [...this.state.allDemarches, this.state.dispositif].forEach(demarche => {
      demarche.variantes.some(variante => {
        console.log(demarche._id, parseInt(variante.topValue),parseInt(age),parseInt(variante.bottomValue))
        if(parseInt(variante.topValue)>=parseInt(age) && parseInt(variante.bottomValue)<=parseInt(age)){
          console.log(variante)
          demarchesEligibles = [...demarchesEligibles, demarche];
          return true;
        }else{return false;}
      })
    })
  }
  console.log('starting')
  const filter_place = await check_place(place_id, demarchesEligibles, age, this.state.allDemarches, this.state.dispositif);
  console.log('ending', filter_place)
  if(filter_place && filter_place.bestDemarche && filter_place.mostPreciseIndex >-1 && filter_place.bestDemarche._id !== this.state._id){
    console.log(filter_place.bestDemarche._id)
    this.props.history.push({pathname: "/demarche/" + filter_place.bestDemarche._id, search: this.props.history.location.search})
  }
  return true;
}

const check_place = function(place_id, demarchesEligibles, age, allDemarches, dispositif){
  console.log('in check_place')
  return new Promise((resolve)=> {
    console.log('in promise')
    if (place_id && typeof window.google !== "undefined") {
      var service = new window.google.maps.places.PlacesService(document.createElement('div'));
      var request = { placeId: place_id, fields: ['name', 'place_id', 'formatted_address', 'address_components'] };
      return service.getDetails(request, (data)=>{
        console.log('in callback')
        if(!data || !data.address_components){resolve(false); return;}
        //On boucle sur toutes les variantes pour voir si on en trouve une qui inclut la ville requêtée par l'utilisateur
        let mostPreciseIndex = -1, bestDemarche={};
        [...allDemarches, dispositif].forEach(demarche => {
          if(!age || (demarchesEligibles.length > 0 && demarchesEligibles.some(x => x._id === demarche._id))){
            demarche.variantes.forEach(variante => {
              (variante.villes || []).forEach(ville => {
                (ville.address_components || []).forEach(comp => {
                  ["administrative_area_level_1", "administrative_area_level_2", "administrative_area_level_3", "administrative_area_level_4", "administrative_area_level_5", "locality", "sublocality", "sublocality_level_1", "sublocality_level_2", "sublocality_level_3", "sublocality_level_4", "sublocality_level_5","neighborhood"].forEach((loc, i) => {
                    if((comp.types || []).includes(loc)){
                      const valeurCherchee = data.address_components.find(z => (z.types || []).includes(loc) && z.long_name === comp.long_name);
                      //Si on obtient un niveau de précision supérieur à toutes les autres démarches (y compris celle affichée actuellement), on passe sur la nouvelle démarche
                      if(valeurCherchee && i>= mostPreciseIndex){
                        mostPreciseIndex = i; bestDemarche = demarche;
                      }
                    }
                  })
                })
              })
            })
          }
        })
        console.log('resolving')
        resolve({bestDemarche, mostPreciseIndex})
      });
    }else if(place_id){
      console.log('relooping')
      return setTimeout(this.switchVariante, 1000);
    }else{
      console.log('rejecting')
      resolve(false)
    }
  })
}

export {switchVariante, initializeVariantes, initializeInfoCards};