import React, { Component } from 'react';
import track from 'react-tracking';
import { Button, Card, CardBody, Form } from 'reactstrap';
import Swal from 'sweetalert2';
import {NavLink} from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';

import API from '../../utils/API';
import setAuthToken from '../../utils/setAuthToken';
import FCBtn from '../../assets/FCboutons-10.png';
import FButton from '../../components/FigmaUI/FButton/FButton';
import EVAIcon from '../../components/UI/EVAIcon/EVAIcon';
import FInput from '../../components/FigmaUI/FInput/FInput';
import {fetch_user} from "../../Store/actions";

import './Login.scss';
import variables from 'scss/colors.scss';

class Login extends Component {
  state = {
    username : "",
    password: "",
    cpassword: "",
    traducteur : false,
    passwordVisible:false,
    redirectTo : "/",
    step: 0,
    userExists: false,
    usernameHidden:false,
  }

  componentDidMount(){
    let locState = this.props.location.state ;
    if(locState){ this.setState({traducteur: locState.traducteur, redirectTo: locState.redirectTo || "/"}); }
    window.scrollTo(0, 0);
  }

  togglePasswordVisibility = () => this.setState(prevState=>({passwordVisible: !prevState.passwordVisible}))

  goBack = () => this.setState({step: 0, userExists: false, password:"", cpassword: ""});

  send = (e) => {
    e.preventDefault();
    if(this.state.step === 0){
      if(this.state.username.length === 0){
        Swal.fire( {title: 'Oops...', text: 'Aucun nom d\'utilisateur n\'est renseigné !', type: 'error', timer: 1500});return;
      }
      API.checkUserExists({'username' : this.state.username}).then(data => {
        this.setState({userExists: data.status === 200, step: 1});
      })
    }else{
      if(this.state.password.length === 0){
        Swal.fire( {title: 'Oops...', text: 'Aucun mot de passe n\'est renseigné !', type: 'error', timer: 1500});return;
      }
      if(!this.state.userExists && this.state.password !== this.state.cpassword){
        Swal.fire( {title: 'Oops...', text: 'Les mots de passes ne correspondent pas !', type: 'error', timer: 1500});return;
      }
      let user = {
        'username' : this.state.username,
        'password' : this.state.password,
        'cpassword' : this.state.cpassword,
        'traducteur' : this.state.traducteur,
      }
      API.login(user).then(data => {
        Swal.fire( 'Yay...', 'Authentification réussie !', 'success').then(()=>{
          this.props.history.push(this.state.redirectTo)
        });
        localStorage.setItem('token', data.data.token);
        setAuthToken(data.data.token);
        this.props.fetch_user();
      })
    }
  }    

  handleChange = event => this.setState({ [event.target.id]: event.target.value });

  upcoming = () => Swal.fire( {title: 'Oh non!', text: 'Cette fonctionnalité n\'est pas encore disponible', type: 'error', timer: 1500 })

  render() {
    const {passwordVisible, username, step, userExists} = this.state;
    const { t } = this.props;
    return (
      <div className="app flex-row align-items-center login">
        <div className="login-wrapper">
          {step === 1 && !userExists && 
            <RegisterHeader goBack={this.goBack} t={t} /> }
          <Card className="card-login main-card">
            <CardBody>
              <Form onSubmit={this.send}>
                <h5>
                  {step === 0 || userExists ? 
                    t("Login.Se connecter", "Se connecter") : 
                    t("Login.Se créer un compte", "Se créer un compte")}
                </h5>
                <div className="texte-small mb-12">
                  {step === 0 ? 
                    t("Login.Ou se créer un compte", "Ou se créer un compte") : 
                      (userExists ? t("Login.Content de vous revoir !", "Content de vous revoir !") : 
                        t("Login.Pas besoin d’email", "Pas besoin d’email"))}
                </div>
                <CSSTransition
                  in={true} 
                  appear={true} 
                  timeout={600} 
                  classNames="example"
                >
                  {step===0 ? <UsernameField value={username} onChange={this.handleChange} step={step} key="username-field" t={t}/>:
                  <>
                    <PasswordField 
                      id="password"
                      placeholder="Mot de passe"
                      value={this.state.password} 
                      onChange={this.handleChange} 
                      passwordVisible={passwordVisible}
                      onClick={this.togglePasswordVisibility}
                      t={t} />
                      {step === 1 && !userExists &&
                    <PasswordField 
                      id="cpassword"
                      placeholder="Confirmez le mot de passe"
                      value={this.state.cpassword} 
                      onChange={this.handleChange} 
                      passwordVisible={passwordVisible}
                      onClick={this.togglePasswordVisibility}
                      t={t} />}
                  </>}
                </CSSTransition>
                
                {step === 1 &&
                  <PasswordFooter value={this.state.password} upcoming={this.upcoming} t={t} />}
              </Form>
            </CardBody>
          </Card>
          {/* <Card className="card-login">
            <CardBody>
              <div className="alt-login">
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
              </div>
            </CardBody>
          </Card> */}
          <NavLink to="/">
            <FButton type="outline" name="corner-up-left-outline" className="retour-btn">
              {t("Login.Retour à l'accueil", "Retour à l'accueil")}
            </FButton>
          </NavLink>
        </div>
      </div>
    );
  }
}

const UsernameField = props => (
  <div key="username-field">
    <FInput
      prepend
      prependName="person-outline"
      {...props}
      id="username" type="username" placeholder={props.t("Login.Pseudonyme", "Pseudonyme")} autoComplete="username" />
    <div className="footer-buttons">
      <FButton type="dark" name="arrow-forward-outline" color="dark" className="connect-btn" disabled={!props.value}>
        {props.t("Suivant", "Suivant")}
      </FButton>
    </div>
  </div>
)

const PasswordField = props => (
  <FInput
    prepend append
    prependName="lock-outline"
    appendName={props.passwordVisible ? "eye-off-2-outline" : "eye-outline"}
    inputClassName="password-input"
    onAppendClick={props.onClick}
    {...props}
    type={props.passwordVisible ? "text" : "password"} id={props.id} 
    placeholder={props.placeholder && props.t("Login." + props.placeholder, props.placeholder)} autoComplete="password" />
)

const PasswordFooter = props => (
  <div className="footer-buttons">
    {props.userExists &&
      <Button type="button" color="transparent" className="mr-10 password-btn" onClick={props.upcoming}>
        <u>{props.t("Login.Mot de passe oublié ?", "Mot de passe oublié ?")}</u>
      </Button>}
    <FButton type="dark" name="log-in" color="dark" className="connect-btn" disabled={!props.value}>
      {props.t("Connexion", "Connexion")}
    </FButton>
  </div>
)

const RegisterHeader = props => (
  <Card className="card-login header-card cursor-pointer" onClick={props.goBack}>
    <CardBody>
      <EVAIcon name="corner-up-left-outline" fill={variables.noir} className="mr-20" />
      <span>{props.t("Login.no-account", "Il n'existe pas de compte à ce nom")}. </span>
    </CardBody>
  </Card>
)

const mapDispatchToProps = {fetch_user};

export default track({
  page: 'Login',
}, { dispatchOnMount: true })(
  connect(null, mapDispatchToProps)(
      withTranslation()(Login)
  )
);
