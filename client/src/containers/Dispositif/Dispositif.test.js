import React from 'react';
import {Dispositif} from './Dispositif';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import sinon from 'sinon';
import axios from 'axios';
import MongoClient, {ObjectId} from "mongodb";
import { MemoryRouter } from 'react-router-dom';

import {breakpoints} from 'utils/breakpoints.js';
import ContenuDispositif from '../../components/Frontend/Dispositif/ContenuDispositif/ContenuDispositif';
import { DispositifCreateModal } from '../../components/Modals';

const mockStore = configureStore();
const store = mockStore({});
const mockId = "a0000000000000000000000a"; //5d88cd1932115f0b03ed95db
const match = {path: "/dispositif/" + mockId, params:{id: mockId}}
const mockDispo = {
  _id: new ObjectId(mockId), 
  "traductions" : [],
  "participants" : [],
  "titreInformatif" : "mockDispo",
  "titreMarque" : "mockDispoMarque",
  "abstract" : "mockDispoAbstract",
  contenu: new Array(4).fill(false),
  sponsors: [],
  tags:[],
  "typeContenu" : "dispositif",
  status: "Inactif"
};
console.log("shallow is : ", shallow)
const defaultProps = {
  t:k=>k,
  match,
  history:{push:() => {}},
  tracking:{trackEvent: () => {}},
  windowWidth: 1200
}

describe('Dispositif', () => {
  let wrapper, connection, db;
  beforeEach(async () => {
    connection = await MongoClient.connect('mongodb://localhost/db', {
      useNewUrlParser: true,
    });
    db = await connection.db("db");
    const collection = db.collection('dispositifs');

    await collection.findOne({_id: new ObjectId(mockId)});
    await collection.remove({_id: new ObjectId(mockId)});
    await collection.findOne({_id: new ObjectId(mockId)});
    await collection.insert(mockDispo);
    await collection.findOne({_id: new ObjectId(mockId)});

    wrapper = shallow(<Provider store={store}><MemoryRouter><Dispositif {...defaultProps} /></MemoryRouter></Provider> ).dive().dive().dive().dive();
  })
  
  afterAll(async () => {
    const collection = db.collection('dispositifs');
    await collection.remove({_id: new ObjectId(mockId)});
    await connection.close();
    await db.close();
  });

  it('should insert correct test document', async () => {
    const collection = db.collection('dispositifs');
    const insertedDoc = await collection.findOne({_id: new ObjectId(mockId)});
    expect(insertedDoc).to.deep.equal(mockDispo);
  });

  it('renders without crashing', () => {
    expect(wrapper.is('div')).to.equal(true);
    expect(wrapper.find('h1').at(0).childAt(0).props().html).to.equal("Titre informatif");
  });

  it('contains Dispositif in className', () => {
    expect(wrapper.props().className).to.contain("dispositif");
  });

  it('calls componentDidMount', () => {
    sinon.spy(Dispositif.prototype, 'componentDidMount');
    shallow(<Provider store={store}><MemoryRouter><Dispositif {...defaultProps} /></MemoryRouter></Provider> ).dive().dive().dive().dive();
    expect(Dispositif.prototype.componentDidMount).to.have.property('callCount', 1);
    Dispositif.prototype.componentDidMount.restore();
  });

  it('should match its reference snapshot', () => {
    expect(wrapper).to.matchSnapshot()
  });

  it('should have an empty menu list in state', () => {
    expect(wrapper.state().menu).to.be.an('array').that.is.empty;
  });

  it('renders children when passed in', () => {
    const wrapper = shallow((
      <Provider store={store}>
        <Dispositif {...defaultProps} >
          <div className="unique" />
        </Dispositif>
      </Provider>
    ));
    expect(wrapper.contains(<div className="unique" />)).to.equal(true);
  });

  it('contains ContenuDispositif', () => {
    expect(wrapper.containsMatchingElement(ContenuDispositif)).to.equal(true);
  });

  it('should have an ecran-protection on load', () => {
    expect(wrapper.find("div.ecran-protection")).to.have.lengthOf(1);
  });

  it('should not show DispositifCreateModal by default', () => {
    expect(wrapper.find(DispositifCreateModal)).to.have.lengthOf(1);
    expect(wrapper.find(DispositifCreateModal).props("show")).to.be.false;
  });

  it('should show `Retour à la recherche` only on small screens', () => {
    expect(wrapper.find(".btn-retour")).to.have.lengthOf(1);
    wrapper.setProps({windowWidth: breakpoints.smLimit - 1})
    expect(wrapper.find(".btn-retour")).to.have.lengthOf(0);
  });

  it('should update title when state updates', () => {
    wrapper.setState({content: {titreInformatif: "mockDispo"}})
    expect(wrapper.find('h1').at(0).childAt(0).props().html).to.equal("mockDispo");
  });

  it('should receive dispositif from real API', function (done) {
    axios.interceptors.response.use(async response => {
      if(response.config.url.includes('http://localhost:3000/dispositifs/get_dispositif')){
        const data = response.data.data;
        expect(data).to.be.an('array').that.is.not.empty;
        expect(data).to.have.lengthOf(1);
        expect(data).to.have.nested.property('0._id');
        expect(data).to.have.nested.property('0.titreInformatif');
        expect(data).to.have.nested.property('0.contenu');
        done();
      }
      return response;
    }, error => {
      console.log('Error: ', error.message);  
    })
    shallow(<Provider store={store}><MemoryRouter><Dispositif {...defaultProps} /></MemoryRouter></Provider> ).dive().dive().dive().dive();
  })
})

