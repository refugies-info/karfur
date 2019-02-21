import React from 'react';
import HomePage from './HomePage';
import { expect } from 'chai';
import { shallow } from 'enzyme';

it('should match its reference snapshot', () => {
  const wrapper = shallow(<HomePage />)
  expect(wrapper).to.matchSnapshot()
});
