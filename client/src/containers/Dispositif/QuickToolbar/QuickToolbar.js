import React, {Component} from 'react';
import track from 'react-tracking';
import { Card, CardBody, Row, Col, Tooltip, Button } from 'reactstrap';
import { connect } from 'react-redux';
import h2p from 'html2plaintext';

import SVGIcon from '../../../components/UI/SVGIcon/SVGIcon';
import EVAIcon from '../../../components/UI/EVAIcon/EVAIcon';
import * as actions from '../../../Store/actions/actionTypes';

import './QuickToolbar.scss'
import variables from '../Dispositif.scss'; //A changer

class QuickToolbar extends Component {
  state= {
    fill: new Array(4).fill(false),
    tooltipOpen: new Array(4).fill(false),
    isDropdownOpen:false,
    dropdownColor: new Array(4).fill("#FFFFFF")
  } 

  _hoverOn=(key)=> this.setState(prevState=>({fill: prevState.fill.map((_,i) => key===i)}));
  _hoverOff=()=> this.setState(prevState=>({fill: prevState.fill.map(() => false)}));
  toggleTooltip=(key,e)=> {this.setState(prevState=>({tooltipOpen: prevState.tooltipOpen.map((x,i) => key===i ? !x : false )}));}
  toggle = () => this.setState({isDropdownOpen:!this.state.isDropdownOpen})
  toggleColor = (key, hover) => this.setState(prevState=>({dropdownColor:prevState.dropdownColor.map((x,i)=> (i===key ? (hover ? "#3D3D3D" : "#FFFFFF") : "#FFFFFF"))}))

  _onClick=(id)=>{
    this.props.tracking.trackEvent({ action: 'click', label: 'btn click', value : this.props.disableEdit + "-" + id });
    if(this.props.disableEdit){
      if(id===0){ this.props.toggleModal(true, 'reaction'); }
      else if(id===1){ 
        let node=this.props.item;
        if(this.props.subkey !== undefined && this.props.subkey !== null && this.props.subkey >= 0 && node.children && node.children.length > 0){
          node = this.props.item.children[this.props.subkey]
        }
        this.props.readAudio(h2p(node.title), 'fr-fr', ()=>this.props.readAudio(h2p(node.content))); 
      }else if(id===2){ this.props.toggleModal(true, 'construction'); }
      else if(id===3){ this.props.toggleModal(true, 'construction');}
    }else{
      if(id===0){ this.props.handleContentClick(this.props.keyValue,true, this.props.subkey) }
      else if(id===2){ this.props.removeItem(this.props.keyValue, this.props.subkey) }
    }
  }

