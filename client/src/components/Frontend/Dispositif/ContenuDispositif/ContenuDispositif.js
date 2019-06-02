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
          <Row className="relative-position" onMouseEnter={()=>props.updateUIArray(key, null, 'isHover')}>
            <Col lg="12" md="12" sm="12" xs="12">
              <a className="anchor" id={'item-head-'+key}></a>
              <h3 className="contenu-title">{item.title}</h3>
              {item.content && item.content!=='null' && <EditableParagraph 
                idx={key} 
                handleMenuChange={props.handleMenuChange}
                onEditorStateChange={props.onEditorStateChange}
                handleContentClick={props.handleContentClick}
                disableEdit={props.disableEdit}
                {...item}/>
              }
            </Col>
            <Col lg="2" md="2" sm="2" xs="2" className='toolbar-col'>
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