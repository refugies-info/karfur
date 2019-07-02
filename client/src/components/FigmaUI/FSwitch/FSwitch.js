import React from 'react';
import { AppSwitch } from '@coreui/react'

import './FSwitch.scss';

const fSwitch = props => {
  return(
    <div className="switch-wrapper">
      <AppSwitch className='mr-10' outline variant='pill' color='light' {...props} />
      Tutoriel
    </div>
  )
}

export default fSwitch;