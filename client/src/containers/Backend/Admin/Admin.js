import React, { Component } from 'react';
import {Badge, Col, Row, Nav, NavItem, NavLink, TabContent} from 'reactstrap';
import track from 'react-tracking';
import Swal from 'sweetalert2';

import CustomTabPane from '../../../components/Backend/Admin/CustomTabPane'
import API from '../../../utils/API';
import EVAIcon from '../../../components/UI/EVAIcon/EVAIcon';

import './Admin.scss';
import variables from 'scss/colors.scss';

class Admin extends Component {
  state = {
    activeTab: new Array(5).fill('1'),
    orderedLangues : [],
    roles : [],
    users:[],
    langues : [],
    themes : [],
    structures: [],
    uploading:false,

    user:{
      picture: {
        imgId: '',
        public_id: '',
        secure_url: '',
      },
      username:'',
      password:'',
      email:'',
      description:'',
      selectedLanguages: [],
      objectifTemps : 20,
      objectifMots : 600,
      roles:[],
      _id:undefined,
      status:'Actif'
    },

    langue:{
      langueFr:'',
      langueLoc:'',
      langueCode:'',
      langueIsDialect:false,
      langueBackupId:"undefined",
      i18nCode : '',
      _id:undefined,
      status: 'Active',
      avancement: 0,
      participants:[],
    },

    theme:{
      themeNom:'',
      themeDescription:'',
      themeIsUnder:false,
      themeUnderId:"undefined",
      _id:undefined,
      status: 'Actif',
      avancement: 0,
      participants:[],
      articles:[],
    },

    structure:{
      nom:'',
      acronyme:'',
      link: '',
      contact: '',
      mail_contact:'',
      phone_contact:'',
      authorBelongs:false,
      status:'',
      picture: {
        imgId: '',
        public_id: '',
        secure_url: '',
      },
      siren:'',
      siret:'',
      adresse:'',
      mail_generique:'',
      createur: {},
      administrateur:undefined
    },
  };
  initial_state = {...this.state};
  shadowSelectedLanguages=[];
  
  componentDidMount (){
    API.get_roles({}).then(data_res => {
      this.setState({
        roles:data_res.data.data.map((el) => { return {...el, isChecked:false}}),
      })
    })

    API.get_users({}).then(data_res => {
      this.setState({users:data_res.data.data})
    })

    API.get_langues({}).then(data_res => {
      this.setState({
        langues:data_res.data.data.filter(el => el.langueFr !=='Français').map((el) => {return { ...el, isChecked:false}}),
      })
    })

    API.get_themes({}).then(data_res => {
      this.setState({themes:data_res.data.data})
    })

    API.get_structure({},{}, 'createur').then(data_res => {
      console.log(data_res.data.data);
      this.setState({structures:data_res.data.data})
    })
  }

  toggleTab(tabPane, tab) {
    const newArray = this.state.activeTab.slice()
    newArray[tabPane] = tab
    this.setState({
      activeTab: newArray,
    });
  }

  handleChange = event => {
    this.setState({
      [event.target.name]:{
        ...this.state[event.target.name],
        [event.target.id.replace('B|><','').replace('T|=R','').replace('K//R','')]: event.target.value
      }
    });
  }

  handleFileInputChange = event => {
    const name = event.currentTarget.name;
    this.setState({uploading:true});
    const formData = new FormData()
    formData.append(0, event.target.files[0])
    
    API.set_image(formData).then(data_res => {
      let imgData=data_res.data.data;
      console.log(this.state.uploading)
      this.setState({
        [name]:{
          ...this.state[name],
          picture: imgData
        },
        uploading:false,
      });
    })
  }

  onSelect = (item) => {
    console.log(item)
    this.setState(item, ()=> console.log(this.state));
    if(item.user){
      this.setState({
        langues:[...this.state.langues.map((el) => { return { ...el, isChecked: item.user.selectedLanguages.find(x => x._id === el._id) ? true : false}})],
        roles:[...this.state.roles.map((el) => { return { ...el, isChecked: item.user.roles.includes(el._id)}})],
      })
    }
  }

