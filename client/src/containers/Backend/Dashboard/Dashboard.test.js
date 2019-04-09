import React from 'react';
import Dashboard from './Dashboard';
import { expect } from 'chai';
import { shallow } from 'enzyme';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Dashboard />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('should match its reference snapshot', () => {
  const wrapper = shallow(<Dashboard />)
  expect(wrapper).to.matchSnapshot()
});
