import React from 'react';
import ReactDOM from 'react-dom';
import Avancement from './Avancement';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Avancement />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('should match its reference snapshot', () => {
  const wrapper = shallow(<Avancement />)
  expect(wrapper).to.matchSnapshot()
});
