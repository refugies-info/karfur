import React, { Component } from 'react';
import { Button, Card, CardBody, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import API from '../../../utils/API';

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
        email : "",
        password: "",
        cpassword: ""
    }
    this.handleChange.bind(this);
    this.send.bind(this);
  }
  send = event => {
    if(this.state.email.length === 0){
        return;
    }
    if(this.state.password.length === 0 || this.state.password !== this.state.cpassword){
        return;
    }
    var _send = {
        email: this.state.email,
        password: this.state.password
    }
    API.signup(_send).then(function(data){
        localStorage.setItem('token', data.data.token);
        console.log('succes', data.data.token)
        window.location = "/homepage"
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
                      <Input autoFocus id="email" type="email" placeholder="Email" 
                          value={this.state.email} onChange={this.handleChange} 
                          autoComplete="email" />
                    </InputGroup>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-lock"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="password" id="password" value={this.state.password} onChange={this.handleChange} 
                          placeholder="Mot de passe" autoComplete="new-password" />
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

export default Register;
