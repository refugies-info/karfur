import React, {Component} from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Tooltip } from 'reactstrap';
import ContentEditable from 'react-contenteditable';
import { Editor } from 'react-draft-wysiwyg';
import { Draft, DefaultDraftBlockRenderMap, EditorBlock, convertToRaw, convertFromRaw } from 'draft-js';
import { Map } from 'immutable';
import draftToHtml from 'draftjs-to-html';
import { Player } from 'video-react';

// import Backdrop from '../../../UI/Backdrop/Backdrop';
import {boldBtn, italicBtn, underBtn, listBtn, imgBtn, videoBtn, linkBtn} from '../../../../assets/figma/index'
import CustomOption from './CustomOption/CustomOption'
import EVAIcon from '../../../UI/EVAIcon/EVAIcon';
import FButton from '../../../FigmaUI/FButton/FButton';
import API from '../../../../utils/API';

import './EditableParagraph.scss'
import variables from 'scss/colors.scss';


const MyCustomBlock = props => (
  <div className="bloc-rouge">
    <div className="icon-left-side">
      <EVAIcon name="info-outline" fill={variables.noir} className="flex-center" />
    </div>
    <div className="right-side">
      <b>Bon à savoir :</b>
      <EditorBlock {...props} />
    </div>
  </div>
)

const MyImageBlock = props => {
  const {block, contentState} = props;
  if(block.getEntityAt(0)){
    const data = contentState.getEntity(block.getEntityAt(0)).getData();
    if(data.alt !== undefined){
      return (
        <div className="image-wrapper">
          <img {...data} />
        </div>
      )
    }else{
      return (
        <div className="video-wrapper">
          <Player
            playsInline
            {...data}
          />
        </div>
      )
    }
  }else{return false}
}

function myBlockRenderer(contentBlock) {
  const type = contentBlock.getType();
  if (type === 'header-six') {
    return {
      component: MyCustomBlock,
    };
  }else if (type === 'atomic') {
    return {
      component: MyImageBlock,
    };
  }
  return undefined
}

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
    if(props.editable && !props.disableEdit){
      return (
        // {/* <Backdrop show={true} clicked={()=>props.handleContentClick(props.keyValue,false, props.subkey)} /> */}
        <>
          <Editor
            spellCheck
            toolbarClassName={"toolbar-editeur" + (props.keyValue===0 ? " no-top":"")}
            editorClassName="editor-editeur"
            wrapperClassName={"wrapper-editeur editeur-" + props.keyValue + '-' + props.subkey}
            placeholder={props.placeholder}
            onEditorStateChange={(editorState)=>props.onEditorStateChange(editorState, props.keyValue, props.subkey)}
            editorState={props.editorState}
            toolbarCustomButtons={[<CustomOption editorState={props.editorState} />]}
            blockRendererFn={myBlockRenderer}
            stripPastedStyles
            toolbar={{
              options: ['inline','list', 'image', 'link'], //, 'embedded'
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
                icon: imgBtn,
                urlEnabled: true,
                uploadEnabled:true,
                uploadCallback: uploadImageCallBack, 
                alignmentEnabled: true,
                alt: { present: true, mandatory: false },
                previewImage: true
              },
              // embedded:{
              //   className: "bloc-droite-embedded",
              //   icon: videoBtn
              // },
              link: {
                inDropdown: false,
                options: ['link'],
                className: "bloc-droite-link blc-dr",
                link:{icon: linkBtn, className: "btn-link"},
                defaultTargetOption:'_blank',
                showOpenOptionOnHover:true,
              },
            }}
          />
          <AddModuleBtn 
            isDropdownOpen={this.state.isDropdownOpen}
            dropdownColor={this.state.dropdownColor}
            tooltipOpen={this.state.tooltipOpen}
            toggle={this.toggle}
            toggleColor={this.toggleColor}
            toggleTooltip={this.toggleTooltip}
            {...this.props}
          />
        </>
      )
    }else if(typeof props.content === "string"){
      return(<>
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
        <AddModuleBtn 
          isDropdownOpen={this.state.isDropdownOpen}
          dropdownColor={this.state.dropdownColor}
          tooltipOpen={this.state.tooltipOpen}
          toggle={this.toggle}
          toggleColor={this.toggleColor}
          toggleTooltip={this.toggleTooltip}
          {...this.props}
        />
      </>)
    }else{return false}
  }
}

const AddModuleBtn = props => {
  if(props.type!=='etape'){
    return (
      <div className="plus-wrapper">
        <Dropdown isOpen={props.isDropdownOpen} toggle={props.toggle}>
          <DropdownToggle tag="span" onClick={props.toggle} data-toggle="dropdown" aria-expanded={props.isDropdownOpen} id="add-module-btn">
            <FButton type="dark" name="plus-circle-outline" className="mt-10" >
              Ajouter un module
            </FButton>
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem onClick={()=>props.addItem(props.keyValue, "paragraph", props.subkey)} id='paragraph' onMouseEnter={()=>props.toggleColor(0, true)} onMouseLeave={()=>props.toggleColor(0, false)}>
              <EVAIcon name="menu-outline" fill={props.dropdownColor[0]} id="0" />
              Paragraphe
            </DropdownItem>
            <DropdownItem onClick={()=>props.addItem(props.keyValue, "map", props.subkey)} id='map' onMouseEnter={()=>props.toggleColor(2, true)} onMouseLeave={()=>props.toggleColor(2, false)}>
              <EVAIcon name="pin-outline" fill={props.dropdownColor[2]} id="2"  />
              Carte
            </DropdownItem>
            <DropdownItem onClick={()=>props.addItem(props.keyValue, "accordion", props.subkey)} id='accordion' onMouseEnter={()=>props.toggleColor(3, true)} onMouseLeave={()=>props.toggleColor(3, false)}>
              <EVAIcon name="list-outline" fill={props.dropdownColor[3]} id="3"  />
              Accordéon
            </DropdownItem>
            {props.typeContenu==="demarche" && 
              <DropdownItem onClick={()=>props.addItem(props.keyValue, "etape", props.subkey)} id='etape' onMouseEnter={()=>props.toggleColor(4, true)} onMouseLeave={()=>props.toggleColor(4, false)}>
                <EVAIcon name="list-outline" fill={props.dropdownColor[4]} id="4"  />
                Etape
              </DropdownItem>}
          </DropdownMenu>
        </Dropdown>
        
        <Tooltip placement="top" offset="0px, 8px" isOpen={props.tooltipOpen} target="add-module-btn" toggle={props.toggleTooltip}>
          ajouter
        </Tooltip>
      </div>
    )
  }else{return false}
};

function uploadImageCallBack(file) {
  return new Promise(
    (resolve, reject) => {
      //On l'envoie ensuite au serveur
      const formData = new FormData()
      formData.append(0, file)
      API.set_image(formData).then(data_res => {
        let response = data_res.data.data;
        response.link = response.secure_url;
        resolve({data: response});
      }).catch(e => {console.log(e);reject(e)})
    }
  );
}

export default EditableParagraph;