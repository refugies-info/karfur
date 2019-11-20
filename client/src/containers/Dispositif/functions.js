import querySearch from "stringquery";
import _ from "lodash";
import Swal from 'sweetalert2';

import { customCriteres } from './MoteurVariantes/data';
import { google_localities } from "./data";
import API from '../../utils/API';

//Je met ici toutes les fonctions relatives aux démarches pour pas encombrer

const initializeVariantes = function(itemId){
  const query = this.state.dispositif.demarcheId ? 
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
  if(ageTitle && bottomValue!==null && topValue !== null){ infocards = [...infocards, {...card, title:'Âge requis',titleIcon:'calendar-outline', ageTitle, bottomValue, topValue}] }
  customCriteres.forEach(x => { if(x.query && variante[x.query] && variante[x.query].length > 0){
    let texte = ""; 
    _.get(variante, x.query, []).forEach((y, i, arr) => { texte = texte + this.props.t("Dispositif." + y, y) + (i < arr.length - 1 ? (" " + this.props.t("ou", "ou") + " ") : ""); })
    infocards = [...infocards, {...card, contentTitle: texte, title: x.texte, titleIcon:'options-2-outline'}]
  } })
  this.setState(pS => ({menu: pS.menu.map((x,i) => i===1 ? {...x, children: infocards} : x)}), ()=>this.setColors());
}

const switchVariante = async function() {
  const userQuery = querySearch(this.props.history.location.search);
  const place_id = userQuery.ville, age = userQuery.age;
  let demarchesEligibles = [];
  console.log('ici variantes')
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
                  google_localities.forEach((loc, i) => {
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

const verifierDemarche  = function(){
  if(this.state.typeContenu === "demarche"){
    const {allDemarches, dispositif, variantes} = this.state;
    //Une démarche doit avoir des critères
    if(this.state.variantes.length === 0){
      Swal.fire( {title: 'Oh non!', text: 'Il faut renseigner au moins un critère dans l\'encadré jaune avant de pouvoir valider la démarche', type: 'error', timer: 1500 });
      return false;
    }
    //Toute démarche ou variante doit avoir positivement validé ses critères
    if(!this.state.isVarianteValidated){
      Swal.fire( {title: 'Oh non!', text: 'Vous n\'avez pas validé les critères de votre démarche (encadré jaune)', type: 'error', timer: 1500 });
      return false;
    }
    //Deux démarches ne peuvent pas avoir exactement les mêmes critères
    if(this.state.inVariante){
      const varianteAlreadyExists = variantes.some(variante => {
        return [...allDemarches, dispositif].some(d => d && (d.variantes || []).some(va => {
          let isEqual = true;
          if(va.bottomValue !== variante.bottomValue || va.topValue !== variante.topValue){
            isEqual = false;
          }
          isEqual = isEqual ? !(va.villes || []).some(vi => !(variante.villes || []).some(ville => ville.place_id === vi.place_id ) ) : isEqual;
          customCriteres.forEach(cc =>{if(cc.query){
            isEqual = isEqual ? (variante[cc.query] || []).length === (va[cc.query] || []).length &&  !(va[cc.query] || []).some(x => !(variante[cc.query] || []).includes(x) ) : isEqual;
          } } )
          return isEqual;
        } ))
      })
      if(varianteAlreadyExists){
        Swal.fire( {title: 'Oh non!', text: 'Vous avez rentré les mêmes critères qu\'une variante existante, peut-être souhaitez-vous la préciser ?', type: 'error', timer: 1500 });
        return false;
      }
    }
  } 
  return true;
}

const validateVariante = function(newVariante, idx){
  this.setState(pS => ({isVarianteValidated: true, variantes: [
    ...pS.variantes.map((x,i)=> i===idx ? newVariante : x), 
    ...(idx >= pS.variantes.length ? [newVariante] : [])
  ]}))
}

const deleteVariante = function(idx){
  this.setState(pS => ({
    variantes: pS.variantes.filter((_,i)=> i!==idx), 
    isVarianteValidated: pS.variantes.length > 1,
  }), ()=> console.log(this.state.variantes))
}

export {
  switchVariante, 
  initializeVariantes, 
  initializeInfoCards, 
  verifierDemarche,
  validateVariante,
  deleteVariante
};