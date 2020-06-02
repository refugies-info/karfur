import React from "react";
import { Footer } from "./Footer";
import { expect } from "chai";
import { shallow } from "enzyme";

const defaultProps = {
  t: (k) => k,
};

describe("Footer", () => {
  it("renders without crashing", () => {
    const wrapper = shallow(<Footer {...defaultProps} />);
    expect(wrapper.is("div")).to.equal(true);
    expect(wrapper.props().className).to.contain("footer");
  });
});
