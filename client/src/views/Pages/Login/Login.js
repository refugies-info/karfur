import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import track from 'react-tracking';
import { Button, Card, CardBody, CardGroup, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import API from '../../../utils/API';
import setAuthToken from '../../../utils/setAuthToken'

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username : "",
      password: "",
      traducteur : false
    }
    this.handleChange.bind(this);
    this.send.bind(this);
  }

  componentDidMount(){
    if(this.props.location.state && this.props.location.state.traducteur){
      console.log('traducteur')
      this.setState({traducteur: true});
    }
  }

  send = event => {
    if(this.state.username.length === 0){
      return;
    }
    if(this.state.password.length === 0){
      return;
    }
    let user = {
      'username' : this.state.username,
      'password' : this.state.password,
      'traducteur' : this.state.traducteur,
    }
    API.login(user).then(data => {
      localStorage.setItem('token', data.data.token);
      setAuthToken(data.data.token);
      console.log(data.data.token)
      if(this.state.traducteur){
        this.props.history.push("/backend/user-dashboard")
      }else{
        this.props.history.push("/homepage")
      }
    },error => {
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
                        <Input autoFocus id="username" type="username" placeholder="Nom d'utilisateur" 
                          value={this.state.username} onChange={this.handleChange} 
                          autoComplete="username" />
                      </InputGroup>
                      <InputGroup className="mb-4">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-lock"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input type="password" id="password" value={this.state.password} onChange={this.handleChange} 
                          placeholder="Mot de passe" autoComplete="password" />
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
                      <Link to={{ 
                            pathname: "/register", 
                            state: {traducteur: this.state.traducteur}
                          }} >
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
