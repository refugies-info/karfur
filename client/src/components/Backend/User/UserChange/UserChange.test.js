import React from "react";
import UserChange from "./UserChange";
import { expect } from "chai";
import { shallow } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

const mockStore = configureStore();
const store = mockStore({});

const defaultProps = {
  t: (k) => k,
  location: {},
};

describe("UserChange", () => {
  it("renders without crashing", () => {
    const wrapper = shallow(
      <Provider store={store}>
        <UserChange {...defaultProps} />
      </Provider>
    )
      .dive()
      .dive();
    expect(wrapper).is.ok;
  });
});
