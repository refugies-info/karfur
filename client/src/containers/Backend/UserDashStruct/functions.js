import Swal from 'sweetalert2';
import API from '../../../utils/API';

const selectItem = function(suggestion){
  this.setState({selected : suggestion});
}

const editMember = function(member) {
  this.setState({selected: member});
  this.toggleModal("editMember");
}

const addMember = function() {
  if(!this.state.selected || !this.state.structure){Swal.fire( 'Oh non!', 'Certaines informations sont manquantes', 'error'); return;}
  let structure={
    _id: this.state.structure._id,
    "$addToSet": { "membres": {userId: this.state.selected._id, roles: ["membre"], added_at: new Date() } },
  };
  API.create_structure(structure).then((data) => {
    console.log(data);
    Swal.fire( 'Yay...', 'Votre nouveau membre a bien été ajouté, merci', 'success');
    this.toggleModal("addMember")
  })
}

export {selectItem, editMember, addMember}