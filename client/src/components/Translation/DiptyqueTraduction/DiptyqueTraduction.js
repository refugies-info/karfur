import React from 'react';
import { FormGroup, Label, FormFeedback } from 'reactstrap';
import ReactHtmlParser from 'react-html-parser';
import ContentEditable from 'react-contenteditable';

import './DiptyqueTraduction.css'

const diptyqueTraduction = (props) => {
  return(
    <>
      <FormGroup className="diptyque-traduction">
        <Label htmlFor="initialText">Texte initial en français</Label>
        <div
          type="text" 
          className="form-control form-control-success" 
          id="initialText">
          {ReactHtmlParser(props.initial_string)}
        </div>
      </FormGroup>
      <FormGroup className="diptyque-traduction">
        <Label htmlFor="translationInput">Traduction</Label>
        {/* {props.editable ? */}
        {props.translated_string &&
          <ContentEditable
            disabled={!props.editable}
            className="form-control form-control-success" 
            id="translatedText"
            placeholder="Nouvelle traduction..."
            html={props.translated_string}  // innerHTML of the editable div
            onChange={props.handleTranslationChange} />
        }
          
          {/* <div
            type="text" 
            className="form-control form-control-success" 
            id="initialText" >
            {ReactHtmlParser(props.translated_string)}
          </div> */}
      </FormGroup>
    </>
  )
}

export default diptyqueTraduction;