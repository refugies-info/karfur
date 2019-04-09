import React from 'react';
import UserForm from './UserForm';
import { expect } from 'chai';
import { shallow } from 'enzyme';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<UserForm />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('should match its reference snapshot', () => {
  const wrapper = shallow(<UserForm />)
  expect(wrapper).to.matchSnapshot()
});
