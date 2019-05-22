import React from 'react';
import { Col, Card, CardBody , Button } from 'reactstrap';
import Icon from 'react-eva-icons';
import { AppSwitch } from '@coreui/react'

import AudioBtn from '../../../../containers/UI/AudioBtn/AudioBtn';
import EVAIcon from '../../../UI/EVAIcon/EVAIcon';

const topRightHeader = (props) => {
  if(props.disableEdit){
    return(
      <Col className="top-right">
        <AudioBtn />
        <div className="bookmark-icon-wrapper" onClick={props.toggleBookmarkModal}>
          <EVAIcon name={"bookmark-outline"} fill={"#3D3D3D"} id="bookmarkBtn" />
        </div>
      </Col>
    )
  }else{
    return(
      <Col className="top-right">
        <Card>
          <CardBody>
            <div className="switch-wrapper">
              <AppSwitch className='mx-1' variant='pill' color='dark' checked={props.withHelp} onClick={props.toggleHelp} />
              Aide activée
            </div>
            <Button className="save-btn text-dark" onClick={()=>props.valider_dispositif('Brouillon')}>Sauvegarder</Button>
            <Button className="publish-btn" onClick={props.toggleDispositifValidateModal}>Publier</Button>
          </CardBody>
        </Card>
      </Col>
    )
  }
}

export default topRightHeader;