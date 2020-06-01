import React from "react";
import { Login } from "./Login";
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

describe("Login", () => {
  it("renders without crashing", () => {
    const wrapper = shallow(
      <Provider store={store}>
        <Login {...defaultProps} />
      </Provider>
    )
      .dive()
      .dive();
    expect(wrapper).is.ok;
    expect(wrapper.is("div")).to.equal(true);
  });
});
