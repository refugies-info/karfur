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
          onUpdate={props.handleScrollSpy}>
          {props.menu.map((item, key) => {
            return ( 
              <div key={key} className="list-item-wrapper">
                <ListGroupItem tag="a" data-toggle="list" action
                  href={'#item-head-' + key} 
                  onClick={() => props.onMenuNavigate(key)} >
                  {item.title}
                </ListGroupItem>
                {/* {item.children &&
                  <Collapse isOpen={props.menu[key].accordion} data-parent="#accordion" id="collapseOne" aria-labelledby="headingOne">
                    <ListGroup>
                      {item.children.map((subitem, subkey) => {
                        return ( 
                          <div key={subkey}>
                            <ListGroupItem 
                              tag="a" 
                              action 
                              href={'#item-head-' + key + '-sub-' + subkey} >
                              {subitem.title}
                            </ListGroupItem>
                          </div>
                        )}
                      )}
                    </ListGroup>
                  </Collapse>
                } */}
              </div>
            )}
          )}
        </Scrollspy>
      </ListGroup>

      <div className="print-buttons">
        <Button className="print-button" onClick={props.createPdf}>
          <Icon name="download-outline" fill="#3D3D3D" />
          <span>Télécharger en PDF</span>
          {props.showSpinner && <Spinner color="success" />}
        </Button>
        <Button className="print-button" onClick={props.createPdf}>
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