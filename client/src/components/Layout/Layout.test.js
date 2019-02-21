import { expect } from 'chai'
import React from 'react'
import { shallow } from 'enzyme'
import sinon from 'sinon'

import Layout from './Layout'

describe('<Layout/>', () => {
  it('should trigger its `onClick` prop when clicked', () => {
    const onClick = sinon.spy()
    const wrapper = shallow(
      <Layout onClick={onClick}>fr</Layout>
    )

    wrapper.simulate('click')
    //expect(onClick).to.have.been.calledWith(0)
  })
})

it('should match its reference snapshot', () => {
  const wrapper = shallow(<Layout />)

  expect(wrapper).to.matchSnapshot()
})