  handleCheck = (event) => {
    if(event.target.className.includes('langue')){
      let languesCopy=[...this.state.langues];
      let changedLangue=languesCopy[this.state.langues.findIndex((obj => obj._id === event.target.id))]
      changedLangue.isChecked=event.target.checked;
      let oldSelectedLanguages=[...this.state.user.selectedLanguages]
      this.setState({
        langues: languesCopy,
        user:{
          ...this.state.user,
          selectedLanguages: event.target.checked ? 
              [...oldSelectedLanguages, changedLangue] : 
              oldSelectedLanguages.filter(obj => obj._id !== event.target.id),
        }
      });
      this.shadowSelectedLanguages=event.target.checked ? 
        [...this.shadowSelectedLanguages, changedLangue] : 
        this.shadowSelectedLanguages.filter(obj => obj._id !== event.target.id)
    }else{
      let roleCopy=[...this.state.roles];
      let changedRole=roleCopy[this.state.roles.findIndex((obj => obj._id === event.target.id))]
      changedRole.isChecked=event.target.checked;
      let oldRoles=[...this.state.user.roles];
      this.setState({
        roles: roleCopy,
        user:{
          ...this.state.user,
          roles: event.target.checked ? 
              [...oldRoles, event.target.id] : 
              oldRoles.filter(obj => obj !== event.target.id),
        }
      });
    }
  }

  handleBelongsChange = () => this.setState(pS => ({ structure: {...pS.structure, authorBelongs: !pS.structure.authorBelongs } }));

  handleSliderChange = (value, name) => {
    this.setState({
      user:{
        ...this.state.user,
        [name]: value
      }
    })
  }
  
  handleDraggableListChange = (value) =>{
    let newOrder=[];
    value.forEach((item) => {
      newOrder.push({...this.state.user.selectedLanguages[item]})
    });
    this.shadowSelectedLanguages=newOrder;
  }

  validateUser = () => {
    let user={...this.state.user}
    if(this.shadowSelectedLanguages.length > 0){user.selectedLanguages = [...this.shadowSelectedLanguages]}
    if(user.username.length === 0){return;}
    if(user.password.length === 0){return;}
    if(user.selectedLanguages.length>0){user.selectedLanguages=[...user.selectedLanguages.map(el =>{return { _id: el._id, i18nCode: el.i18nCode, langueCode: el.langueCode, langueFr: el.langueFr, langueLoc: el.langueLoc}})]}
    if(!user._id){
      API.signup(user).then(data => {
        let newUser=data.data.data;
        newUser.password='Hidden'
        this.setState({users: [...this.state.users, newUser], user: this.initial_state.user});
      },error => {console.log(error);return;})
    }else{
      console.log(user)
      API.set_user_info(user).then(data => {
        let newUser=data.data.data;
        console.log(newUser)
        if(!newUser){return}
        newUser.password='Hidden';
        let usersCopy=[...this.state.users];
        usersCopy[this.state.users.findIndex((obj => obj._id === newUser._id))]=newUser;
        this.setState({users: usersCopy, user: this.initial_state.user});
      },error => {console.log(error);return;})
    }
    this.setState({
      langues:[...this.state.langues.map((el) => {return { ...el, isChecked:false}})],
      roles:[...this.state.roles.map((el) => {return { ...el, isChecked:false}})],
    });
  }

  preTraitementStruct = () => {
    if(!this.state.structure.nom || !this.state.structure.contact || (!this.state.structure.mail_contact && !this.state.structure.phone_contact)){Swal.fire( 'Oh non!', 'Certaines informations sont manquantes', 'error'); return;}
    let struct = {...this.state.structure};
    let membres = struct.membres || [];
    if(struct.administrateur === struct.createur._id){
      membres = membres.find( x=> x.userId === struct.createur._id) ? 
        membres.map( x => x.userId === struct.createur._id ? {...x, roles: ["createur", "administrateur"] } : x) :
        [...membres, {userId : struct.createur._id, roles: ["createur", "administrateur"] } ];
    }else if(struct.authorBelongs){
      membres = membres.find( x=> x.userId === struct.createur._id) ? 
        membres.map( x => x.userId === struct.createur._id ? {...x, roles: ["createur", "contributeur"] } : x) :
        [...membres, {userId : struct.createur._id, roles: ["createur", "contributeur"] } ];
      membres = membres.find( x=> x.userId === struct.administrateur) ? 
        membres.map( x => x.userId === struct.administrateur ? {...x, roles: ["administrateur"] } : x) :
        [...membres, {userId : struct.administrateur, roles: ["administrateur"] } ];
    }else{
      membres = membres.find( x=> x.userId === struct.administrateur) ? 
        membres.map( x => x.userId === struct.administrateur ? {...x, roles: ["administrateur"] } : x) :
        [...membres, {userId : struct.administrateur, roles: ["administrateur"] } ];
    }
    this.setState({structure : {...this.state.structure, membres: membres }}, 
      () => this.onValidate('structure'));
  }

