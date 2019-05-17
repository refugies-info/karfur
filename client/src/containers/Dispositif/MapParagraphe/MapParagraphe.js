import React, {Component} from 'react';
import { Col } from 'reactstrap';

import MapComponent from '../../../components/Frontend/Dispositif/Map/Map';

import './MapParagraphe.scss';

class MapParagraphe extends Component {
  state= {
    isMarkerShown: false,
  }
  componentDidMount (){
    this.delayedShowMarker();
  }

  delayedShowMarker = () => {
    setTimeout(() => {
      this.setState({ isMarkerShown: true })
    }, 3000)
  }

  handleMarkerClick = () => {
    this.setState({ isMarkerShown: false })
    this.delayedShowMarker()
  }

  render(){
    return(
      <>
        <MapComponent
          isMarkerShown={this.state.isMarkerShown}
          onMarkerClick={this.handleMarkerClick}
          markers={this.props.subitem.markers}
        />
      </> 
    )
  }
}

export default MapParagraphe;