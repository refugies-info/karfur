import React from "react";
import Backend from "./Backend";
import { expect } from "chai";
import { shallow } from "enzyme";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<Backend />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it("should match its reference snapshot", () => {
  const wrapper = shallow(<Backend />);
  expect(wrapper).to.matchSnapshot();
});
