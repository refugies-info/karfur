import React, {Component} from 'react';
import { Card, CardBody, Row, Col, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import Icon from 'react-eva-icons';

import SVGIcon from '../../../components/UI/SVGIcon/SVGIcon';

import './QuickToolbar.scss'

class QuickToolbar extends Component {
  state= {
    fillColor: new Array(4).fill('#CDCDCD'),
    isDropdownOpen:false
  } 

  _hoverOn=(e)=>{
    let prevState= new Array(4).fill('#CDCDCD');
    prevState[e.target.id]= '#828282';
    this.setState({fillColor: prevState});
  }

  _hoverOff=()=>{
    this.setState({fillColor: new Array(4).fill('#CDCDCD')});
  }

  toggle=(e)=>{
    if(this.state.isDropdownOpen && e.target.id){
      this.props.addItem(this.props.keyValue, e.target.id, this.props.subkey)
    }
    this.setState({isDropdownOpen:!this.state.isDropdownOpen})
  }

  _onClick=(e)=>{
    let id=e.currentTarget.id;
    let prevState= new Array(4).fill('#CDCDCD');
    prevState[id]= '#3D3D3D';
    this.setState({fillColor: prevState});
    if(this.props.disableEdit){
      this.props.toggleModal(true, 'reaction');
    }else{
      if(id==='0'){ this.props.handleContentClick(this.props.keyValue,true, this.props.subkey) }
      else if(id==='2'){ this.props.removeItem(this.props.keyValue, this.props.subkey) }
    }
  }

  render() {
    if(this.props.show){
      if(this.props.disableEdit){
        return(
          <Card className="quick-toolbar">
            <CardBody>
              <Row>
                <Col lg="3">
                  <SVGIcon 
                    id='0' 
                    name="bubble" 
                    fill={this.state.fillColor[0]} 
                    onMouseEnter={this._hoverOn} 
                    onMouseLeave={this._hoverOff} 
                    onClick={this._onClick} 
                    className='icon-toolbar'/>
                </Col>
                <Col lg="3">
                  <SVGIcon id='1' name="warning" fill={this.state.fillColor[1]} onMouseEnter={this._hoverOn} onMouseLeave={this._hoverOff} onClick={this._onClick} className='icon-toolbar'/>
                </Col>
                <Col lg="3">
                  <SVGIcon id='2' name="pen" fill={this.state.fillColor[2]} onMouseEnter={this._hoverOn} onMouseLeave={this._hoverOff} onClick={this._onClick} className='icon-toolbar'/>
                </Col>
                <Col lg="3">
                  <SVGIcon id='3' name="globe" fill={this.state.fillColor[3]} onMouseEnter={this._hoverOn} onMouseLeave={this._hoverOff} onClick={this._onClick} className='icon-toolbar'/>
                </Col>
              </Row>
            </CardBody>
          </Card>
        )
      }else{
        return(
          <Card className="quick-toolbar">
            <CardBody>
              <Row className="custom-eva-size">
                <Col lg="4" className={(this.state.fillColor[0] === '#828282' ? 'hovered': this.state.fillColor[0] === '#3D3D3D' ? 'clicked':'')} onMouseEnter={this._hoverOn} onMouseLeave={this._hoverOff} onClick={this._onClick} id='0' >
                  <Icon name="edit" fill={this.state.fillColor[0]} />
                </Col>
                <Col lg="4" className={(this.state.fillColor[1] === '#828282' ? 'hovered': this.state.fillColor[1] === '#3D3D3D' ? 'clicked':'')} onMouseEnter={this._hoverOn} onMouseLeave={this._hoverOff} id='1'>
                  <Dropdown isOpen={this.state.isDropdownOpen} toggle={this.toggle}>
                    <DropdownToggle>
                      <Icon name="plus-circle" fill={this.state.fillColor[1]} />
                    </DropdownToggle>
                    <DropdownMenu>
                      <DropdownItem id='paragraph'>Paragraphe</DropdownItem>
                      <DropdownItem id='card'>Carte</DropdownItem>
                      <DropdownItem id='accordion'>Accordéon</DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </Col>
                <Col lg="4" className={(this.state.fillColor[2] === '#828282' ? 'hovered': this.state.fillColor[2] === '#3D3D3D' ? 'clicked':'')} onMouseEnter={this._hoverOn} onMouseLeave={this._hoverOff} onClick={this._onClick} id='2'>
                  <Icon name="minus-circle" size="xlarge" fill={this.state.fillColor[2]} />
                </Col>
              </Row>
            </CardBody>
          </Card>
        )
      }
    }else{
      return null
    }
  }
}

export default QuickToolbar;