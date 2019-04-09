import React from 'react';
import { expect } from 'chai'
import { shallow } from 'enzyme'
import CreationUForm from './CreationUForm';

describe('<CreationUForm />', () => {
  it('mounts without crashing', () => {
    const wrapper = shallow(<CreationUForm />);
    wrapper.unmount()
  });

  it('should match its reference snapshot', () => {
    const wrapper = shallow(<CreationUForm />)
  
    expect(wrapper).to.matchSnapshot()
  })

  it('should edit input on key press', () => {
    const wrapper = shallow(<CreationUForm />)
  });
})