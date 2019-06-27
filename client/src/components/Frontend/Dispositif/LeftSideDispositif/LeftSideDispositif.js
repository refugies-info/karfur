import React from 'react';
import { ListGroup, ListGroupItem, Spinner, InputGroup, Input } from 'reactstrap';
import Scrollspy from 'react-scrollspy';
import Icon from 'react-eva-icons';
import ReactToPrint from 'react-to-print';

import EVAIcon from '../../../UI/EVAIcon/EVAIcon';
import FButton from '../../../FigmaUI/FButton/FButton';

const leftSideDispositif = (props) => {
  const onLinkClicked = props.disableEdit ? null :props.toggleInputBtnClicked ;
  return(
    <div className="sticky-affix">
      <ListGroup className="list-group-flush">
        <Scrollspy 
          items={props.menu.map((_,key) => 'item-'+key) }
          currentClassName="active"
          onUpdate={props.handleScrollSpy}
          offset={-60}>
          {props.menu.map((item, key) => {
            return ( 
              <div key={key} className="list-item-wrapper">
                <ListGroupItem tag="a" data-toggle="list" action
                  href={'#item-head-' + key} 
                  onClick={() => props.onMenuNavigate(key)} >
                  {item.title}
                </ListGroupItem>
              </div>
            )}
          )}
        </Scrollspy>
      </ListGroup>

      <div className="print-buttons">
        <div className="link-wrapper">
          {props.inputBtnClicked ?
            <FButton className="input-btn">
              <InputGroup>
                <EVAIcon className="link-icon" name="link-outline" fill="#828282"/>
                <Input placeholder="Copiez-collez ici le lien vers votre site" />
              </InputGroup>
            </FButton>
            :
            <FButton type="theme" name="external-link-outline" onClick={onLinkClicked}>
              Voir le site
            </FButton>}
        </div>
        <FButton type="light-action" onClick={props.createPdf} name="download-outline">
          Télécharger en PDF
          {props.showSpinner && <Spinner color="success" className="margin-left-8" />}
        </FButton>
        <FButton type="light-action" href={"mailto:mail@example.org?subject=Dispositif" + ((props.content && props.content.titreMarque) ? (' - ' + props.content.titreMarque) : '') + "&body=Le dispositif est disponible dans votre dossier téléchargement"} onClick={props.createPdf} name="paper-plane-outline">
          Envoyer par mail
        </FButton>
        <ReactToPrint
          trigger={() => 
            <FButton type="light-action" name="printer-outline">
              Imprimer
            </FButton>}
          content={() => props.newRef.current}
          onBeforePrint={props.openAllAccordions} />
      </div>
    </div>
  )
}

export default leftSideDispositif;