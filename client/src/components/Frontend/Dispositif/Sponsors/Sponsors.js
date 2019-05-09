import React from 'react';
import { Row, Col, Input, Spinner } from 'reactstrap';
import Icon from 'react-eva-icons';

import './Sponsors.scss';

const sponsors = (props) => {
  return (
    <Row className="sponsor-footer">
      {props.sponsors && props.sponsors.map((sponsor, key) => {
        return (
          <Col key={key} className="sponsor-col">
            <div className="image-wrapper">
              <img className="sponsor-img" src={sponsor.src} alt={sponsor.alt}/>
              <div className="delete-icon" onClick={()=>props.deleteSponsor(key)}>
                <Icon name="minus-circle-outline" fill="#0D1C2E" size="xlarge"/>
              </div>
            </div>
          </Col>
        )}
      )}
      
      <Col>
        {props.loading ? 
          <Spinner color="green" className="animated fadeIn fadeOut" />
          :
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
        }
      </Col>
    </Row>
  )
}

export default sponsors;