import React from 'react';
import ParkourOnBoard from './ParkourOnBoard';
import { expect } from 'chai';
import { shallow } from 'enzyme';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<ParkourOnBoard />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('should match its reference snapshot', () => {
  const wrapper = shallow(<ParkourOnBoard />)
  expect(wrapper).to.matchSnapshot()
});
