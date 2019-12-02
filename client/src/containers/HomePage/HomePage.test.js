import React from 'react';
import HomePage from './HomePage';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import ReactDOM from 'react-dom';

describe('HomePage', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<HomePage />, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  it('should match its reference snapshot', () => {
    const wrapper = shallow(<HomePage />)
    expect(wrapper).to.matchSnapshot()
  });
})
