import React from 'react';
import ReactDOM from 'react-dom';
import DraggableList from './DraggableList';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<DraggableList />, div);
  ReactDOM.unmountComponentAtNode(div);
});
