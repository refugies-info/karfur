import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import CreationLForm from './CreationLForm';

const langue= {};

const langues=[{
  "_id" : "5c8b89e8d492774888f1acaf",
  "langueFr" : "Arabe",
  "langueLoc" : "العربية",
  "langueCode" : "sa",
  "langueIsDialect" : false,
  "langueBackupId" : "undefined",
  "status" : "Active",
  "i18nCode" : "ar",
  "created_at" : "2019-03-15T11:18:00.538Z",
  "updatedAt" : "2019-03-23T23:09:05.242Z",
  "__v" : 15,
  "participants" : [ 
    "5c8f5affa56cba6f5b82db60", 
    "5c8f5affa56cba6f5b82db62", 
    "5c8f5affa56cba6f5b82db63", 
    "5c95099f5de3940eca6b7354", 
    "5c950b3b5de3940eca6b7364", 
    "5c96212e5de3940eca6b73e7", 
    "5c9623945de3940eca6b741e", 
    "5c96bbd65de3940eca6b7452", 
    "5c96bc7e5de3940eca6b745f"
  ]
},
{
  "_id" : "5c8b918d838c594a9884f561",
  "langueFr" : "Anglais",
  "langueLoc" : "English",
  "langueCode" : "gb",
  "i18nCode" : "en",
  "langueIsDialect" : false,
  "langueBackupId" : "undefined",
  "status" : "Active",
  "created_at" : "2019-03-15T11:50:37.877Z",
  "updatedAt" : "2019-03-23T12:16:53.843Z",
  "__v" : 11,
  "participants" : [ 
      "5c8f5affa56cba6f5b82db60", 
      "5c94af8b25aa640c19f35c00", 
      "5c95099f5de3940eca6b7354", 
      "5c950b3b5de3940eca6b7364", 
      "5c96212e5de3940eca6b73e7", 
      "5c9623945de3940eca6b741e"
  ]
}]

const handleChange = () => {};

describe('<CreationLForm />', () => {

  it('mounts without crashing', () => {
    const wrapper = shallow(<CreationLForm langue={langue} langues={langues} handleChange={handleChange}/>);
    wrapper.unmount()
  });

  it('should match its reference snapshot', () => {
    const wrapper = shallow(<CreationLForm langue={langue} langues={langues} handleChange={handleChange} />)
  
    expect(wrapper).to.matchSnapshot()
  })

  // it('collapse without crashing', () => {
  //   const wrapper = mount(<CreationLForm langue={langue} langues={langues} />);
  //   let selectInput = wrapper.find('#langueBackupId');
  //   console.log(selectInput)
  //   selectInput.simulate('click');
  //   // expect(wrapper.state().collapse).toEqual(false);
  //   // collapse.simulate('click');
  //   // expect(wrapper.state().collapse).toEqual(true);
  //   // wrapper.unmount()
  // });

  it('should edit input on key press', () => {
    const wrapper = shallow(<CreationLForm langue={langue} langues={langues} handleChange={handleChange} />)
  });

  it ('accepts langue props', () => {
    const wrapper = mount(<CreationLForm langue={langues[0]} langues={langues} handleChange={handleChange} />);
    expect(wrapper.props().langue).equal(langues[0])
  })
})