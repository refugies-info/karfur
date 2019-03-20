const colorAvancement= avancement => {
  if(avancement >.75){
      return 'success'
  }else if(avancement >.50){
      return 'info'
  }else if(avancement >.25){
      return 'warning'
  }else{
      return 'danger'
  }
}

const colorStatut= avancement => {
  if(avancement === "Annulé" || avancement === "Annulée" || avancement === "Exclu" || avancement === "Supprimé"){
      return 'danger'
  }else if(avancement === "Inactif" || avancement === "Inactive"){
      return 'secondary'
  }else if(avancement === "En attente" || avancement === "En cours"){
      return 'warning'
  }else{
      return 'success'
  }
}

export {colorAvancement, colorStatut}