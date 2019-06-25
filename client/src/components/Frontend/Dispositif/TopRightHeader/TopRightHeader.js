import React from 'react';
import { Col, Card, CardBody , Button, Spinner } from 'reactstrap';

import { AppSwitch } from '@coreui/react'

import EVAIcon from '../../../UI/EVAIcon/EVAIcon';

const topRightHeader = (props) => {
  if(props.disableEdit){
    return(
      <Col lg="6" md="6" sm="12" xs="12" className="top-right">
        {props.isAuthor && 
          <div className="top-icon-wrapper" onClick={props.editDispositif}>
            <EVAIcon name="edit-outline" fill="#3D3D3D" id="editBtn" />
          </div>}
        <div className="top-icon-wrapper" onClick={props.bookmarkDispositif}>
          {props.showSpinnerBookmark ?
            <Spinner color="success" /> :
            <EVAIcon name={"bookmark" + (props.pinned ? "" : "-outline")} fill={"#3D3D3D"} id="bookmarkBtn" />}
        </div>
      </Col>
    )
  }else{
    return(
      <Col lg="6" md="6" sm="12" xs="12" className="top-right">
        <Card>
          <CardBody>
            {/* <div className="switch-wrapper">
              <AppSwitch className='mx-1' variant='pill' color='dark' checked={props.withHelp} onClick={props.toggleHelp} />
              Aide activée
            </div> */}
            <Button className="save-btn text-dark" onClick={()=>props.valider_dispositif('Brouillon')}>Sauvegarder</Button>
            <Button className="publish-btn" onClick={props.toggleDispositifValidateModal}>Publier</Button>
          </CardBody>
        </Card>
      </Col>
    )
  }
}

export default topRightHeader;