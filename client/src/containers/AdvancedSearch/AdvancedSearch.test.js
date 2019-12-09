import React from 'react';
import {AdvancedSearch, ResponsiveFooter} from './AdvancedSearch';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import sinon from 'sinon';
import { CardFooter} from 'reactstrap';

import SearchItem from '../AdvancedSearch/SearchItem/SearchItem';
import {breakpoints} from 'utils/breakpoints.js';

const mockStore = configureStore();
const store = mockStore({});
const location = {search:""};

describe('AdvancedSearch', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<Provider store={store}><AdvancedSearch t={k=>k} location={location} /></Provider> ).dive().dive();
  })
  
  it('renders without crashing', () => {
    expect(wrapper.is('div')).to.equal(true);
    expect(wrapper.find(CardFooter).childAt(0).text()).to.equal("Chargement...");
  });

  it('calls componentDidMount', () => {
    sinon.spy(AdvancedSearch.prototype, 'componentDidMount');
    shallow(<Provider store={store}><AdvancedSearch t={k=>k} location={location} /></Provider> ).dive().dive();
    expect(AdvancedSearch.prototype.componentDidMount).to.have.property('callCount', 1);
    AdvancedSearch.prototype.componentDidMount.restore();
  });

  it('should match its reference snapshot', () => {
    expect(wrapper).to.matchSnapshot()
  });

  it('contains AdvancedSearch in className', () => {
    expect(wrapper.props().className).to.contain("advanced-search");
  });

  it('should have an empty dispositifs list in state', () => {
    expect(wrapper.state().dispositifs).to.be.an('array').that.is.empty;
  });

  it('renders children when passed in', () => {
    const wrapper = shallow((
      <Provider store={store}>
        <AdvancedSearch t={k=>k} location={location} >
          <div className="unique" />
        </AdvancedSearch>
      </Provider>
    ));
    expect(wrapper.contains(<div className="unique" />)).to.equal(true);
  });

  it('contains SearchItems', () => {
    expect(wrapper.containsMatchingElement(SearchItem)).to.equal(true);
  });

  it('should have 4 SearchItems', () => {
    expect(wrapper.find(SearchItem)).to.have.lengthOf(4);
  });

  it('should not show ResponsiveFooter by default', () => {
    expect(wrapper.find(ResponsiveFooter)).to.have.lengthOf(1);
    expect(wrapper.find(ResponsiveFooter).props("show")).to.be.false;
  });

  it('should show ResponsiveFooter on small screens', () => {
    wrapper.setProps({windowWidth: breakpoints.smLimit - 1})
    expect(wrapper.find(ResponsiveFooter).props("show")).to.be.true;
  });
})

