import { expect } from 'chai'
import React from 'react'
import ReactDOM from 'react-dom';
import { shallow } from 'enzyme'

import App from './App'

describe('App', () => {
  it('mounts without crashing', () => {
    const jsdomScroll = window.scrollTo;  // remember the jsdom alert
    window.scrollTo = () => {};  // provide an empty implementation for window.alert
    const div = document.createElement('div');
    ReactDOM.render(<App />, div);
    ReactDOM.unmountComponentAtNode(div);
    window.scrollTo = jsdomScroll;  // restore the jsdom alert
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