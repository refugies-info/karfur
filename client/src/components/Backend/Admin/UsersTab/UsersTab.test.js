import React from 'react';
import UsersTab from './UsersTab';
import { expect } from 'chai'
import { shallow } from 'enzyme'

describe('<UsersTab />', () => {
  it('mounts without crashing', () => {
    const wrapper = shallow(<UsersTab />);
    wrapper.unmount()
  });

  it('should match its reference snapshot', () => {
    const wrapper = shallow(<UsersTab />)
  
    expect(wrapper).to.matchSnapshot()
  })

  it('should edit input on key press', () => {
    const wrapper = shallow(<UsersTab />)
  });
})