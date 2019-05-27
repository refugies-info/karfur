import React from 'react';
import UserDashContrib from './UserDashContrib';
import { expect } from 'chai';
import { shallow } from 'enzyme';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<UserDashContrib />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('should match its reference snapshot', () => {
  const wrapper = shallow(<UserDashContrib />)
  expect(wrapper).to.matchSnapshot()
});
