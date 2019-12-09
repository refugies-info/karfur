import React from 'react';
import {StringTranslation} from './StringTranslation';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

const mockStore = configureStore();
const store = mockStore({});

const defaultProps = {
  t:k=>k,
  langue: {}, 
  francais: {}, 
  score: {}, 
  translated: {},
  time: 0,
}

describe('Login', () => {
  it('renders without crashing', () => {
    const wrapper = shallow(<Provider store={store}><StringTranslation {...defaultProps} /></Provider> ).dive().dive();
    expect(wrapper).is.ok;
    expect(wrapper.is('div')).to.equal(true);
  });
})

