import React from 'react';
import { Card, CardBody, CardHeader, CardFooter } from 'reactstrap';
import ContentEditable from 'react-contenteditable';
import { Editor } from 'react-draft-wysiwyg';

import Backdrop from '../../../UI/Backdrop/Backdrop';

const editableParagraph = (props) => {
  if(props.editable){
    return (
      <div className="animated fadeIn">
        <Backdrop show={true} clicked={()=>props.handleContentClick(props.idx,false, props.subkey)} />
        <Card className="edition-card">
          <CardHeader>
            Modification
          </CardHeader>
          <CardBody>
            <p>Consignes :</p>
            <ul className="a">
              <li>Il faut que le texte soit bien écrit et dans un français compréhensible</li>
              <li>Pas plus de 500 caractères</li>
              <li>Une majuscule par phrase</li>
            </ul>
            <Editor
              toolbarClassName="toolbar-editeur"
              wrapperClassName="wrapper-editeur"
              editorClassName="editor-editeur"
              placeholder="Ecrivez ici votre article..."
              onEditorStateChange={(editorState)=>props.onEditorStateChange(editorState, props.idx, props.subkey)}
              editorState={props.editorState}
            />
          </CardBody>
          <CardFooter>
            Valider
          </CardFooter>
        </Card>
      </div>
    )
  }else{
    return(
      <ContentEditable
        id={props.idx}
        subkey={props.subkey}
        className="animated fadeIn"
        html={props.content}  // innerHTML of the editable div
        disabled={props.disableEdit}       // use true to disable editing
        onChange={props.handleMenuChange} // handle innerHTML change
      />
    )
  }
}

export default editableParagraph;