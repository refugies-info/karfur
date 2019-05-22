import React, {Component} from 'react';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Button } from 'reactstrap';
import Icon from 'react-eva-icons';

import './Tags.scss';

const tags = ['Insertion professionnelle', 'Trouver un logement', 'Faire une demande d\'asile', 'Faire garder mes enfants', 'Apprendre le français', 'Autre']

class Tags extends Component {
  state= {
    isDropdownOpen: new Array(this.props.tags.length).fill(false),
  }

  toggleDropdown = (e, key) => {
    if(this.state.isDropdownOpen[key] && e.currentTarget.id){
      this.props.changeTag(key, e.target.innerText)
    }
    this.setState({ isDropdownOpen: this.state.isDropdownOpen.map((x,i)=> i===key ? !x : false)})
  };

  addTag = () => {
    this.setState({isDropdownOpen:[...this.state.isDropdownOpen,false]})
    this.props.addTag();
  }

  render(){
    return(
      <div className="tags">
        {(this.props.tags || []).map((tag, key) => {
          return (
            <ButtonDropdown isOpen={this.state.isDropdownOpen[key]} toggle={(e)=>this.toggleDropdown(e, key)} className="tags-dropdown" key={key}>
              <DropdownToggle caret={!this.props.disableEdit}>
                {tag}
              </DropdownToggle>
              <DropdownMenu>
                {tags.map((e, i) => {
                  return (
                    <DropdownItem key={i} id={i}>
                      {e}
                    </DropdownItem>
                  )} 
                )}
              </DropdownMenu>
            </ButtonDropdown>
          )}
        )}
        {!this.props.disableEdit && 
          <Button className="plus-button" onClick={this.addTag}>
            <Icon name="plus-circle-outline" fill="#CDCDCD" />
            Ajouter un tag
          </Button>}
      </div>
    )
  }
}

export default Tags;