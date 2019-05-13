import React, {Component} from 'react';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

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
        {this.props.tags.map((tag, key) => {
          return (
            <span className="tag-item" key={key}>
              #&nbsp;
              <u>
                <ButtonDropdown isOpen={this.state.isDropdownOpen[key]} toggle={(e)=>this.toggleDropdown(e, key)} className="tags-dropdown">
                  <DropdownToggle caret>
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
              </u>
            </span>
          )}
        )}
        {this.state.editable && 
          <h1 className="p-1 plus-button" onClick={this.addTag}>+</h1>}
      </div>
    )
  }
}

export default Tags;