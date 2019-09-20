import React from 'react';
import { Col, Row, Button, Collapse } from 'reactstrap';
import ContentEditable from 'react-contenteditable';

import EditableParagraph from '../EditableParagraph/EditableParagraph'
import QuickToolbar from '../../../../containers/Dispositif/QuickToolbar/QuickToolbar';
import CardParagraphe, {PlusCard} from '../../../../containers/Dispositif/CardParagraphe/CardParagraphe';
import MapParagraphe from '../../../../containers/Dispositif/MapParagraphe/MapParagraphe';
import variables from '../../../../containers/Dispositif/Dispositif.scss';
import EVAIcon from '../../../UI/EVAIcon/EVAIcon';

const contenuParagraphe = (props) => {
  let item=props.item;
  const safeUiArray = (key, subkey, node) => props.uiArray[key] && props.uiArray[key].children && props.uiArray[key].children.length>subkey && props.uiArray[key].children[subkey] && props.uiArray[key].children[subkey][node]

  return(
    <div className={item.type==='cards' ? 'row cards' : 'sous-paragraphe'}>
      {item.children && item.children.map((subitem, subkey) => {
        if(subitem.type==='card'){
          return ( 
            <CardParagraphe 
              key={subkey}
              subkey={subkey}
              subitem={subitem}
              tutoriel={item.tutoriel}
              {...props} />
          )
        }else if(subitem.type==='map'){
          return ( 
            <MapParagraphe 
              key={subkey}
              subkey={subkey}
              subitem={subitem}
              tutoriel={item.tutoriel}
              {...props} />
          )
        }else if(subitem.type==='accordion'){
          return ( 
            <div key={subkey} className={'contenu' + (safeUiArray(props.keyValue, subkey, "isHover") ? ' isHovered' : '')} onMouseEnter={(e)=>props.updateUIArray(props.keyValue, subkey, 'isHover', true, e)}>
              <Row className="relative-position">
                <Col lg="12" md="12" sm="12" xs="12" className="accordeon-col">
                  <div className="title-bloc">
                    <Button 
                      id="accordion-header"  
                      className={"text-left " + (safeUiArray(props.keyValue, subkey, 'accordion') ? "active": "inactive")} 
                      onMouseUp={() => props.disableEdit && props.updateUIArray(props.keyValue, subkey, 'accordion', !safeUiArray(props.keyValue, subkey, 'accordion'))} 
                      aria-expanded={safeUiArray(props.keyValue, subkey, 'accordion')} 
                      aria-controls={"collapse" + props.keyValue + "-" + subkey}>
                      <h5>
                        <span className="accordion-text">
                          <ContentEditable
                            id={props.keyValue}
                            data-subkey={subkey}
                            data-target='title'
                            html={subitem.title || ""}  // innerHTML of the editable div
                            disabled={props.disableEdit}       // use true to disable editing
                            onChange={props.handleMenuChange} // handle innerHTML change
                            onMouseUp={e=> !props.disableEdit && e.stopPropagation()} />
                        </span>
                        {props.disableEdit && 
                          <EVAIcon name={"chevron-" + (safeUiArray(props.keyValue, subkey, 'accordion') ? "up" : "down") + "-outline"} size="large" fill={variables.darkColor} />}
                      </h5>
                    </Button>
                    {!props.disableEdit && 
                      <EVAIcon onClick={() => props.removeItem(props.keyValue, subkey)} className="delete-icon ml-10 cursor-pointer" name="close-circle" fill={variables.noir} size="xlarge" />}
                  </div>
                  <Collapse className="contenu-accordeon" isOpen={safeUiArray(props.keyValue, subkey, 'accordion')} data-parent="#accordion" id={"collapse" + props.keyValue + "-" + subkey} aria-labelledby={"heading" + props.keyValue + "-" + subkey}>
                    <EditableParagraph 
                      keyValue={props.keyValue} 
                      subkey={subkey} 
                      target='content'
                      handleMenuChange={props.handleMenuChange}
                      onEditorStateChange={props.onEditorStateChange}
                      handleContentClick={props.handleContentClick}
                      disableEdit={props.disableEdit}
                      tutoriel={item.tutoriel}
                      addItem={props.addItem}
                      {...subitem} />
                  </Collapse>
                </Col>
                {!props.sideView && props.disableEdit && 
                  <Col lg="2" md="2" sm="2" xs="2" className='toolbar-col'>
                    <QuickToolbar
                      show={safeUiArray(props.keyValue, subkey, 'isHover')}
                      keyValue={props.keyValue}
                      subkey={subkey}
                      {...props} />
                  </Col>}
              </Row>
            </div>
          )
        }else{
          return ( 
            <div key={subkey} className={'contenu borderColor-darkColor' + (safeUiArray(props.keyValue, subkey, "isHover") ? ' isHovered' : '')} onMouseEnter={()=>props.updateUIArray(props.keyValue, subkey, 'isHover')}>
              <Row className="relative-position">
                <Col lg="12" md="12" sm="12" xs="12">
                  <h4>
                    <ContentEditable
                      id={props.keyValue}
                      data-subkey={subkey}
                      data-target='title'
                      className="display-inline-block"
                      html={subitem.title || ""}  // innerHTML of the editable div
                      disabled={props.disableEdit}       // use true to disable editing
                      onChange={props.handleMenuChange} // handle innerHTML change
                    />
                    {!props.disableEdit && 
                      <EVAIcon onClick={() => props.removeItem(props.keyValue, subkey)} className="delete-icon ml-10 cursor-pointer" name="minus-circle-outline" fill={variables.noir} />}
                  </h4>
                  <EditableParagraph 
                    keyValue={props.keyValue} 
                    subkey={subkey} 
                    target='content'
                    handleMenuChange={props.handleMenuChange}
                    onEditorStateChange={props.onEditorStateChange}
                    handleContentClick={props.handleContentClick}
                    disableEdit={props.disableEdit}
                    tutoriel={item.tutoriel}
                    addItem={props.addItem}
                    {...subitem} />
                  <br />
                </Col>
                {!props.sideView && props.disableEdit && 
                  <Col lg="2" md="2" sm="2" xs="2" className='toolbar-col'>
                    <QuickToolbar
                      show={safeUiArray(props.keyValue, subkey, "isHover")}
                      keyValue={props.keyValue}
                      subkey={subkey}
                      {...props} />
                  </Col>}
              </Row>
            </div>
          )
        }}
      )}
      {!props.disableEdit && item.type==='cards' && item.children && item.children.length>0 && item.children[0].type === 'card' && 
        <PlusCard {...props} />}
    </div>
)
}

export default contenuParagraphe;