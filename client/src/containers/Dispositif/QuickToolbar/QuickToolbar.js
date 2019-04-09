import React, {Component} from 'react';
import { Card, CardBody, Row, Col } from 'reactstrap';

import SVGIcon from '../../../components/UI/SVGIcon/SVGIcon';

import './QuickToolbar.scss'

class QuickToolbar extends Component {
  state= {
    fillColor: new Array(4).fill('#CDCDCD'),
    modal:{
      show:false,
    }
  } 

  _hoverOn=(e)=>{
    let prevState= new Array(4).fill('#CDCDCD');
    prevState[e.target.id]= '#828282';
    this.setState({fillColor: prevState});
  }

  _hoverOff=(e)=>{
    this.setState({fillColor: new Array(4).fill('#CDCDCD')});
  }

  _onClick=(e)=>{
    let prevState= new Array(4).fill('#CDCDCD');
    prevState[e.target.id]= '#3D3D3D';
    this.setState({fillColor: prevState});
    this.props.toggleModal(true);
  }

  render() {
    if(this.props.show){
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
      return null
    }
  }
}

export default QuickToolbar;