import { expect } from 'chai'
import React from 'react'
import { shallow } from 'enzyme'

import App from './App'

describe('<App />', () => {
  it('renders without crashing', () => {
    const wrapper = shallow(<App />)
  })

  it('should match its reference snapshot', () => {
    const wrapper = shallow(<App />)
  
    expect(wrapper).to.matchSnapshot()
  })

  it('should render correctly in "debug" mode', () => {
    const component = shallow(<App debug />);
  
    expect(component).to.matchSnapshot();
  });
})