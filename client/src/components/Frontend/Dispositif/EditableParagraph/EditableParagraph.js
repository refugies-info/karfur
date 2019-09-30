import React, {Component} from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Tooltip } from 'reactstrap';
import ContentEditable from 'react-contenteditable';
import { Editor } from 'react-draft-wysiwyg';

// import Backdrop from '../../../UI/Backdrop/Backdrop';
import {boldBtn, italicBtn, underBtn, listBtn, imgBtn, videoBtn, linkBtn} from '../../../../assets/figma/index'
import CustomOption from './CustomOption/CustomOption'
import EVAIcon from '../../../UI/EVAIcon/EVAIcon';

import './EditableParagraph.scss'
import variables from 'scss/colors.scss';

class EditableParagraph extends Component {
  state= {
    tooltipOpen: false,
    isDropdownOpen:false,
    dropdownColor: new Array(4).fill("#FFFFFF")
  }

  toggle = () => this.setState({isDropdownOpen:!this.state.isDropdownOpen})
  toggleTooltip = () => this.setState(prevState => ({tooltipOpen: !prevState.tooltipOpen })); 
  toggleColor = (key, hover) => this.setState(prevState=>({dropdownColor:prevState.dropdownColor.map((_,i)=> (i===key ? (hover ? variables.noir : "#FFFFFF") : "#FFFFFF"))}))

  render(){
    const props=this.props;
    if(props.editable){
      return (
        // {/* <Backdrop show={true} clicked={()=>props.handleContentClick(props.keyValue,false, props.subkey)} /> */}
        <>
          <Editor
            toolbarClassName={"toolbar-editeur" + (props.keyValue===0 ? " no-top":"")}
            editorClassName="editor-editeur"
            wrapperClassName={"wrapper-editeur editeur-" + props.keyValue + '-' + props.subkey}
            placeholder={props.placeholder}
            onEditorStateChange={(editorState)=>props.onEditorStateChange(editorState, props.keyValue, props.subkey)}
            editorState={props.editorState}
            // toolbarCustomButtons={[<CustomOption />]}
            toolbar={{
              options: ['inline','list', 'image', 'embedded', 'link'],
              inline: {
                inDropdown: false,
                options: ['bold', 'italic', 'underline'],
                className: "bloc-gauche-inline blc-gh",
                bold: { icon: boldBtn, className: "inline-btn btn-bold" },
                italic: { icon: italicBtn, className: "inline-btn btn-italic"  },
                underline: { icon: underBtn, className: "inline-btn btn-underline"  },
              },
              list: {
                inDropdown: false,
                options: ['unordered'],
                className: "bloc-gauche-list blc-gh",
                unordered:{icon: listBtn, className: "list-btn"}
              },
              image:{
                className: "bloc-droite-image",
                icon: imgBtn
              },
              embedded:{
                className: "bloc-droite-embedded",
                icon: videoBtn
              },
              link: {
                inDropdown: false,
                options: ['link'],
                className: "bloc-droite-link blc-dr",
                link:{icon: linkBtn, className: "btn-link"}
              },
            }}
          />
          <div className="plus-wrapper">
            <Dropdown isOpen={this.state.isDropdownOpen} toggle={this.toggle}>
              <DropdownToggle tag="span" onClick={this.toggle} data-toggle="dropdown" aria-expanded={this.state.isDropdownOpen}>
                <EVAIcon id="eva-icon-1" className="plus-icon" name="plus-circle-outline" />
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem onClick={()=>this.props.addItem(this.props.keyValue, "paragraph", this.props.subkey)} id='paragraph' onMouseEnter={()=>this.toggleColor(0, true)} onMouseLeave={()=>this.toggleColor(0, false)}>
                  <EVAIcon name="menu-outline" fill={this.state.dropdownColor[0]} id="0" />
                  Paragraphe
                </DropdownItem>
                <DropdownItem onClick={()=>this.props.addItem(this.props.keyValue, "map", this.props.subkey)} id='map' onMouseEnter={()=>this.toggleColor(2, true)} onMouseLeave={()=>this.toggleColor(2, false)}>
                  <EVAIcon name="pin-outline" fill={this.state.dropdownColor[2]} id="2"  />
                  Carte
                </DropdownItem>
                <DropdownItem onClick={()=>this.props.addItem(this.props.keyValue, "accordion", this.props.subkey)} id='accordion' onMouseEnter={()=>this.toggleColor(3, true)} onMouseLeave={()=>this.toggleColor(3, false)}>
                  <EVAIcon name="list-outline" fill={this.state.dropdownColor[3]} id="3"  />
                  Accordéon
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
            
            <Tooltip placement="top" offset="0px, 8px" isOpen={this.state.tooltipOpen} target="eva-icon-1" toggle={this.toggleTooltip}>
              ajouter
            </Tooltip>
          </div>
        </>
      )
    }else{
      return(
        <ContentEditable
          id={props.keyValue}
          data-subkey={props.subkey}
          data-target={props.target}
          className="animated fadeIn"
          html={props.content || '' }  // innerHTML of the editable div
          placeholder={props.placeholder}
          disabled={props.disableEdit}       // use true to disable editing
          onChange={props.handleMenuChange} // handle innerHTML change
          onClick={()=>props.handleContentClick(props.keyValue,!props.disableEdit, props.subkey)}
        />
      )
    }
  }
}

export default EditableParagraph;