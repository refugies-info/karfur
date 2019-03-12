import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { Card, CardBody, CardHeader, Carousel, CarouselControl, 
  CarouselItem, Col, Row, Progress, CardFooter } from 'reactstrap';
import track from 'react-tracking';

import {colorAvancement} from '../../../components/Functions/ColorFunctions'
import {languages} from './languagesData';
import {strings} from './stringsData';
import {themes} from './themesData';

import './Avancement.scss';
import AvancementLangue from '../../../components/Translation/Avancement/AvancementLangue/AvancementLangue';

const diffData=[
  {
    title:'Avancement par langue',
    headers:['Langue', 'Drapeau', 'Avancement', 'Statut']
  },
  {
    title:'Avancement de ',
    headers:['Titre', 'Nombre de mots', 'Avancement', 'Statut']
  }
]

const reduced_themes=themes.reduce((acc, curr, i) => {
    if (i > 0 && i % 3 === 0) {
      return {currGrp:[curr], groupedData: [...acc.groupedData, acc.currGrp]}
    }else if(i === themes.length-1){
      return {groupedData: [...acc.groupedData, [...acc.currGrp, curr]], currGrp:[]}
    }
    return {currGrp: [...acc.currGrp, curr], groupedData: acc.groupedData }
  }, {currGrp: [], groupedData: []}).groupedData;

class Avancement extends Component {
  state={
    mainView:true,
    title: diffData[0].title,
    headers: diffData[0].headers,
    data: languages,
    activeIndex: 0 
  }

  switchView= (mainView, element) =>{
    if(this.state.mainView){
      this.setState({
        mainView: false,
        title: diffData[1 * mainView].title + ' : ' + element.name,
        headers: diffData[1 * mainView].headers,
        data: strings
      })
    }else{
      this.props.history.push('/traduction')
    }
  }

  onExiting = () => {
    this.animating = true;
  }

  onExited = () => {
    this.animating = false;
  }

  next = () => {
    if (this.animating) return;
    const nextIndex = this.state.activeIndex === reduced_themes.length - 1 ? 0 : this.state.activeIndex + 1;
    this.setState({ activeIndex: nextIndex });
  }

  previous = () => {
    if (this.animating) return;
    const nextIndex = this.state.activeIndex === 0 ? reduced_themes.length - 1 : this.state.activeIndex - 1;
    this.setState({ activeIndex: nextIndex });
  }

  render(){
    const { activeIndex } = this.state;

    const slides = reduced_themes.map((item, key) => {
      return (
        <CarouselItem
          onExiting={this.onExiting}
          onExited={this.onExited}
          key={key}
        >
          <Row>
            {item.map((theme, key_theme) => {
              return (
                <Col key={key_theme}>
                  <Card>
                    <CardHeader>
                      {theme.title}
                    </CardHeader>
                    <CardBody>
                      {theme.subtitle}
                      <br />
                      Texte de remplissage : Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut
                      laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation.
                    </CardBody>
                    <CardFooter>
                      Progression :
                      <Progress 
                        color={colorAvancement(theme.avancement)} 
                        value={theme.avancement*100} 
                        className="mb-3" />
                    </CardFooter>
                  </Card>
                </Col>
              )
            })}
          </Row>
        </CarouselItem>
      );
    });

    return(
      <div className="animated fadeIn avancement">

        <Row>
          <Col xs="24" xl="12">
            <Card>
              <CardHeader>
                <strong>Thèmes</strong>
              </CardHeader>
              <CardBody>
                <Carousel activeIndex={activeIndex} next={this.next} previous={this.previous}>
                  {slides}
                  <CarouselControl direction="prev" directionText="Précédent" onClickHandler={this.previous} />
                  <CarouselControl direction="next" directionText="Suivant" onClickHandler={this.next} />
                </Carousel>
              </CardBody>
            </Card>
          </Col>
        </Row>


        <AvancementLangue 
          mainView={this.state.mainView}
          title={this.state.title}
          headers={this.state.headers}
          data={this.state.data}
          switchView={this.switchView}
        />
      </div>
    );
  }
}

export default track({
    page: 'Avancement',
  })(
    withTranslation()(Avancement)
  );