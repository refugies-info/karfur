import React from 'react';
import Admin from './Admin';
import { expect } from 'chai';
import { shallow } from 'enzyme';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Admin />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('should match its reference snapshot', () => {
  const wrapper = shallow(<Admin />)
  expect(wrapper).to.matchSnapshot()
});
