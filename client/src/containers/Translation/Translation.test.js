import React from 'react';
import {TranslationHOC} from './Translation';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

const mockStore = configureStore();
const store = mockStore({});
const mockId = "a0000000000000000000000a"; //5d88cd1932115f0b03ed95db
const match = {path: "/dispositif/" + mockId, params:{id: mockId}}

const defaultProps = {
  t:k=>k,
  location: {search: ""},
  match
}

describe('TranslationHOC', () => {
  it('renders without crashing', () => {
    const wrapper = shallow(<Provider store={store}><TranslationHOC {...defaultProps} /></Provider> ).dive().dive();
    expect(wrapper).is.ok;
  });
})

