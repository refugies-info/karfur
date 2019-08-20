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

export {showSuggestion, archiveSuggestion, parseActions};