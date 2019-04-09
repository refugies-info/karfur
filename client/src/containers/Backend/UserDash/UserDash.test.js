import React from 'react';
import UserDash from './UserDash';
import { expect } from 'chai';
import { shallow } from 'enzyme';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<UserDash />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('should match its reference snapshot', () => {
  const wrapper = shallow(<UserDash />)
  expect(wrapper).to.matchSnapshot()
});
