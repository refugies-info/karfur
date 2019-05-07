import React from 'react';
import { Col, Row, Button, Collapse } from 'reactstrap';
import ContentEditable from 'react-contenteditable';

import EditableParagraph from '../EditableParagraph/EditableParagraph'
import QuickToolbar from '../../../../containers/Dispositif/QuickToolbar/QuickToolbar';
import CardParagraphe, {PlusCard} from '../../../../containers/Dispositif/CardParagraphe/CardParagraphe';

const contenuParagraphe = (props) => {
  let item=props.item;
  return(
    <div className={item.type==='cards' ? 'row cards' : 'sous-paragraphe'}>
      {item.children && item.children.map((subitem, subkey) => {
        if(subitem.type==='card'){
          return ( 
            <CardParagraphe 
              key={subkey}
              subkey={subkey}
              subitem={subitem}
              {...props} />
          )
        }else if(subitem.type==='accordion'){
          return ( 
            <div key={subkey} onMouseEnter={()=>props.hoverOn(props.keyValue, subkey)}>
              <Row className="relative-position">
                <Col lg="12">
                  <Button id="accordion-header" color="warning" className="text-left" onClick={(e) => props.toggleAccordion(0,e)} aria-expanded={props.accordion[0]} aria-controls="collapseOne">
                    <h5>
                      <div className="accordion-number">{subkey+1}</div>
                      <span className="accordion-text">
                        <ContentEditable
                          id='title'
                          subkey={subkey}
                          html={subitem.title}  // innerHTML of the editable div
                          disabled={props.disableEdit}       // use true to disable editing
                          onChange={props.handleMenuChange} // handle innerHTML change
                          onClick={e=>e.preventDefault()} // handle innerHTML change
                        />
                      </span>
                      <div className="accordion-expand">+</div>
                    </h5>
                  </Button>
                  <Collapse isOpen={props.accordion[0]} data-parent="#accordion" id="collapseOne" aria-labelledby="headingOne">
                    <EditableParagraph 
                      idx={props.keyValue} 
                      subkey={subkey} 
                      handleMenuChange={props.handleMenuChange}
                      onEditorStateChange={props.onEditorStateChange}
                      handleContentClick={props.handleContentClick}
                      disableEdit={props.disableEdit}
                      {...subitem} />
                  </Collapse>
                </Col>
                <Col className='toolbar-col'>
                  <QuickToolbar
                    show={props.uiArray[props.keyValue] && props.uiArray[props.keyValue].children && props.uiArray[props.keyValue].children.length>subkey && props.uiArray[props.keyValue].children[subkey] && props.uiArray[props.keyValue].children[subkey].isHover}
                    keyValue={props.keyValue}
                    subkey={subkey}
                    {...props} />
                </Col>
              </Row>
            </div>
          )
        }else{
          return ( 
            <div key={subkey} onMouseEnter={()=>props.hoverOn(props.keyValue, subkey)}>
              <Row className="relative-position">
                <Col lg="12">
                  <h4>{subitem.title}</h4>
                  <EditableParagraph 
                    idx={props.keyValue} 
                    subkey={subkey} 
                    handleMenuChange={props.handleMenuChange}
                    onEditorStateChange={props.onEditorStateChange}
                    handleContentClick={props.handleContentClick}
                    disableEdit={props.disableEdit}
                    {...subitem} />
                  <br />
                </Col>
                <Col className='toolbar-col'>
                  <QuickToolbar
                    show={props.uiArray[props.keyValue] && props.uiArray[props.keyValue].children && props.uiArray[props.keyValue].children.length>subkey && props.uiArray[props.keyValue].children[subkey] && props.uiArray[props.keyValue].children[subkey].isHover}
                    keyValue={props.keyValue}
                    subkey={subkey}
                    {...props} />
                </Col>
              </Row>
            </div>
          )
        }}
      )}
      {item.type==='cards' && item.children && item.children.length>0 && item.children[0].type === 'card' && 
        <PlusCard {...props} />}
    </div>
)
}

export default contenuParagraphe;