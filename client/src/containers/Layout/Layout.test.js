import React from 'react';
import {Layout} from './Layout';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

const mockStore = configureStore();
const store = mockStore({});

const defaultProps = {
  t:k=>k,
  langues: [],
  fetch_user: () => {},
  fetch_dispositifs: () => {},
  fetch_structures: () => {},
  fetch_langues: () => new Promise((rs, rj) => rs()),
}

describe('Layout', () => {
  it('renders without crashing', () => {
    const wrapper = shallow(<Provider store={store}><Layout {...defaultProps} /></Provider> ).dive().dive().dive();
    expect(wrapper).is.ok;
    expect(wrapper.is('div')).to.equal(true);
  });
})

