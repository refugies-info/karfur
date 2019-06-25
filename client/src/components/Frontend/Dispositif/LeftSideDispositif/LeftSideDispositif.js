import React from 'react';
import { ListGroup, ListGroupItem, Button, Spinner } from 'reactstrap';
import Scrollspy from 'react-scrollspy';
import Icon from 'react-eva-icons';
import ReactToPrint from 'react-to-print';

const leftSideDispositif = (props) => {
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
        <Button className="go-button backgroundColor-darkColor">
          <Icon name="external-link-outline" fill="#F0E8F5" />
          <span>Voir le site</span>
        </Button>
        <Button className="print-button" onClick={props.createPdf}>
          <Icon name="download-outline" fill="#3D3D3D" />
          <span>Télécharger en PDF</span>
          {props.showSpinner && <Spinner color="success" className="margin-left-8" />}
        </Button>
        <Button className="print-button" href={"mailto:mail@example.org?subject=Dispositif" + ((props.content && props.content.titreMarque) ? (' - ' + props.content.titreMarque) : '') + "&body=Le dispositif est disponible dans votre dossier téléchargement"} onClick={props.createPdf}>
          <Icon name="paper-plane-outline" fill="#3D3D3D" />
          <span>Envoyer par mail</span>
        </Button>
        <ReactToPrint
          trigger={() => 
            <Button className="print-button">
              <Icon name="printer-outline" fill="#3D3D3D" />
              <span>Imprimer</span>
            </Button>}
          content={() => props.newRef.current}
          onBeforePrint={props.openAllAccordions}
        />
      </div>
    </div>
  )
}

export default leftSideDispositif;