import React from 'react';
import { Col, Card, CardBody, CardFooter, Button, Spinner } from 'reactstrap';

import EVAIcon from '../../../UI/EVAIcon/EVAIcon';
import FSwitch from '../../../FigmaUI/FSwitch/FSwitch';
import SVGIcon from '../../../UI/SVGIcon/SVGIcon';
import FButton from '../../../FigmaUI/FButton/FButton';

const topRightHeader = (props) => {
  const userIsSponsor = ((((props.mainSponsor || {}).membres || []).find(x => x.userId=== props.userId) || {}).roles || []).some(y => y==="administrateur" || y==="contributeur")
  if(props.status==="En attente" && userIsSponsor ){return(
    <Col lg="6" md="6" sm="12" xs="12" className="top-right">
      <Card>
        <CardBody className="backgroundColor-lightColor">
          <span className="validate-header">Souhaitez-vous récupérer ce contenu ?</span>
          <FButton type="validate" className="mt-10 full-width" onClick={()=>props.toggleModal(true, "responsable")}>Oui</FButton>
          <FButton type="error" className="mt-10 full-width" onClick={()=>props.update_status("Rejeté structure")}>Non</FButton>
        </CardBody>
        <CardFooter className="color-darkColor cursor-pointer" onClick={props.toggleDispositifCreateModal}>
          <SVGIcon className="mr-8 fill-darkColor" name="radio" />
          Besoin d'aide ?
        </CardFooter>
      </Card>
    </Col>
  )}else if(props.disableEdit){
    return(
      <Col lg="6" md="6" sm="12" xs="12" className="top-right">
        {!props.translating && (props.isAuthor || props.admin || userIsSponsor) && 
          <div className="top-icon-wrapper mr-10" onClick={props.editDispositif}>
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
          <CardBody className="backgroundColor-darkColor">
            <FSwitch content="Tutoriel" checked={props.withHelp} onClick={props.toggleHelp} />
            <Button className="save-btn text-dark" onClick={()=>props.valider_dispositif('Brouillon')}>Sauvegarder</Button>
            <Button className="publish-btn" onClick={props.toggleDispositifValidateModal}>Publier</Button>
          </CardBody>
          <CardFooter className="color-darkColor cursor-pointer" onClick={props.toggleDispositifCreateModal}>
            <SVGIcon className="mr-8 fill-darkColor" name="radio" />
            Besoin d'aide ?
          </CardFooter>
        </Card>
      </Col>
    )
  }
}

export default topRightHeader;