import React from 'react';
import ReactDOM from 'react-dom';
import OnBoardingTraducteurModal from './OnBoardingTraducteurModal';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<OnBoardingTraducteurModal />, div);
  ReactDOM.unmountComponentAtNode(div);
});