import React from 'react';
import { Card, CardBody, CardHeader, CardFooter } from 'reactstrap';
import ContentEditable from 'react-contenteditable';
import { Editor } from 'react-draft-wysiwyg';
import Icon from 'react-eva-icons';

import Backdrop from '../../../UI/Backdrop/Backdrop';
import {boldBtn, italicBtn, underBtn, listBtn, imgBtn, videoBtn, linkBtn} from '../../../../assets/figma/index'
import CustomOption from './CustomOption/CustomOption'
import EVAIcon from '../../../UI/EVAIcon/EVAIcon';

const editableParagraph = (props) => {
  if(props.editable){
    return (
      // {/* <Backdrop show={true} clicked={()=>props.handleContentClick(props.idx,false, props.subkey)} /> */}
      <Editor
        toolbarClassName="toolbar-editeur"
        editorClassName="editor-editeur"
        wrapperClassName={"wrapper-editeur editeur-" + props.idx + '-' + props.subkey}
        placeholder={props.placeholder}
        onEditorStateChange={(editorState)=>props.onEditorStateChange(editorState, props.idx, props.subkey)}
        editorState={props.editorState}
        toolbarCustomButtons={[<CustomOption />]}
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
    )
  }else{
    return(
      <ContentEditable
        id={props.idx}
        data-subkey={props.subkey}
        className="animated fadeIn"
        html={props.content || '' }  // innerHTML of the editable div
        placeholder={props.placeholder}
        disabled={props.disableEdit}       // use true to disable editing
        onChange={props.handleMenuChange} // handle innerHTML change
        onClick={()=>props.handleContentClick(props.idx,true, props.subkey)}
      />
    )
  }
}

export default editableParagraph;