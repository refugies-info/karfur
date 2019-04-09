import React from 'react';
import ReactDOM from 'react-dom';
import AvancementTable from './AvancementTable';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<AvancementTable />, div);
  ReactDOM.unmountComponentAtNode(div);
});