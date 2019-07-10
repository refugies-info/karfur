import React, {Component} from 'react';
import { Row, Col, Input, Spinner, Modal, InputGroup, Tooltip } from 'reactstrap';
import Icon from 'react-eva-icons';
import variables from 'scss/colors.scss';
import API from "utils/API.js";

import EVAIcon from '../../../UI/EVAIcon/EVAIcon';

import './Sponsors.scss';
import FButton from '../../../FigmaUI/FButton/FButton';

class Sponsors extends Component {
  state = {
    showModal: false,
    sponsorLoading: false,
    imgData: {},
    link: '',
    alt: '',
    tooltipOpen: false
  }

  toggleModal = () => this.setState(pS => ({showModal: !pS.showModal}))
  toggleTooltip = () => this.setState(pS => ({ tooltipOpen: !pS.tooltipOpen }));

  handleFileInputChange = event => {
    this.setState({sponsorLoading:true})
    const formData = new FormData()
    formData.append(0, event.target.files[0])

    API.set_image(formData).then(data_res => {
      let imgData=data_res.data.data;
      this.setState({imgData: {src: imgData.secure_url, public_id: imgData.public_id}, sponsorLoading:false})
    })
  }

  _handleChange = (ev) => {
    this.setState({ [ev.currentTarget.id]: ev.target.value });
  };

  validateSponsor = () => {
    this.props.addSponsor({
      ...this.state.imgData, 
      link: this.state.link,
      alt: this.state.alt
    })
    this.toggleModal();
  }

  render(){
    let {disableEdit, t, sponsors, deleteSponsor} = this.props
    let {alt, link, imgData, sponsorLoading} =  this.state;

    return (
      <div className="sponsor-footer">
        <h5 className="color-darkColor">{t("Dispositif.Structures")}</h5>
        <Row className="sponsor-images">
          {sponsors && sponsors.map((sponsor, key) => {
            return (
              <Col key={key} className="sponsor-col">
                <div className="image-wrapper">
                  <a  href={((sponsor.link || "").includes("http") ? "" : "http://") + sponsor.link} target="_blank">
                    <img className="sponsor-img" src={sponsor.src} alt={sponsor.alt} />
                  </a>
                  {!disableEdit && 
                    <div className="delete-icon" onClick={()=>deleteSponsor(key)}>
                      <Icon name="minus-circle" fill={variables.darkColor} size="xlarge"/>
                    </div>}
                </div>
              </Col>
            )}
          )}
          
          {!disableEdit && 
            <Col>
              <div className="add-sponsor" onClick={this.toggleModal}>
                <EVAIcon className="add-sign backgroundColor-darkColor" name="plus-outline" />
                <span className="add-text color-darkColor">Ajouter un logo</span>
              </div>
            </Col>}
        </Row>

        <Modal isOpen={this.state.showModal} toggle={this.toggleModal} className='modal-sponsors'>
          <div className="form-field inline-div">
            <span>1. Choix de l’image<sup>*</sup></span>
            {imgData.src ?
              <div className="image-wrapper">
                <Input 
                  className="file-input"
                  type="file"
                  id="picture" 
                  name="user" 
                  accept="image/*"
                  onChange = {this.handleFileInputChange} />
                <img className="sponsor-img" src={imgData.src} alt={imgData.alt}/>
                {sponsorLoading && 
                  <Spinner color="green" />}
              </div>
              :
              <FButton className="upload-btn" type="theme" name="upload-outline">
                <Input 
                  className="file-input"
                  type="file"
                  id="picture" 
                  name="user" 
                  accept="image/*"
                  onChange = {this.handleFileInputChange} />
                <span>Choisir</span>
                {sponsorLoading && 
                  <Spinner color="green" />}
              </FButton>}
          </div>
          <div className="form-field">
            <span>2. Lien vers le site de la structure<sup>*</sup></span>
            <InputGroup>
              <EVAIcon className="input-icon" name="link-outline" fill={variables.noir}/>
              <Input id="link" placeholder="https://www.agi-r.fr" value={link} onChange={this._handleChange} />
            </InputGroup>
          </div>
          <div className="form-field">
            <span>
              3. Texte alternatif à l’image<sup>*</sup>
              <EVAIcon className="float-right" id="alt-tooltip" name="info" fill={variables.noir} />
              <Tooltip placement="top" isOpen={this.state.tooltipOpen} target="alt-tooltip" toggle={this.toggleTooltip}>
                Ce texte est utile pour les personnes malvoyantes ou en cas de non-chargement de l’image.
              </Tooltip>
            </span>
            <InputGroup>
              <EVAIcon className="input-icon" name="eye-off-outline" fill={variables.noir}/>
              <Input id="alt" placeholder="Agi’r" value={alt} onChange={this._handleChange} />
            </InputGroup>
          </div>
          <div className="btn-footer">
            <FButton onClick={this.toggleModal} type="default" className="mr-10">
              Annuler
            </FButton>
            <FButton onClick={this.validateSponsor} type="validate" name="checkmark-circle-2-outline">
              Valider
            </FButton>
          </div>
        </Modal>
      </div>
    )
  }
}

export default Sponsors;