import API from '../../../utils/API';

const showSuggestion = function(suggestion) {
  this.setState({suggestion});
  this.toggleModal('suggestion');
}

const archiveSuggestion = function(suggestion) {
  let dispositif = {
    dispositifId: suggestion.dispositifId,
    suggestionId: suggestion.suggestionId,
    fieldName: suggestion.action,
    type: 'pull'
  }
  console.log(dispositif)
  API.update_dispositif(dispositif).then(data => {
    console.log(data.data.data)
    this.setState({actions: this.state.actions.filter(x=> x.suggestionId !== suggestion.suggestionId)})
  })
}

const parseActions = dispositifs => {
  let actions = [];
  dispositifs.forEach(dispo => {
    return ['suggestions', 'questions', 'signalements'].map(item => {
      if(dispo[item] && dispo[item].length > 0){
        actions= [...actions, ...dispo[item].map(x => ({
          action : item,
          titre: dispo.titreInformatif,
          owner: true,
          depuis : x.createdAt,
          texte : x.suggestion,
          read : x.read,
          username : x.username,
          picture : x.picture,
          dispositifId:dispo._id,
          suggestionId:x.suggestionId
        }))];
      } return actions;
    })
  });
  return actions
}

const deleteContrib = function(dispositif, type, callback=()=>{}){
  API.add_dispositif(dispositif).then(() => {
    if(type){
      const query = type === "user" ? {'creatorId': this.props.userId} : {'mainSponsor': ((this.props.user || {}).structures || [{}])[0]};
      API.get_dispositif({query: {...query, status: {$ne: "Supprimé"}}}).then(data => { console.log(data.data.data);
        this.setState({contributions: data.data.data, actions: parseActions(data.data.data)})
      })
    }
    return callback();
  })
}

const getProgression = function(){
  API.get_progression().then(data_progr => {
    const progression = (data_progr.data.data || [{}])[0] || {};
    this.setState(pS => ({progression: {
      ...pS.progression,
      timeSpent: (progression.timeSpent || 0) + (pS.progression.timeSpent || 0),
      nbMots: progression.nbMots
    }}))
  })
  API.get_dispo_progression().then(data_progr => {
    const progression = (data_progr.data.data || [{}])[0] || {};
    this.setState(pS => ({progression: {
      ...pS.progression,
      timeSpent: (progression.timeSpent || 0) + (pS.progression.timeSpent || 0),
      nbMotsContrib: progression.nbMots
    }}))
  })
}

export {showSuggestion, archiveSuggestion, parseActions, deleteContrib, getProgression};