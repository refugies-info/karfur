import React from 'react';
import { Col, Row } from 'reactstrap';

import EditableParagraph from '../EditableParagraph/EditableParagraph'
import QuickToolbar from '../../../../containers/Dispositif/QuickToolbar/QuickToolbar';
import ContenuParagraphe from '../ContenuParagraphe/ContenuParagraphe';

const contenuDispositif = (props) => {
  return(
    props.menu.map((item, key) => {
      return ( 
        <div key={key} className='contenu-wrapper' id={"contenu-" + key}>
          <Row className="relative-position nopadding">
            <Col lg="12" md="12" sm="12" xs="12" className={'contenu borderColor-darkColor' + (props.uiArray[key].isHover ? ' isHovered' : '')} onMouseEnter={()=>props.updateUIArray(key, null, 'isHover')}>
              <button className="anchor" id={'item-head-'+key}>{item.title}</button>
              <h3 className={"contenu-title color-darkColor" + (key !== 0 ? " mt-20": "")}>{item.title}</h3>
              {item.content!=='null' && <EditableParagraph 
                keyValue = {key}
                handleMenuChange={props.handleMenuChange}
                onEditorStateChange={props.onEditorStateChange}
                handleContentClick={props.handleContentClick}
                disableEdit={props.disableEdit}
                addItem={props.addItem}
                {...item}/>}
            </Col>
            {props.uiArray[key].isHover && 
              <Col lg="3" md="3" sm="3" xs="3" className='toolbar-col'>
                <QuickToolbar 
                  show={props.uiArray[key].isHover}
                  keyValue={key}
                  {...props} />
              </Col>}
          </Row>
          
          <ContenuParagraphe
            item={item}
            keyValue={key}
            {...props} />
          
          <button className="anchor" id={'item-' + key}>{item.title}</button>
        </div>
      )}
    )
  )
}

export default contenuDispositif;