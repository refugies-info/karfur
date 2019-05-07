import React from 'react';

import './Modal.css';
import Backdrop from '../UI/Backdrop/Backdrop';

const modal = (props) => {
  if(props.show){
    return(
      <>
        <Backdrop show={props.show} clicked={props.modalClosed} />
        <div
          className={"Modal " + props.classe}
          style={{
              transform: props.show ? 'translateY(0)' : 'translateY(-100vh)',
              opacity: props.show ? '1' : '0'
          }}>
          {props.children}
        </div>
      </>
    )
  }else{
    return false
  }
}

export default modal;