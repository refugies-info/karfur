import React, { Component } from 'react';
import track from 'react-tracking';
import { Button, Card, CardBody, CardGroup, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import Swal from 'sweetalert2';
import Icon from 'react-eva-icons'
import {NavLink} from 'react-router-dom'

import API from '../../utils/API';
import setAuthToken from '../../utils/setAuthToken'
import FCBtn from '../../assets/FCboutons-10.png'

import './Login.scss'

class Login extends Component {
  state = {
    username : "",
    password: "",
    traducteur : false,
    passwordVisible:false,
    redirectTo : "/",
  }

  componentDidMount(){
    let locState = this.props.location.state ;
    if(locState){ this.setState({traducteur: locState.traducteur, redirectTo: locState.redirectTo || "/"}); }
    window.scrollTo(0, 0);
  }

  togglePasswordVisibility = () => this.setState(prevState=>({passwordVisible: !prevState.passwordVisible}))

  send = (e) => {
    e.preventDefault();
    if(this.state.username.length === 0){
      Swal.fire( 'Oops...', 'Aucun nom d\'utilisateur n\'est renseigné !', 'error');return;
    }
    if(this.state.password.length === 0){
      Swal.fire( 'Oops...', 'Aucun mot de passe n\'est renseigné !', 'error');return;
    }
    let user = {
      'username' : this.state.username,
      'password' : this.state.password,
      'traducteur' : this.state.traducteur,
    }
    API.login(user).then(data => {
      Swal.fire( 'Yay...', 'Authentification réussie !', 'success').then(()=>{
        this.props.history.push(this.state.redirectTo)
      });
      localStorage.setItem('token', data.data.token);
      setAuthToken(data.data.token);
    })
  }    

  handleChange = event => this.setState({ [event.target.id]: event.target.value });

  render() {
    return (
      <div className="app flex-row align-items-center login">
        <Container>
          <Row className="justify-content-center">
            <Col md="8">
              <CardGroup>
                <Card className="card-left">
                  <CardBody>
                    <Form onSubmit={this.send}>
                      <h1>Se connecter</h1>
                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend" className="icon-prepend">
                          <Icon name="person-outline" fill="#3D3D3D" />
                        </InputGroupAddon>
                        <Input autoFocus id="username" type="username" placeholder="nom d'utilisateur" 
                          value={this.state.username} onChange={this.handleChange} 
                          autoComplete="username" />
                      </InputGroup>
                      <InputGroup className="mb-4">
                        <InputGroupAddon addonType="prepend" className="icon-prepend">
                          <Icon name="lock-outline" fill="#3D3D3D" />
                        </InputGroupAddon>
                        <Input type={this.state.passwordVisible ? "text" : "password"} id="password" value={this.state.password} onChange={this.handleChange} 
                          placeholder="mot de passe" autoComplete="password" />
                        <InputGroupAddon addonType="append" className="icon-append" onClick={this.togglePasswordVisibility}>
                          <Icon name="eye-outline" fill="#3D3D3D" />
                        </InputGroupAddon>
                      </InputGroup>
                      <div className="footer-buttons">
                        <Button type="button" color="transparent" className="px-0 text-dark password-btn">
                          <u>mot de passe oublié ?</u>
                        </Button>
                        <Button type="submit" color="dark" className="px-4 connect-btn">
                          Connexion
                        </Button>
                      </div>
                    </Form>
                    {/* <div className="alt-login">
                      <form action="/user/FClogin" method="post">
                        <div className="field">
                          <label className="label">
                              Niveau eIDAS
                              <span
                                className="has-text-info tooltip is-tooltip-multiline"
                                data-tooltip="Vous pouvez dès à présent tester les identités de niveau faible (eidas1), substantiel (eidas2) et fort (eidas3) sur l'environnement de qualification. En production, vous n'aurez cependant accès pour l'instant qu'à des identités de niveau faible (eidas1)." >
                                  (info)
                              </span>
                          </label>
                          <div className="select">
                            <select name="eidasLevel">
                              <option value="eidas1">Défaut : Faible (eidas1)</option>
                              <option value="eidas2">Substantiel (eidas2)</option>
                              <option value="eidas3">Fort (eidas3)</option>
                            </select>
                          </div>
                        </div>
                        <div className="field">
                          <input type="image" src={FCBtn} alt="Soumettre"/>
                        </div>
                      </form>
                    </div> */}
                  </CardBody>
                </Card>
                <Card className="text-white py-5 d-md-down-none card-right">
                  <CardBody className="text-center">
                    <div>
                      <h2>Créer un compte</h2>
                      <p>Devenez contributeur, sauvegardez vos contenus favoris, rejoignez une communauté mobilisée pour aider les réfugiés...</p>
                      <NavLink to={{ 
                            pathname: "/register", 
                            state: this.props.location.state
                          }} >
                        <Button className="mt-3 btn-sign text-dark" tabIndex={-1}>S'enregistrer</Button>
                      </NavLink>
                    </div>
                  </CardBody>
                </Card>
              </CardGroup>
            </Col>
            <div className="retour-wrapper">
              <NavLink to="/">
                <Button color="transparent" className="retour-btn text-dark">
                  <Icon name="close-circle-outline" fill="#3D3D3D" />
                  <u>Retour</u>
                </Button>
              </NavLink>
            </div>
          </Row>
        </Container>
      </div>
    );
  }
}

export default track({
  page: 'Login',
}, { dispatchOnMount: true })(Login);
