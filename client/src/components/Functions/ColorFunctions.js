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

const fColorAvancement= avancement => {
  if(avancement >.75){
    return 'vert'
  }else if(avancement >.50){
    return 'jaune'
  }else if(avancement >.2){
    return 'orange'
  }else{
    return 'rouge'
  }
}

const colorStatut= avancement => {
  if(avancement === "Annulé" || avancement === "Annulée" || avancement === "Exclu" || avancement === "Supprimé"){
      return 'danger'
  }else if(avancement === "Inactif" || avancement === "Inactive"){
      return 'secondary'
  }else if(avancement === "En attente" || avancement === "En cours" || avancement === "Brouillon"){
      return 'warning'
  }else{
      return 'success'
  }
}

const randomColor = () => {
  let colorArr = ["primary", "secondary", "success", "warning", "danger", "info", "light", "dark"]
  let nb=Math.floor(Math.random() * Math.floor(colorArr.length - 1));
  return colorArr[nb];
}

export {colorAvancement, colorStatut, randomColor, fColorAvancement}