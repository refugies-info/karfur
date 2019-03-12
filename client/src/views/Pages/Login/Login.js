import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import track from 'react-tracking';
import { Button, Card, CardBody, CardGroup, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import API from '../../../utils/API';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
        email : "",
        password: ""
    }
    this.handleChange.bind(this);
    this.send.bind(this);
  }

  componentDidMount(){
    console.log(this.props.location.state)
  }

  send = event => {
    if(this.state.email.length === 0){
        return;
    }
    if(this.state.password.length === 0){
        return;
    }
    API.login(this.state.email, this.state.password).then(function(data){
        localStorage.setItem('token', data.data.token);
        console.log('succes', data.data.token)
        window.location = "/homepage";
    },function(error){
        console.log(error);
        return;
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
            <Col md="8">
              <CardGroup>
                <Card className="p-4">
                  <CardBody>
                    <Form>
                      <h1>Se connecter</h1>
                      <p className="text-muted">Connectez-vous à votre compte</p>
                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-user"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input autoFocus id="email" type="email" placeholder="Email" 
                          value={this.state.email} onChange={this.handleChange} 
                          autoComplete="email" />
                      </InputGroup>
                      <InputGroup className="mb-4">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-lock"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input type="password" id="password" value={this.state.password} onChange={this.handleChange} 
                          placeholder="Mot de passe" autoComplete="current-password" />
                      </InputGroup>
                      <Row>
                        <Col xs="6">
                          <Button onClick={this.send} color="primary" className="px-4">
                            Se connecter
                          </Button>
                        </Col>
                        <Col xs="6" className="text-right">
                          <Button color="link" className="px-0">
                            Mot de passe oublié?
                          </Button>
                        </Col>
                      </Row>
                    </Form>
                  </CardBody>
                </Card>
                <Card className="text-white bg-primary py-5 d-md-down-none" style={{ width: '44%' }}>
                  <CardBody className="text-center">
                    <div>
                      <h2>Créer un compte</h2>
                      <p>Vous n'êtes pas encore enregistré sur notre site ? Cliquez sur le bouton ci-dessous pour créer votre compte</p>
                      <Link to="/register">
                        <Button color="primary" className="mt-3" active tabIndex={-1}>Créer un compte</Button>
                      </Link>
                    </div>
                  </CardBody>
                </Card>
              </CardGroup>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default track({
  page: 'Login',
}, { dispatchOnMount: true })(Login);
