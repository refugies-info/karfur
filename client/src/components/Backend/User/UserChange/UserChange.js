import React from 'react';
import {
  Row,
  Col,
  Form,
  FormGroup,
  FormText,
  Input,
  Label,
  Spinner,
  Progress
} from 'reactstrap';
import Slider, { createSliderWithTooltip } from 'rc-slider';
import passwdCheck from "zxcvbn";
import 'rc-slider/assets/index.css';

import DraggableList from '../../../../components/UI/DraggableList/DraggableList';
import marioProfile from '../../../../assets/mario-profile.jpg';
import { colorAvancement } from '../../../Functions/ColorFunctions';

import './UserChange.scss'

const SliderWithTooltip = createSliderWithTooltip(Slider);

const localeFormatter = (v) => new Intl.NumberFormat().format(v);

const userChange = (props) => {
  const statuts = ['Actif', 'En attente', 'Inactif', 'Exclu']
  const langues_list=(props.user.selectedLanguages || []).map(function (item) { return item.langueFr; });
  const imgSrc = (props.user.picture || []).secure_url || marioProfile
  const password_check = passwdCheck(props.user.password);
  
  return (
    <Form action="" method="post" encType="multipart/form-data" className="form-horizontal user-change">
      <FormGroup row>
        <Col md="3">
          <Label>Photo de profil</Label>
        </Col>
        <Col xs="12" md="9">
          <div className="profile-header-container">   
            <div className="rank-label-container">
              <ProfilePic uploading={props.uploading} imgSrc={imgSrc} />
              <Input 
                className="file-input"
                type="file"
                id="picture" 
                name="user" 
                accept="image/*"
                onChange = {props.handleFileInputChange} />
              <span className="label label-default rank-label">Editer</span>
            </div>
          </div> 
        </Col>
      </FormGroup>

      <FormGroup row>
        <Col md="3">
          <Label>Nom d'utilisateur</Label>
        </Col>
        <Col xs="12" md="9">
          <Input 
            type="text" 
            id="username" 
            name="user" 
            placeholder="Nom d'utilisateur"
            value={props.user.username || ''}
            onChange = {props.handleChange} />
          <FormText color="muted">Par exemple : Soufiane</FormText>
        </Col>
      </FormGroup>

      {props.isAdmin &&
      <FormGroup row>
        <Col md="3">
          <Label htmlFor="password">Mot de passe</Label>
        </Col>
        <Col xs="12" md="9">
          <Input 
            type="password" 
            id="password" 
            name="user" 
            placeholder="Mot de passe"
            value={props.user.password}
            onChange = {props.handleChange}
            disabled={props.user.password === 'Hidden'} />
          <FormText color="muted">Par exemple : motdepasse</FormText>
          {props.user.password && props.user.password !== 'Hidden' &&
            <div className="score-wrapper mb-10">
              <span className="mr-10">Force :</span>
              <Progress 
                color={colorAvancement(password_check.score/4)} 
                value={(0.1+(password_check.score/4))*100/1.1} 
              />
            </div>}
        </Col>
      </FormGroup>}

      <FormGroup row>
        <Col md="3"><Label>Langues de travail</Label></Col>

        <Col xs="12" md="9">
          <Row>
            {(props.langues || []).map((langue, key) => {
              return (
                <Col md="3" key={key}>
                    <FormGroup check className="checkbox">
                      <Input 
                        className="form-check-input langue" 
                        type="checkbox" 
                        name="user" 
                        id={langue._id} 
                        value={langue._id}
                        checked={(props.user.selectedLanguages || []).find(x => x._id === langue._id) ? true : false}
                        onChange={props.handleCheck} />
                      <Label check className="form-check-label" htmlFor={langue._id}>{langue.langueFr}</Label>
                    </FormGroup>
                </Col>
              )}
            )}
          </Row>
        </Col>
      </FormGroup>

      <FormGroup row>
        <Col md="3">
          <Label htmlFor="text-input">Votre objectif quotidien en minutes</Label>
        </Col>
        <Col xs="12" md="9">
          <Row>
            <Col md="9">
              <SliderWithTooltip 
                min={0}
                max={90}
                step={10}
                tipFormatter={localeFormatter}
                trackStyle={{ background: 'linear-gradient(135deg, #5ee7df 0%, #b490ca 100%)', height: 10 }}
                handleStyle={{
                  borderColor: 'blue',
                  height: 20,
                  width: 20,
                  marginLeft: -14,
                  marginTop: -5,
                  backgroundColor: 'blue',
                }}
                railStyle={{ backgroundColor: 'red', height: 10 }}
                name="user" 
                onChange={(value) => props.handleSliderChange(value,'objectifTemps')}
                value={props.user.objectifTemps}
              /> 
              <FormText color="muted">Définissez ici le temps que vous souhaitez accorder à la traduction quotidiennement</FormText>
            </Col>
            <Col>
              {props.user.objectifTemps || 0} minutes
            </Col>
          </Row>
        </Col>
      </FormGroup>

      <FormGroup row>
        <Col md="3">
          <Label htmlFor="text-input">Votre objectif quotidien en mots traduits</Label>
        </Col>
        <Col xs="12" md="9">
          <Row>
            <Col md="9">
              <SliderWithTooltip 
                min={0}
                max={2000}
                step={200}
                tipFormatter={localeFormatter}
                trackStyle={{ background: 'linear-gradient(135deg, #5ee7df 0%, #b490ca 100%)', height: 10 }}
                handleStyle={{
                  borderColor: 'blue',
                  height: 20,
                  width: 20,
                  marginLeft: -14,
                  marginTop: -5,
                  backgroundColor: 'blue',
                }}
                railStyle={{ backgroundColor: 'red', height: 10 }}
                onChange={(value) => props.handleSliderChange(value,'objectifMots')}
                value={props.user.objectifMots}
              />
              <FormText color="muted">Définissez ici le nombre de mots que vous souhaiteriez traduire chaque jour</FormText>
            </Col>
            <Col>
              {props.user.objectifMots || 0} mots
            </Col>
          </Row>
        </Col>
      </FormGroup>

      {langues_list.length>0 && 
        <FormGroup row>
          <Col md="3">
            <Label htmlFor="text-input">Classement des langues</Label>
          </Col>
          <Col xs="12" md="9">
            <DraggableList 
              items={langues_list}
              maxLength={props.langues.length}
              {...props}
              />
          </Col>
        </FormGroup>}

      <FormGroup row>
        <Col md="3">
          <Label htmlFor="email">Adresse email</Label>
        </Col>
        <Col xs="12" md="9">
          <Input 
            type="email" 
            id="email" 
            name="user" 
            placeholder="Adresse mail" 
            autoComplete="email"
            onChange={props.handleChange}
            value={props.user.email || ''} />
          <FormText className="help-block">Restez informé des dernières informations concernant la traduction</FormText>
        </Col>
      </FormGroup>
      
      {(props.roles || []).some(x => x.nom==="Admin" && x.isChecked) && 
        <FormGroup row>
          <Col md="3">
            <Label>Numéro de téléphone</Label>
          </Col>
          <Col xs="12" md="9">
            <Input 
              type="phone" 
              id="phone" 
              name="user" 
              placeholder="Téléphone"
              value={props.user.phone || ''}
              onChange = {props.handleChange} />
            <FormText color="muted">Par exemple : 06 11 22 33 44</FormText>
          </Col>
        </FormGroup>}

      <FormGroup row>
        <Col md="3">
          <Label htmlFor="description">Description</Label>
        </Col>
        <Col xs="12" md="9">
          <Input 
            type="textarea" 
            name="user"  
            id="description" 
            rows="6"
            placeholder="Renseignez une courte description que les autres utilisateurs pourront voir"
            onChange={props.handleChange}
            value={props.user.description || ''} />
        </Col>
      </FormGroup>


      {props.isAdmin && 
        <>
          <FormGroup row>
            <Col md="3">
              <Label htmlFor="select">Rôle sur notre site</Label>
            </Col>

            <Col xs="12" md="9">
              <Row>
                {(props.roles || []).map((role, key) => {
                  return (
                    <Col xs="9" md="6" key={key}>
                        <FormGroup check className="checkbox">
                          <Input 
                            className="form-check-input role" 
                            type="checkbox" 
                            name="user" 
                            id={role._id} 
                            value={role._id}
                            checked={role.isChecked}
                            onChange={props.handleCheck} />
                          <Label check className="form-check-label" htmlFor={role._id}>{role.nomPublique}</Label>
                        </FormGroup>
                    </Col>
                  )}
                )}
              </Row>
            </Col>
          </FormGroup>

          <FormGroup row>
            <Col md="3">
              <Label htmlFor="status">Statut</Label>
            </Col>
            <Col xs="12" md="9">
              <Input 
                type="select" 
                id="status" 
                name="user" 
                value={props.user.status}
                onChange = {props.handleChange}  >
                {statuts.map((statut) =>
                  <option 
                    value={statut}
                    key={statut}>
                    {statut}
                  </option>
                )}
              </Input>
            </Col>
          </FormGroup>
        </>
      }
    </Form>
  )
}

const ProfilePic = props => {
  if(props.uploading){
    return <Spinner color="dark" className="fadeIn fadeOut" />
  }else{
    return <img className="img-circle" src={props.imgSrc} alt="profile"/>
  }
}

export default userChange;
