import React from 'react';
import {HomePage} from './HomePage';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import sinon from 'sinon';
import moxios from 'moxios';
import axios from 'axios';

import FButton from '../../components/FigmaUI/FButton/FButton';
import SearchItem from '../AdvancedSearch/SearchItem/SearchItem';
import EVAIcon from '../../components/UI/EVAIcon/EVAIcon';
import API from '../../utils/API';

const mockStore = configureStore();
const store = mockStore({});


describe('HomePage', () => {
  describe('testing component', function () {
    const wrapper = shallow(<Provider store={store}><HomePage t={k=>k} /></Provider> ).dive().dive();
    it('renders without crashing', () => {
      expect(wrapper.is('div')).to.equal(true);
    });

    it('should match its reference snapshot', () => {
      expect(wrapper).to.matchSnapshot()
    });

    it('contains homepage in className', () => {
      expect(wrapper.props().className).to.contain("homepage");
    });

    it('should have an empty users list in state', () => {
      expect(wrapper.state().users).to.be.an('array').that.is.empty;
    });

    it('renders children when passed in', () => {
      const wrapper = shallow((
        <Provider store={store}>
          <HomePage t={k=>k} >
            <div className="unique" />
          </HomePage>
        </Provider>
      ));
      expect(wrapper.contains(<div className="unique" />)).to.equal(true);
    });

    it('contains FButtons', () => {
      expect(wrapper.containsMatchingElement(FButton)).to.equal(true);
    });

    it('contains a search item', () => {
      expect(wrapper.containsMatchingElement(SearchItem)).to.equal(true);
    });

    it('contains an EVA Icon', () => {
      expect(wrapper.containsMatchingElement(<EVAIcon className="bottom-slider" name="arrow-circle-down" size="hero"/>)).to.equal(true);
    });

    it('should have 6 sections', () => {
      expect(wrapper.find("section")).to.have.lengthOf(6);
    });

    it('should have 6 FButtons', () => {
      expect(wrapper.find(FButton)).to.have.lengthOf(6);
    });

    it('renders a `.bottom-slider`', () => {
      expect(wrapper.find('.bottom-slider')).to.have.lengthOf(1);
    });

    // it('simulates click events', () => {
    //   const onButtonClick = sinon.spy();
    //   // console.log(wrapper.props())
    //   expect(wrapper.find('.demarche-card')).to.have.lengthOf(1);
    //   wrapper.find('.demarche-card').simulate('click');
    //   console.log(onButtonClick)
    //   expect(onButtonClick).to.have.property('callCount', 1);
    // });
    
    it('should receive users from real API', function (done) {
      axios.interceptors.response.use(response => {
        const users = response.data.data;
        console.log(users.length)
        expect(users).to.be.an('array').that.is.not.empty;
        expect(users).to.have.lengthOf.above(10);
        expect(users).to.have.nested.property('0._id');
        expect(users).to.have.nested.property('0.username');
        expect(users).to.have.nested.property('0.status');
        done();
        return response;
      }, error => {
        console.log('Error: ', error.message);  
      })
      shallow(<Provider store={store}><HomePage t={k=>k} /></Provider> ).dive().dive(); 
    })
  });

  describe('mocking API', function () {
    let wrapper;
    beforeEach(async function () {
      moxios.install()
      wrapper = shallow(<Provider store={store}><HomePage t={k=>k} /></Provider> ).dive().dive();
    })

    afterEach(function () {
      moxios.uninstall()
    })

    it('should receive users from mocked API', function (done) {
      const fakeData = [
        { id: 1, username: 'Fred', status: 'Actif' },
        { id: 2, username: 'Wilma', status: 'Actif' }
      ];
      moxios.wait(function () {
        let request = moxios.requests.mostRecent()
        if(request){
          request.respondWith({
            status: 200,
            response: { data: fakeData }
          }).then(function () {
            expect(wrapper.state().users).to.deep.equal(fakeData);
            done()
          })
        }
      })
    })
  })
})
