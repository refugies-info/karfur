import React from 'react';
import ParkourPerso from './ParkourPerso';
import { expect } from 'chai';
import { shallow } from 'enzyme';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<ParkourPerso />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('should match its reference snapshot', () => {
  const wrapper = shallow(<ParkourPerso />)
  expect(wrapper).to.matchSnapshot()
});
