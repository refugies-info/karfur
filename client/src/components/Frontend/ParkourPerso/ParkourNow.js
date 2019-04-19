import React from 'react';
import { Col, Row, Button, Card, CardBody, CardFooter, FormGroup, Input, Label } from 'reactstrap';
import {NavLink} from 'react-router-dom';

import CustomCard from '../../UI/CustomCard/CustomCard';
import {randomColor} from '../../Functions/ColorFunctions';

import './ParkourNow.scss';

const parkourNow = (props) => {
  return(
    <div className="parkour-now slide-in-bottom">
      <h2>Démarches :</h2>
      <Row>
        {props.demarches.slice(props.etape,props.etape+3).map((demarche, key) => {
          return (
            <Col xs="12" sm="4" md="3" className="card-col" key={key}>
              <CustomCard>
                <NavLink to={'/'}>
                  <CardBody>
                    <h3>{demarche.title}</h3>
                    <p>Duis amet in irure dolore ut.</p>
                  </CardBody>
                </NavLink>
                <CardFooter className={"align-right bg-"+randomColor()}>
                  {demarche.title.substr(0,35) + (demarche.title.length>35 ? '...' : '')}
                  <FormGroup check className="container">
                    <Input className="form-check-input" type="checkbox" id={"checkbox" + key} name={"checkbox" + key} value={"checkbox" + key} checked={demarche.checked} onChange={()=>props.checkItem(key, 'demarche')} />
                    <span className="checkmark" onClick={()=>props.checkItem(key, 'demarche', props.etape)}></span>
                  </FormGroup>
                </CardFooter>
              </CustomCard>
            </Col>
          )}
        )}
        <Col xs="12" sm="2" md="1"></Col>
        <Col xs="12" sm="2" md="1" className="card-col">
          <NavLink to="/"><i className="fa fa-chevron-right more-icon"></i></NavLink>
        </Col>
      </Row>
      <h2>Dispositifs :</h2>
      <Row>
        {props.dispositifs.map((dispositif, key) => {
          return (
            <Col xs="12" sm="4" md="3" className="card-col" key={dispositif._id}>
              <CustomCard>
                <NavLink to={'/dispositif/'+dispositif._id}>
                  <CardBody>
                    <h3>{dispositif.titreInformatif}</h3>
                    <p>{dispositif.abstract}</p>
                  </CardBody>
                </NavLink>
                <CardFooter className={"align-right bg-"+randomColor()}>
                  {dispositif.titreMarque.substr(0,35) + (dispositif.titreMarque.length>35 ? '...' : '')}
                  <FormGroup check className="container">
                    <Input className="form-check-input" type="checkbox" id={"checkbox" + key} name={"checkbox" + key} value={"checkbox" + key} checked={dispositif.checked} onChange={()=>props.checkItem(key, 'dispositif')} />
                    <span className="checkmark" onClick={()=>props.checkItem(key, 'dispositif')}></span>
                  </FormGroup>
                </CardFooter>
              </CustomCard>
            </Col>
          )}
        )}
        <Col xs="12" sm="2" md="1"></Col>
        <Col xs="12" sm="2" md="1" className="card-col">
          <NavLink to="/dispositifs"><i className="fa fa-chevron-right more-icon"></i></NavLink>
        </Col>
      </Row>
      <h2>Bon à savoir :</h2>
      <Row>
        {props.articles.map((article, key) => {
          return (
            <Col xs="12" sm="4" md="3" className="card-col" key={article._id}>
              <CustomCard>
                <NavLink to={'/article/'+article._id}>
                  <CardBody>
                    <h3>{article.title}</h3>
                    <p>{}</p>
                  </CardBody>
                </NavLink>
                <CardFooter className={"align-right bg-"+randomColor()}>
                  {article.title.substr(0,35) + (article.title.length>35 ? '...' : '')}
                  <FormGroup check className="container">
                    <Input className="form-check-input" type="checkbox" id={"checkbox" + key} name={"checkbox" + key} value={"checkbox" + key} checked={article.checked} onChange={()=>props.checkItem(key, 'article')} />
                    <span className="checkmark" onClick={()=>props.checkItem(key, 'article')}></span>
                  </FormGroup>
                </CardFooter>
              </CustomCard>
            </Col>
          )}
        )}
        <Col xs="12" sm="2" md="1"></Col>
        <Col xs="12" sm="2" md="1" className="card-col">
          <NavLink to="/articles"><i className="fa fa-chevron-right more-icon"></i></NavLink>
        </Col>
      </Row>
    </div>
  )
}

export default parkourNow;