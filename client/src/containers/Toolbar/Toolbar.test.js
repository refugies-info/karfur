import React from 'react';
import {Toolbar} from './Toolbar';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

const mockStore = configureStore();
const store = mockStore({});

const defaultProps = {
  t:k=>k,
  location: {},
  user:{}
}

describe('Toolbar', () => {
  it('renders without crashing', () => {
    const wrapper = shallow(<Provider store={store}><Toolbar {...defaultProps} /></Provider> ).dive().dive();
    expect(wrapper).is.ok;
    expect(wrapper.is('header')).to.equal(true);
  });
})

