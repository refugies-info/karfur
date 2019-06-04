import React from 'react';
import { Card, CardBody, CardHeader, CardFooter } from 'reactstrap';
import ContentEditable from 'react-contenteditable';
import { Editor } from 'react-draft-wysiwyg';
import Icon from 'react-eva-icons';

import Backdrop from '../../../UI/Backdrop/Backdrop';

const editableParagraph = (props) => {
  if(props.editable){
    return (
      <div className="animated fadeIn">
        <Backdrop show={true} clicked={()=>props.handleContentClick(props.idx,false, props.subkey)} />
        <Card className="edition-card">
          <CardHeader>
            <div className="tutoriel-card">
              <div className="tutoriel-title">
                <Icon name="alert-circle" fill="#F6B93B" />
                <h3>{(props.tutoriel || {}).titre}</h3>
              </div>
              <p>
                {(props.tutoriel || {}).contenu}
              </p>
            </div>
          </CardHeader>
          <div className="card-bottom">
            <CardBody>
              <Editor
                toolbarClassName="toolbar-editeur"
                wrapperClassName="wrapper-editeur"
                editorClassName="editor-editeur"
                placeholder={props.placeholder}
                onEditorStateChange={(editorState)=>props.onEditorStateChange(editorState, props.idx, props.subkey)}
                editorState={props.editorState}
              />
            </CardBody>
            <CardFooter onClick={()=>props.handleContentClick(props.idx,false, props.subkey)}>
              Valider
            </CardFooter>
          </div>
        </Card>
      </div>
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
      />
    )
  }
}

export default editableParagraph;