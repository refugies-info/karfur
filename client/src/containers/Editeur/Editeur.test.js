import React from 'react';
import Editeur from './Editeur';
import { expect } from 'chai';
import { shallow } from 'enzyme';

describe('<Editeur />', () => {
  it('mounts without crashing', () => {
    const wrapper = shallow(<Editeur />);
    //wrapper.unmount()
  });

  // it('should match its reference snapshot', () => {
  //   const wrapper = shallow(<Editeur />)
  
  //   expect(wrapper).to.matchSnapshot()
  // })
})