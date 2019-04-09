import React from 'react';
import { expect } from 'chai'
import { shallow } from 'enzyme'
import SuccessModal from './SuccessModal';


describe('<SuccessModal />', () => {
  it('mounts without crashing', () => {
    const wrapper = shallow(<SuccessModal />);
    wrapper.unmount()
  });

  it('should match its reference snapshot', () => {
    const wrapper = shallow(<SuccessModal />)
  
    expect(wrapper).to.matchSnapshot()
  })
})