import React from 'react';
import { Col, Row } from 'reactstrap';

import EditableParagraph from '../EditableParagraph/EditableParagraph'
import QuickToolbar from '../../../../containers/Dispositif/QuickToolbar/QuickToolbar';
import ContenuParagraphe from '../ContenuParagraphe/ContenuParagraphe';

const contenuDispositif = (props) => {
  return(
    props.menu.map((item, key) => {
      return ( 
        <div key={key} className='contenu-wrapper'>
          <Row className="relative-position" onMouseEnter={()=>props.hoverOn(key)}>
            <Col lg="12">
              <a className="anchor" id={'item-head-'+key}></a>
              <h3>{item.title}</h3>
              {item.content && <EditableParagraph 
                idx={key} 
                handleMenuChange={props.handleMenuChange}
                onEditorStateChange={props.onEditorStateChange}
                handleContentClick={props.handleContentClick}
                disableEdit={props.disableEdit}
                {...item}/>
              }
            </Col>
            <Col className='toolbar-col'>
              <QuickToolbar 
                show={props.uiArray[key].isHover}
                keyValue={key}
                {...props} />
            </Col>
          </Row>
          
          <ContenuParagraphe
            item={item}
            keyValue={key}
            {...props} />
          
          <a className="anchor" id={'item-' + key}></a>
        </div>
      )}
    )
  )
}

export default contenuDispositif;