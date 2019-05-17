import React from 'react';
import RecordAudio from './RecordAudio';
import { expect } from 'chai';
import { shallow } from 'enzyme';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<RecordAudio />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('should match its reference snapshot', () => {
  const wrapper = shallow(<RecordAudio />)
  expect(wrapper).to.matchSnapshot()
});