  render() {
    if(this.props.show){
      if(this.props.disableEdit){
        return(
          <Card className="quick-toolbar">
            <CardBody>
              <Row className="first-row">
                <Col lg="6" md="6" sm="12" xs="12" className="col-btn">
                  <Button className="btn-pill" id="eva-icon-0" onMouseEnter={()=>this._hoverOn(0)} onMouseLeave={this._hoverOff} onClick={()=>this._onClick(0)}>
                    <EVAIcon name={"message-circle" + (this.state.fill[0] ? '' : '-outline')} fill={variables.darkColor} className='icon-toolbar' />
                    <Tooltip className="dark-back" placement="top" isOpen={this.state.tooltipOpen[0]} target="eva-icon-0" toggle={(e)=>this.toggleTooltip(0,e)}>
                      réagir
                    </Tooltip>
                  </Button>
                </Col>
                <Col lg="6" md="6" sm="12" xs="12" className="col-btn">
                  <Button className="btn-pill" id="eva-icon-1" onMouseEnter={()=>this._hoverOn(1)} onMouseLeave={this._hoverOff} onClick={()=>this._onClick(1)}>
                    <EVAIcon name={"volume-up" + (this.state.fill[1] || this.props.ttsActive ? '' : '-outline')} fill={variables.darkColor} className='icon-toolbar'/>
                    <Tooltip className="dark-back" placement="top" isOpen={this.state.tooltipOpen[1]} target="eva-icon-1" toggle={()=>this.toggleTooltip(1)}>
                      écouter
                    </Tooltip>
                  </Button>
                </Col>
              </Row>
              {/* <Row className="second-row">
                <Col lg="6" md="6" sm="6" xs="6" className="col-btn">
                  <Button className="btn-pill" id="eva-icon-2" onMouseEnter={()=>this._hoverOn(2)} onMouseLeave={this._hoverOff} onClick={()=>this._onClick(2)}>
                    <EVAIcon name={"edit-2" + (this.state.fill[2] ? '' : '-outline')} fill={variables.lightColor} className='icon-toolbar'/>
                    <Tooltip className="light-back" placement="bottom" isOpen={this.state.tooltipOpen[2]} target="eva-icon-2" toggle={()=>this.toggleTooltip(2)}>
                      éditer
                    </Tooltip>
                  </Button>
                </Col>
                <Col lg="6" md="6" sm="6" xs="6" className="col-btn">
                  <Button className="btn-pill" id="eva-icon-3" onMouseEnter={()=>this._hoverOn(3)} onMouseLeave={this._hoverOff} onClick={()=>this._onClick(3)}>
                    <SVGIcon name="translate" fill={variables.lightColor} className='icon-toolbar'/>
                    <Tooltip className="light-back" placement="bottom" isOpen={this.state.tooltipOpen[3]} target="eva-icon-3" toggle={()=>this.toggleTooltip(3)}>
                      aider à traduire
                    </Tooltip>
                  </Button>
                </Col>
        </Row>*/}
            </CardBody>
          </Card>
        )
      }else{
        return false
        // return(
        //   <Card className="quick-toolbar">
        //     <CardBody>
        //       <Row className="custom-eva-size">
        //         <Col lg="4" id="eva-icon-0">
        //           <EVAIcon name={"edit-2" + (this.state.fill[0] ? '' : '-outline')} fill="#3D3D3D" onMouseEnter={()=>this._hoverOn(0)} onMouseLeave={this._hoverOff} onClick={()=>this._onClick(0)} className='icon-toolbar' />
        //           <Tooltip placement="top" isOpen={this.state.tooltipOpen[0]} target="eva-icon-0" toggle={(e)=>this.toggleTooltip(0,e)}>
        //             édition avancée
        //           </Tooltip>
        //         </Col>
        //         <Col lg="4" id="eva-icon-1">
        //           <Dropdown isOpen={this.state.isDropdownOpen} toggle={this.toggle}>
        //             <DropdownToggle>
        //               <EVAIcon name={"plus-circle" + (this.state.fill[1] ? '' : '-outline')} fill="#3D3D3D" onMouseEnter={()=>this._hoverOn(1)} onMouseLeave={this._hoverOff} onClick={()=>this._onClick(1)} className='icon-toolbar'/>
        //             </DropdownToggle>
        //             <DropdownMenu>
        //               <DropdownItem onClick={()=>this.props.addItem(this.props.keyValue, "paragraph", this.props.subkey)} id='paragraph' onMouseEnter={()=>this.toggleColor(0, true)} onMouseLeave={()=>this.toggleColor(0, false)}>
        //                 <SVGIcon name="paragraph" fill={this.state.dropdownColor[0]} id="0" />
        //                 Paragraphe
        //               </DropdownItem>
        //               <DropdownItem onClick={()=>this.props.addItem(this.props.keyValue, "card", this.props.subkey)} id='card' onMouseEnter={()=>this.toggleColor(1, true)} onMouseLeave={()=>this.toggleColor(1, false)}>
        //                 <EVAIcon name="grid-outline" fill={this.state.dropdownColor[1]} id="1"  />
        //                 Info Box
        //               </DropdownItem>
        //               <DropdownItem onClick={()=>this.props.addItem(this.props.keyValue, "map", this.props.subkey)} id='map' onMouseEnter={()=>this.toggleColor(2, true)} onMouseLeave={()=>this.toggleColor(2, false)}>
        //                 <EVAIcon name="pin-outline" fill={this.state.dropdownColor[2]} id="2"  />
        //                 Carte
        //               </DropdownItem>
        //               <DropdownItem onClick={()=>this.props.addItem(this.props.keyValue, "accordion", this.props.subkey)} id='accordion' onMouseEnter={()=>this.toggleColor(3, true)} onMouseLeave={()=>this.toggleColor(3, false)}>
        //                 <EVAIcon name="list-outline" fill={this.state.dropdownColor[3]} id="3"  />
        //                 Accordéon
        //               </DropdownItem>
        //             </DropdownMenu>
        //           </Dropdown>

                  
        //           <Tooltip placement="top" isOpen={this.state.tooltipOpen[1]} target="eva-icon-1" toggle={()=>this.toggleTooltip(1)}>
        //             ajouter
        //           </Tooltip>
        //         </Col>
        //         <Col lg="4" id="eva-icon-2">
        //           <EVAIcon name={"minus-circle" + (this.state.fill[2] ? '' : '-outline')} fill="#3D3D3D" onMouseEnter={()=>this._hoverOn(2)} onMouseLeave={this._hoverOff} onClick={()=>this._onClick(2)} className='icon-toolbar'/>
        //           <Tooltip placement="top" isOpen={this.state.tooltipOpen[2]} target="eva-icon-2" toggle={()=>this.toggleTooltip(2)}>
        //             effacer
        //           </Tooltip>
        //         </Col>

        //         {/* <Col lg="4" className={(this.state.fillColor[0] === '#828282' ? 'hovered': this.state.fillColor[0] === '#3D3D3D' ? 'clicked':'')} onMouseEnter={()=>this._hoverOn(0)} onMouseLeave={()=>this._hoverOff(0)} onClick={()=>this._onClick(1)} id='0' >
        //           <Icon name="edit" fill={this.state.fillColor[0]} />
        //         </Col>
        //         <Col lg="4" className={(this.state.fillColor[1] === '#828282' ? 'hovered': this.state.fillColor[1] === '#3D3D3D' ? 'clicked':'')} onMouseEnter={()=>this._hoverOn(0)} onMouseLeave={()=>this._hoverOff(0)} id='1'>
        //           <Dropdown isOpen={this.state.isDropdownOpen} toggle={this.toggle}>
        //             <DropdownToggle>
        //               <Icon name="plus-circle" fill={this.state.fillColor[1]} />
        //             </DropdownToggle>
        //             <DropdownMenu>
        //               <DropdownItem id='paragraph'>Paragraphe</DropdownItem>
        //               <DropdownItem id='card'>Card</DropdownItem>
        //               <DropdownItem id='accordion'>Accordéon</DropdownItem>
        //               <DropdownItem id='map'>Map</DropdownItem>
        //             </DropdownMenu>
        //           </Dropdown>
        //         </Col>
        //         <Col lg="4" className={(this.state.fillColor[2] === '#828282' ? 'hovered': this.state.fillColor[2] === '#3D3D3D' ? 'clicked':'')} onMouseEnter={()=>this._hoverOn(0)} onMouseLeave={()=>this._hoverOff(0)} onClick={()=>this._onClick(1)} id='2'>
        //           <Icon name="minus-circle" size="xlarge" fill={this.state.fillColor[2]} />
        //         </Col> */}
        //       </Row>
        //     </CardBody>
        //   </Card>
        // )
      }
    }else{
      return null
    }
  }
}

const mapStateToProps = (state) => {
  return {
    ttsActive: state.tts.ttsActive
  }
}

const mapDispatchToProps = dispatch => {
  return {
    toggleAudio: () => dispatch({type: actions.TOGGLE_TTS}),
  }
}

export default track({
    layout: 'QuickToolbar',
  }, { dispatchOnMount: false })(
    connect(mapStateToProps, mapDispatchToProps)(QuickToolbar)
  )