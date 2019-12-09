import React from 'react';
import {UserProfile, PasswordModal} from './UserProfile';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import sinon from 'sinon';
import axios from 'axios';
import { Modal } from 'reactstrap';
import MongoClient, {ObjectId} from "mongodb";

import { FavoriTable, ContribTable, ActionTable, TradTable } from '../../../components/Backend/UserProfile';
import { ThanksModal, SuggestionModal, TraducteurModal, ObjectifsModal, AddMemberModal } from '../../../components/Modals';

const mockStore = configureStore();
const store = mockStore({});
const mockId = "a0000000000000000000000a"; //"5cbabcdbcabae0fd31cb13e0"
const mockUser = {
  _id: new ObjectId(mockId), //"5cbabcdbcabae0fd31cb13e0",
  "username" : "mockUser",
  "status" : "Inactif",
  "description" : "description",
  "email" : "mockUser@mockUser.fr",
  "cookies" : { },
  "contributions" : [],
  "structures" : [],
  "roles" : [],
  selectedLanguages: [],
};

const defaultProps = {
  t:k=>k,
  user: mockUser,
}

describe('UserProfile', () => {
  let wrapper, connection, db;
  beforeEach(async () => {
    connection = await MongoClient.connect('mongodb://localhost/db', {
      useNewUrlParser: true,
    });
    db = await connection.db("db");
    const users = db.collection('users');

    await users.findOne({_id: new ObjectId(mockId)});
    console.log('removing mockUser')
    await users.remove({_id: new ObjectId(mockId)});
    console.log('mockUser removed')
    await users.findOne({_id: new ObjectId(mockId)});
    console.log('inserting mockUser')
    await users.insert(mockUser);
    console.log('mockUser inserted')
    await users.findOne({_id: new ObjectId(mockId)});

    wrapper = shallow(<Provider store={store}><UserProfile {...defaultProps} /></Provider> ).dive().dive();
  })

  afterAll(async () => {
    const users = db.collection('users');
    await users.remove({_id: new ObjectId(mockId)});
    await connection.close();
    await db.close();
  });

  it('should insert correct test user', async () => {
    const users = db.collection('users');
    const insertedUser = await users.findOne({_id: new ObjectId(mockId)});
    expect(insertedUser).to.deep.equal(mockUser);
  });

  it('renders without crashing', () => {
    expect(wrapper.is('div')).to.equal(true);
    expect(wrapper.find('span.hideOnPhone').at(0).text()).to.equal("Tables.Mon profil");
  });

  it('contains UserProfile in className', () => {
    expect(wrapper.props().className).to.contain("user-profile");
  });

  it('calls componentDidMount', () => {
    sinon.spy(UserProfile.prototype, 'componentDidMount');
    shallow(<Provider store={store}><UserProfile {...defaultProps} /></Provider> ).dive().dive();
    expect(UserProfile.prototype.componentDidMount).to.have.property('callCount', 1);
    UserProfile.prototype.componentDidMount.restore();
  });

  it('should match its reference snapshot', () => {
    expect(wrapper).to.matchSnapshot()
  });

  it('renders props correctly', () => {
    expect(wrapper.find('h2.name').text()).to.equal(defaultProps.user.username);
  });

  it('should have an empty user in state', () => {
    expect(wrapper.state().user).to.be.an('object').that.is.empty;
  });

  it('renders children when passed in', () => {
    const wrapper = shallow((
      <Provider store={store}>
        <UserProfile {...defaultProps} >
          <div className="unique" />
        </UserProfile>
      </Provider>
    ));
    expect(wrapper.contains(<div className="unique" />)).to.equal(true);
  });

  it('should contain all tables', () => {
    expect(wrapper.containsMatchingElement(FavoriTable)).to.equal(true);
    expect(wrapper.containsMatchingElement(ContribTable)).to.equal(true);
    expect(wrapper.containsMatchingElement(TradTable)).to.equal(true);
    expect(wrapper.containsMatchingElement(ActionTable)).to.equal(true);
  });

  it('should have 4 modals', () => {
    expect(wrapper.find(Modal)).to.have.lengthOf(4);
  });

  it('should contain all external modals', () => {
    expect(wrapper.containsMatchingElement(ThanksModal)).to.equal(true);
    expect(wrapper.containsMatchingElement(SuggestionModal)).to.equal(true);
    expect(wrapper.containsMatchingElement(TraducteurModal)).to.equal(true);
    expect(wrapper.containsMatchingElement(ObjectifsModal)).to.equal(true);
    expect(wrapper.containsMatchingElement(AddMemberModal)).to.equal(true);
    expect(wrapper.containsMatchingElement(PasswordModal)).to.equal(true);
  });

  it('all modals should be hidden', () => {
    expect(wrapper.find(ThanksModal).props().show).to.equal(false);
    expect(wrapper.find(SuggestionModal).props().show).to.equal(false);
    expect(wrapper.find(TraducteurModal).props().show).to.equal(false);
    expect(wrapper.find(ObjectifsModal).props().show).to.equal(false);
    expect(wrapper.find(AddMemberModal).props().show).to.equal(false);
    expect(wrapper.find(PasswordModal).props().show).to.equal(false);
  });

  it('should receive users from real API', function (done) {
    axios.interceptors.response.use(response => {
      if(response.config.url.includes('http://localhost:3000/user/get_users')){
        const data = response.data.data;
        expect(data).to.be.an('array').that.is.not.empty;
        expect(data).to.have.lengthOf.above(1);
        expect(data).to.have.nested.property('0._id');
        expect(data).to.have.nested.property('0.username');
        done();
      }
      return response;
    }, error => {
      console.log('Error: ', error.message);  
    })
    shallow(<Provider store={store}><UserProfile {...defaultProps} /></Provider> ).dive().dive();
  })
})

