import React, { Component } from 'react';
import track from 'react-tracking';
import { Button, Card, CardBody, Col, Container, Form, Input, InputGroup, InputGroupAddon, CardGroup, Row } from 'reactstrap';
import Swal from 'sweetalert2';
import Icon from 'react-eva-icons';
import {NavLink} from 'react-router-dom'

import API from '../../utils/API';
import setAuthToken from '../../utils/setAuthToken'

import './Register.scss'

class Register extends Component {
  state = {
    username : "",
    password: "",
    cpassword: "",
    traducteur: false,
    passwordVisible:false
  }

  componentDidMount(){
    let locState = this.props.location.state ;
    if(locState){
      this.setState({traducteur: locState.traducteur, redirectTo: locState.redirectTo || "/"});
    }
  }

  togglePasswordVisibility = () => this.setState(prevState=>({passwordVisible: !prevState.passwordVisible}))

  send = (e) => {
    e.preventDefault();
    if(this.state.username.length === 0){
      Swal.fire( 'Oops...', 'Aucun nom d\'utilisateur renseigné', 'error');return;
    }
    if(this.state.password.length === 0 || this.state.password !== this.state.cpassword){
      Swal.fire( 'Oops...', 'Les mots de passes ne correspondent pas !', 'error');return;
    }
    var _send = {
      username: this.state.username,
      password: this.state.password,
      traducteur : this.state.traducteur
    }
    API.signup(_send).then(data => {
      Swal.fire( 'Yay...', 'Authentification réussie !', 'success').then(()=>{
        this.props.history.push(this.state.redirectTo)
      });
      localStorage.setItem('token', data.data.token);
      setAuthToken(data.data.token);
    })
  }    

  handleChange = event => {
    this.setState({
        [event.target.id]: event.target.value
    });
  }

  render() {
    return (
      <div className="app flex-row align-items-center register">
        <Container>
          <Row className="justify-content-center">
            <Col md="9">
              <CardGroup>
                <Card className="card-left">
                  <CardBody>
                    <Form onSubmit={this.send}>
                      <h1>Création de compte</h1>
                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend" className="icon-prepend">
                          <Icon name="person-outline" fill="#3D3D3D" />
                        </InputGroupAddon>
                        <Input autoFocus id="username" type="username" placeholder="nom d'utilisateur" 
                            value={this.state.username} onChange={this.handleChange} 
                            autoComplete="username" />
                      </InputGroup>
                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend" className="icon-prepend">
                          <Icon name="lock-outline" fill="#3D3D3D" />
                        </InputGroupAddon>
                        <Input type={this.state.passwordVisible ? "text" : "password"} id="password" value={this.state.password} onChange={this.handleChange} 
                            placeholder="mot de passe" autoComplete="password" />
                        <InputGroupAddon addonType="append" className="icon-append" onClick={this.togglePasswordVisibility}>
                          <Icon name="eye-outline" fill="#3D3D3D" />
                        </InputGroupAddon>
                      </InputGroup>
                      <InputGroup className="mb-4">
                        <InputGroupAddon addonType="prepend" className="icon-prepend">
                          <Icon name="lock-outline" fill="#3D3D3D" />
                        </InputGroupAddon>
                        <Input type={this.state.passwordVisible ? "text" : "password"} id="cpassword" value={this.state.cpassword} onChange={this.handleChange} 
                            placeholder="confirmez le mot de passe" autoComplete="new-password" />
                        <InputGroupAddon addonType="append" className="icon-append" onClick={this.togglePasswordVisibility}>
                          <Icon name="eye-outline" fill="#3D3D3D" />
                        </InputGroupAddon>
                      </InputGroup>
                      <div className="footer-buttons">
                        <Button type="button" color="transparent" className="px-0 text-white password-btn">
                          <NavLink to={{ pathname:'/login', state: this.props.location.state }}><u>Déjà un compte ? connectez-vous</u></NavLink>
                        </Button>
                        <Button type="submit" className="px-4 connect-btn">
                          S'enregistrer
                        </Button>
                      </div>
                    </Form>
                  </CardBody>
                  {/* <CardFooter className="p-4">
                    <Row>
                      <Col xs="12" sm="6">
                        <Button className="btn-facebook mb-1" block><span>facebook</span></Button>
                      </Col>
                      <Col xs="12" sm="6">
                        <Button className="btn-twitter mb-1" block><span>twitter</span></Button>
                      </Col>
                    </Row>
                  </CardFooter> */}
                </Card>
                <Card className="text-dark d-md-down-none card-right">
                  <CardBody className="text-center">
                    <h2>Pourquoi nous rejoindre ?</h2>
                    <p>Devenez contributeur, sauvegardez vos contenus favoris, rejoignez une communauté mobilisée pour aider les réfugiés...</p>
                    <NavLink to="/" className="knowMore-link">
                      En savoir plus
                    </NavLink>
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
  page: 'Register',
}, { dispatchOnMount: true })(Register);
