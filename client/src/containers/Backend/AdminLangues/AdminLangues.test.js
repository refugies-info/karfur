import React from 'react';
import AdminLangues from './AdminLangues';
import { expect } from 'chai';
import { shallow } from 'enzyme';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<AdminLangues />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('should match its reference snapshot', () => {
  const wrapper = shallow(<AdminLangues />)
  expect(wrapper).to.matchSnapshot()
});
