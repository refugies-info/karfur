import React, {Component} from 'react';
import { Row, Col, Card, CardBody, Carousel, CarouselItem, Badge } from 'reactstrap';
import { withTranslation } from 'react-i18next';
import withSizes from 'react-sizes'

import marioProfile from '../../../assets/mario-profile.jpg'
import variables from '../Dispositif.scss';

import './ContribCaroussel.scss';
import Icon from 'react-eva-icons/dist/Icon';

class ContribCaroussel extends Component {
  state= {
    activeIndex: 0,
  }

  onExiting = () => {
    this.animating = true;
  }

  onExited = () => {
    this.animating = false;
  }

  next = maxL => {
    if (this.animating) return;
    const nextIndex = this.state.activeIndex === maxL - 1 ? 0 : this.state.activeIndex + 1;
    this.setState({ activeIndex: nextIndex });
  }

  previous = maxL => {
    if (this.animating) return;
    const nextIndex = this.state.activeIndex === 0 ? maxL - 1 : this.state.activeIndex - 1;
    this.setState({ activeIndex: nextIndex });
  }

  goToIndex = (newIndex) => {
    if (this.animating) return;
    this.setState({ activeIndex: newIndex });
  }
  
  render(){
    const { contributeurs, t, width } = this.props;
    const { activeIndex } = this.state;
    let nbCards = Math.floor( ( (width - 2 * 10 ) * 7/12 - 2 * (15 + 20) ) / (140 + 20))
    
    let reduced_contributeurs=(contributeurs || []).reduce((acc, curr, i) => {
      if (i > 0 && i % nbCards === 0 && i !== contributeurs.length-1) {
        return {currGrp:[curr], groupedData: [...acc.groupedData, acc.currGrp]}
      }else if(i % nbCards !== 0 && i === contributeurs.length-1){
        return {groupedData: [...acc.groupedData, [...acc.currGrp, curr]], currGrp:[]}
      }else if(i % nbCards === 0 && i === contributeurs.length-1){
        return {groupedData: [...acc.groupedData, ...acc.currGrp, [curr]], currGrp:[]}
      }
      return {currGrp: [...acc.currGrp, curr], groupedData: acc.groupedData }
    }, {currGrp: [], groupedData: []}).groupedData;
    let maxL = reduced_contributeurs.length;
    
    const slides = reduced_contributeurs.map((item, key) => {
      return (
        <CarouselItem
          onExiting={this.onExiting}
          onExited={this.onExited}
          className="caroussel-item"
          key={key}
        >
          <div className="ligne">
            {(item || []).map((contrib, subkey) => {
              let contribImg= (contrib.picture || {}).secure_url || marioProfile;    
              return (
                <div className="card-wrapper" key={subkey}>
                  <Card>
                    <CardBody>
                      <img className="people-img isAuthor" src={contribImg} alt="juliette"/>
                      {contrib.username}
                    </CardBody>
                  </Card>
                </div>
              )
            })}
          </div>
        </CarouselItem>
      );
    });
    
    return(
      <div className="people-footer">
        <Row className="people-header">
          <Col lg="auto" className="people-subheader">
            <h5>{t("Dispositif.Contributeurs", "Contributeurs mobilisés")}</h5>
            <sup><Badge color="light">{contributeurs.length}</Badge></sup>
            <span>Tiennent la page à jour et répondent à vos questions</span>
          </Col>
          <Col lg="auto" className="navigate-btns">
            <div className="left-btn cursor-pointer" onClick={()=>this.previous(maxL)}>
              <Icon name="arrow-ios-back-outline" size="large" fill={variables.darkColor} />
            </div>
            <div className="left-btn cursor-pointer" onClick={()=>this.next(maxL)}>
              <Icon name="arrow-ios-forward-outline" size="large" fill={variables.darkColor} />
            </div>
          </Col>
        </Row>
        <Carousel
          activeIndex={activeIndex}
          next={()=>this.next(maxL)}
          previous={()=>this.previous(maxL)}
          className="contrib-caroussel" 
        >
          {slides}
        </Carousel>
      </div>
    )
  }
}

const mapSizesToProps = ({width}) => ({
  width: width
})

export default withSizes(mapSizesToProps)(
  withTranslation()(ContribCaroussel)
);