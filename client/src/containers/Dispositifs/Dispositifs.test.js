import React from 'react';
import Dispositifs from './Dispositifs';
import { expect } from 'chai';
import { shallow } from 'enzyme';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Dispositifs />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('should match its reference snapshot', () => {
  const wrapper = shallow(<Dispositifs />)
  expect(wrapper).to.matchSnapshot()
});
