import React, {Component} from 'react';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Button } from 'reactstrap';
import EVAIcon from '../../../components/UI/EVAIcon/EVAIcon';

import './Tags.scss';
import variables from 'scss/colors.scss';

class Tags extends Component {
  state= {
    isDropdownOpen: new Array(this.props.tags.length).fill(false),
  }

  componentDidMount(){
    if(this.props.tags){
      this.setState({isDropdownOpen: new Array(this.props.tags.length).fill(false)})
    }
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.tags && nextProps.tags !== this.props.tags){
      this.setState({isDropdownOpen: new Array(nextProps.tags.length).fill(false)})
    }
  }

  toggleDropdown = (e, key) => {
    this.setState({ isDropdownOpen: this.state.isDropdownOpen.map((x,i)=> i===key ? !x : false)}, () => console.log(this.state))
  };

  addTag = () => {
    this.setState({isDropdownOpen:[...this.state.isDropdownOpen,false]})
    this.props.addTag();
  }

  removeTag = (idx) => {
    this.setState({isDropdownOpen:[...this.state.isDropdownOpen].filter((_,i) => i!==idx)})
    this.props.deleteTag(idx);
  }

  render(){
    return(
      <div className="tags">
        {(this.props.tags || []).map((tag, key) => {
          return (
            <ButtonDropdown isOpen={!this.props.disableEdit && this.state.isDropdownOpen[key]} toggle={(e)=>this.toggleDropdown(e, key)} className="tags-dropdown" key={key}>
              <DropdownToggle caret={!this.props.disableEdit}>
                {tag.short || tag.name || tag}
              </DropdownToggle>
              <DropdownMenu>
                {this.props.filtres.map((e, i) => {
                  return (
                    <DropdownItem 
                      onMouseOver={ev=>ev.target.style.backgroundColor=e.hoverColor}
                      onMouseOut={ev=>ev.target.style.backgroundColor='#FFFFFF'}
                      onClick={()=>this.props.changeTag(key, e)} key={i} id={i}>
                      {e.short || e.name}
                    </DropdownItem>
                  )} 
                )}
              </DropdownMenu>
              {!this.props.disableEdit && 
                <div className="tags-icons">
                  <div onClick={()=>this.removeTag(key)}>
                    <EVAIcon name="close-circle" fill={variables.error} className="delete-icon" size="xlarge"/>
                  </div>
                </div>}
            </ButtonDropdown>
          )}
        )}
        {!this.props.disableEdit && (this.props.tags || []).length<3 && 
          <Button className="plus-button ml-10" onClick={this.addTag}>
            <EVAIcon className="mr-10" name="plus-circle-outline" fill="#CDCDCD" />
            Ajouter un tag
          </Button>}
      </div>
    )
  }
}

export default Tags;