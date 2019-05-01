import { expect } from 'chai'
import React from 'react'
import { shallow } from 'enzyme'

import App from './App'

describe('<App />', () => {
  it('mounts without crashing', () => {
    const wrapper = shallow(<App />);
    wrapper.unmount()
  });

  it('should render correctly in "debug" mode', () => {
    const component = shallow(<App debug />);
  });

  it('should match its reference snapshot', () => {
    const wrapper = shallow(<App />)
  
    expect(wrapper).to.matchSnapshot()
  })

  // it('renders welcome message', function() {
  //   const wrapper = shallow(<App />); 
  //   const welcome = <h1>Bienvenue dans le projet Karfu'R</h1>;
  //   expect(wrapper.hasClass('hero-container')).to.equal(true);
  // });

  // it('calls componentDidMount', () => {
  //   jest.spyOn(App.prototype, 'componentDidMount')
  //   const wrapper = shallow(<App />)
  //   expect(App.prototype.componentDidMount.mock.calls.length).to.be(1)
  // })
})