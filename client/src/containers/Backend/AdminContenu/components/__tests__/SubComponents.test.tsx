// @ts-nocheck
import React from "react";
import TestRenderer from "react-test-renderer";
import "jest-styled-components";
import { TypeContenu } from "../SubComponents";

let wrapper;

test("should render TypeContenu with dispositif, detailed vue", () => {
  wrapper = TestRenderer.create(
    <TypeContenu type={"dispositif"} isDetailedVue={true} />
  );
  expect(wrapper.toJSON()).toMatchSnapshot();
});

test("should render TypeContenu with demarche, detailed vue", () => {
  wrapper = TestRenderer.create(
    <TypeContenu type={"demarche"} isDetailedVue={true} />
  );
  expect(wrapper.toJSON()).toMatchSnapshot();
});

test("should render TypeContenu with dispositif, not detailed vue", () => {
  wrapper = TestRenderer.create(
    <TypeContenu type={"dispositif"} isDetailedVue={false} />
  );
  expect(wrapper.toJSON()).toMatchSnapshot();
});

test("should render TypeContenu with demarche, not detailed vue", () => {
  wrapper = TestRenderer.create(
    <TypeContenu type={"demarche"} isDetailedVue={false} />
  );
  expect(wrapper.toJSON()).toMatchSnapshot();
});