  onValidate = (tab) => {
    console.log(this.state[tab])
    API['create_'+tab](this.state[tab]).then(data => {
      let newItem=data.data.data;
      if(this.state.theme._id){
        let itemsCopy=[...this.state[tab + 's']];
        itemsCopy[this.state[tab + 's'].findIndex((obj => obj._id === newItem._id))]=newItem;
        this.setState({[tab + 's']: itemsCopy});
      }else{
        this.setState({[tab + 's']: this.state[tab]._id ?
          this.state[tab + 's'].map(x => x._id === this.state[tab]._id ? newItem : x) :
          [...this.state[tab + 's'], newItem]});
      }
      this.setState({[tab]: this.initial_state[tab]})
    })
  }

  onCancel = (tab) => {
    this.setState({
      [tab]: this.initial_state[tab],
      langues:[...this.state.langues.map((el) => {return { ...el, isChecked:false}})],
      roles:[...this.state.roles.map((el) => {return { ...el, isChecked:false}})],
    });
  }

  render() {
    return (
      <div className="animated fadeIn admin">
        <Row>
          <Col>
            <Nav tabs>
              <NavItem>
                <NavLink
                  active={this.state.activeTab[3] === '1'}
                  onClick={() => { this.toggleTab(3, '1'); }}
                >
                  <i className="icon-user"></i>
                  <span className={this.state.activeTab[3] === '1' ? '' : 'd-none'}> Utilisateurs</span>
                  {'\u00A0'}<Badge color="success">{this.state.users.length}</Badge>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  active={this.state.activeTab[3] === '2'}
                  onClick={() => { this.toggleTab(3, '2'); }}
                >
                  <i className="flag-icon flag-icon-fr" title="fr" id="fr"></i>
                  <span className={this.state.activeTab[3] === '2' ? '' : 'd-none'}> 
                    Langues
                  </span>
                  {'\u00A0'}<Badge pill color="warning">{this.state.langues.length}</Badge>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  active={this.state.activeTab[3] === '3'}
                  onClick={() => { this.toggleTab(3, '3'); }} >
                    <i className="icon-pie-chart"></i>
                    <span className={this.state.activeTab[3] === '3' ? '' : 'd-none'}> Thèmes</span>
                    {'\u00A0'}<Badge pill color="info">{this.state.themes.length}</Badge>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  active={this.state.activeTab[3] === '4'}
                  onClick={() => { this.toggleTab(3, '4'); }} >
                    <EVAIcon name="shopping-bag-outline" fill={variables.noir} />
                    <span className={this.state.activeTab[3] === '4' ? '' : 'd-none'}> Structures</span>
                    {'\u00A0'}<Badge pill color="alert">{this.state.structures.length}</Badge>
                </NavLink>
              </NavItem>
            </Nav>
            <TabContent activeTab={this.state.activeTab[3]}>
              <CustomTabPane
                handleChange = {this.handleChange}
                onSelect={this.onSelect}
                handleCheck={this.handleCheck}
                handleSliderChange={this.handleSliderChange}
                handleDraggableListChange={this.handleDraggableListChange}
                handleFileInputChange={this.handleFileInputChange}
                handleBelongsChange={this.handleBelongsChange}
                validateUser={this.validateUser}
                onValidate={this.onValidate}
                onCancel={this.onCancel}
                preTraitementStruct={this.preTraitementStruct}
                isAdmin={true}
                {...this.state}  />
            </TabContent>
          </Col>
        </Row>
      </div>
    );
  }
}

export default track({
  page: 'Admin',
}, { dispatchOnMount: true })(Admin);
