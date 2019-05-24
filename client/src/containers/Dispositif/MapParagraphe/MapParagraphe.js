import React, {PureComponent} from 'react';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Button } from 'reactstrap';

import MapComponent from '../../../components/Frontend/Dispositif/Map/Map';

import './MapParagraphe.scss';
import MapModal from '../../../components/Modals/MapModal/MapModal';

class MapParagraphe extends PureComponent {
  state= {
    isMarkerShown: new Array(this.props.subitem.markers.length).fill(true),
    showingInfoWindow: new Array(this.props.subitem.markers.length).fill(false), 
    isDropdownOpen: false,
    dropdownValue:this.props.subitem.markers[0].ville,
    zoom: 5,
    center:{ lat: 48.856614, lng: 2.3522219 },
    markers:this.props.subitem.markers,
    showModal:false,
  }

  componentDidMount (){
    if(!this.props.disableEdit && !this.props.subitem.isMapLoaded){
      this.setState({showModal:true})
    }
  }

  componentDidUpdate (){
    if(!this.props.disableEdit && !this.props.subitem.isMapLoaded){
      this.setState({showModal:true})
    }
  }

  handleMarkerClick = (e, marker, key) => {
    this.setState({
      showingInfoWindow: this.state.showingInfoWindow.map((x, id) => id===key ? !x : false)
    });
  }

  onClose = () => {
    this.setState({
      showingInfoWindow: new Array(this.state.markers.length).fill(false), 
    });
  }

  toggleDropdown = (e) => {
    this.setState({ isDropdownOpen: !this.state.isDropdownOpen })
  };

  toggleModal = () => {
    if(this.state.showModal){ this.props.disableIsMapLoaded(this.props.keyValue, this.props.subkey); }
    this.setState(prevState => ({ showModal: !prevState.showModal }));
  }

  selectLocation = key => {
    this.setState({
      dropdownValue:this.state.markers[key].ville, 
      zoom: 7,
      center: {lat:parseFloat(this.state.markers[key].latitude), lng: parseFloat(this.state.markers[key].longitude)},
      showingInfoWindow: this.state.showingInfoWindow.map((x, id) => id===key)
    });
  }

  handleFileLoaded = (csvArray) => {
    csvArray=csvArray.filter(x=> x.length>1)
    let markers=[];
    if(csvArray && csvArray.length>1 && csvArray[0].length>1){
      let headers = csvArray[0].filter(x => x!=="");
      for (var i = 1; i < csvArray.length; i++) {
        let line={};
        for (var j = 0; j < headers.length; j++) {
          line[headers[j].toLowerCase()] = csvArray[i][j]
        }
        markers.push(line);
      }
      this.setState({
        markers,
        isMarkerShown: new Array(markers.length).fill(true),
        showingInfoWindow: new Array(markers.length).fill(false), 
        dropdownValue: markers[0].ville
      })
    }
  }
  handleError = (e) => console.log(e)

  render(){
    return(
      <div className="map-paragraphe">
        <div className="where-header">
          <b>Où souhaitez-vous vous engager ?</b>
          <ButtonDropdown isOpen={this.state.isDropdownOpen} toggle={this.toggleDropdown} className="content-title">
            <DropdownToggle caret color="transparent" className="dropdown-btn">
              <span>{this.state.dropdownValue}</span>
            </DropdownToggle>
            <DropdownMenu>
              {this.state.markers.map((marker, key) => {
                return (
                  <DropdownItem key={key} onClick={()=>this.selectLocation(key)}>
                    {marker.ville}
                  </DropdownItem>
                )}
              )}
            </DropdownMenu>
          </ButtonDropdown>
          {!this.props.disableEdit &&
            <Button color="warning" onClick={this.toggleModal}>Changer le fichier de données</Button>}
        </div>
        <div className="map-content">
          <MapComponent
            onMarkerClick={this.handleMarkerClick}
            onClose={this.onClose}
            markers={this.state.markers || []}
            toggleDropdown={this.toggleDropdown}
            {...this.state}
          />
        </div>

        <MapModal 
          showModal={this.state.showModal} 
          toggleModal={this.toggleModal}
          handleFileLoaded={this.handleFileLoaded}
          handleError={this.handleError}
          toggleModal={this.toggleModal} />
      </div> 
    )
  }
}

export default MapParagraphe;