import React from 'react';
import { Row, Col, Input, Spinner } from 'reactstrap';
import Icon from 'react-eva-icons';

import './Sponsors.scss';

const sponsors = (props) => {
  let plusOrLoad = () => {
    if(props.loading){
      return <Col><Spinner color="green" className="animated fadeIn fadeOut" /></Col>
    }else if(!props.disableEdit){
      return (
        <Col>
          <div className="add-sponsor">
            <Input 
              className="file-input"
              type="file"
              id="picture" 
              name="user" 
              accept="image/*"
              onChange = {props.handleFileInputChange} />
            <span className="add-sign">+</span>
          </div>
        </Col>
      )
    }else{return false;}
  }

  return (
    <div className="sponsor-footer">
      <h5 className="color-darkColor">{props.t("Dispositif.Structures")}</h5>
      <Row className="sponsor-images">
        {props.sponsors && props.sponsors.map((sponsor, key) => {
          return (
            <Col key={key} className="sponsor-col">
              <div className="image-wrapper">
                <img className="sponsor-img" src={sponsor.src} alt={sponsor.alt}/>
                {!props.disableEdit && 
                  <div className="delete-icon" onClick={()=>props.deleteSponsor(key)}>
                    <Icon name="minus-circle-outline" fill="#0D1C2E" size="xlarge"/>
                  </div>}
              </div>
            </Col>
          )}
        )}
        
        {plusOrLoad()}
      </Row>
    </div>
  )
}

export default sponsors;