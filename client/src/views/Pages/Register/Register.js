import React, { Component } from 'react';
import track from 'react-tracking';
import { Button, Card, CardBody, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import Swal from 'sweetalert2';

import API from '../../../utils/API';
import setAuthToken from '../../../utils/setAuthToken'

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username : "",
      password: "",
      cpassword: "",
      traducteur: false
    }
    this.handleChange.bind(this);
  }

  componentDidMount(){
    if(this.props.location.state && this.props.location.state.traducteur){
      console.log('traducteur')
      this.setState({traducteur: true});
    }
  }

  send = () => {
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
      Swal.fire( 'Yay...', 'Authentification réussie !', 'success');
      localStorage.setItem('token', data.data.token);
      setAuthToken(data.data.token);
      console.log('succes', data.data.token)
      if(this.state.traducteur){
        this.props.history.push("/backend/user-dashboard")
      }else{
        this.props.history.push("/homepage")
      }
    })
  }    

  handleChange = event => {
    this.setState({
        [event.target.id]: event.target.value
    });
  }

  render() {
    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="9" lg="7" xl="6">
              <Card className="mx-4">
                <CardBody className="p-4">
                  <Form>
                    <h1>S'enregistrer</h1>
                    <p className="text-muted">Créer un compte</p>
                    {/* <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-user"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="text" placeholder="Nom d\'utilisateur" autoComplete="username" />
                    </InputGroup> */}
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>@</InputGroupText>
                      </InputGroupAddon>
                      <Input autoFocus id="username" type="username" placeholder="Nom d'utilisateur" 
                          value={this.state.username} onChange={this.handleChange} 
                          autoComplete="username" />
                    </InputGroup>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-lock"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="password" id="password" value={this.state.password} onChange={this.handleChange} 
                          placeholder="Mot de passe" autoComplete="password" />
                    </InputGroup>
                    <InputGroup className="mb-4">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-lock"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="password" id="cpassword" value={this.state.cpassword} onChange={this.handleChange} 
                          placeholder="Confirmez le mot de passe" autoComplete="new-password" />
                    </InputGroup>
                    <Button onClick={this.send} color="success" block>Créer un compte</Button>
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
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default track({
  page: 'Register',
}, { dispatchOnMount: true })(Register);
