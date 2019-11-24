menu: dispositif.contenu.map(x => x.type ==="cards" ? 
  { ...x, 
    ...(x.children && {
      children: x.children.map(y => {
        const match = _.get(menu, "1.children", []).find(z => z.title === y.title);
        return (y.type === "card" ? 
          {
            ...y, 
            typeIcon: match.typeIcon, 
            titleIcon: match.titleIcon 
          } : y)
        }
      )
    })
  } : 
  x
)


db.getCollection("dispositifs").find({status:"Actif", typeContenu:{$ne: "demarche"} }).forEach(function(e,i) {
  e.contenu[1].children.forEach(function(c,si) {
      if(c.titleIcon === "money"){
          c.titleIcon = 'pricetags-outline'
          c.typeIcon = "eva"
      }
  })
  db.getCollection("dispositifs").save(e);
});
        