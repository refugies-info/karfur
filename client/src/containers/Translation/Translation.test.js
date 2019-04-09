import React from 'react';
import ReactDOM from 'react-dom';
import Translation from './Translation';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Translation />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('should match its reference snapshot', () => {
  const wrapper = shallow(<Translation />)
  expect(wrapper).to.matchSnapshot()
});
