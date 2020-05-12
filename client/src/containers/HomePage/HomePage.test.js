import React from "react";
import { HomePage } from "./HomePage";
import { expect } from "chai";
import { shallow, mount } from "enzyme";
import configureStore from "redux-mock-store";
import { Provider } from "react-redux";
import axios from "axios";
import { MemoryRouter } from "react-router-dom";
import sinon from "sinon";
import { createBrowserHistory } from "history";
import { I18nextProvider } from "react-i18next";

import FButton from "../../components/FigmaUI/FButton/FButton";
import SearchItem from "../AdvancedSearch/SearchItem/SearchItem";
import EVAIcon from "../../components/UI/EVAIcon/EVAIcon";
import i18n from "../../i18n";

const mockStore = configureStore();
const store = mockStore({});
const history = createBrowserHistory();

describe("HomePage", () => {
  const wrapper = shallow(
    <Provider store={store}>
      <HomePage t={k => k} />
    </Provider>
  )
    .dive()
    .dive();

  it("renders without crashing", () => {
    console.log(wrapper.debug());
    expect(wrapper.is("div")).to.equal(true);
    expect(wrapper.find("h1").text()).to.equal(
      "Homepage.Construis ta vie en France"
    );
  });

  it("calls componentDidMount", () => {
    sinon.spy(HomePage.prototype, "componentDidMount");
    shallow(
      <Provider store={store}>
        <HomePage t={k => k} />
      </Provider>
    )
      .dive()
      .dive();
    expect(HomePage.prototype.componentDidMount).to.have.property(
      "callCount",
      1
    );
    HomePage.prototype.componentDidMount.restore();
  });

  it("should match its reference snapshot", () => {
    expect(wrapper).to.matchSnapshot();
  });

  it("contains homepage in className", () => {
    expect(wrapper.props().className).to.contain("homepage");
  });

  it("should have an empty users list in state", () => {
    expect(wrapper.state().users).to.be.an("array").that.is.empty;
  });

  it("renders children when passed in", () => {
    const wrapper = shallow(
      <Provider store={store}>
        <HomePage t={k => k}>
          <div className="unique" />
        </HomePage>
      </Provider>
    );
    expect(wrapper.contains(<div className="unique" />)).to.equal(true);
  });

  it("contains FButtons", () => {
    expect(wrapper.containsMatchingElement(FButton)).to.equal(true);
  });

  it("contains a search item", () => {
    expect(wrapper.containsMatchingElement(SearchItem)).to.equal(true);
  });

  it("contains an EVA Icon", () => {
    expect(
      wrapper.containsMatchingElement(
        <EVAIcon
          className="bottom-slider"
          name="arrow-circle-down"
          size="hero"
        />
      )
    ).to.equal(true);
  });

  it("should have 6 sections", () => {
    expect(wrapper.find("section")).to.have.lengthOf(6);
  });

  it("should have 6 FButtons", () => {
    expect(wrapper.find(FButton)).to.have.lengthOf(6);
  });

  it("renders a `.bottom-slider`", () => {
    expect(wrapper.find(".bottom-slider")).to.have.lengthOf(1);
  });

  it("should receive users from real API", function(done) {
    axios.interceptors.response.use(
      response => {
        const users = response.data.data;
        console.log(users);
        expect(users).to.be.an("array");
        expect(users).to.have.lengthOf.above(10);
        expect(users).to.have.nested.property("0._id");
        expect(users).to.have.nested.property("0.username");
        expect(users).to.have.nested.property("0.status");
        done();
        return response;
      },
      error => {
        console.log("Error: ", error.message);
      }
    );
    shallow(
      <Provider store={store}>
        <HomePage t={k => k} />
      </Provider>
    )
      .dive()
      .dive();
  });

  it("mounts without crashing", () => {
    const mounted = mount(
      <MemoryRouter>
        <I18nextProvider i18n={i18n}>
          <HomePage t={k => k} history={history} />
        </I18nextProvider>
      </MemoryRouter>
    )
      .childAt(0)
      .childAt(0)
      .childAt(0)
      .childAt(0);
    expect(mounted.is("div")).to.equal(true);
  });

  it("redirects to AdvancedSearch when SearchItem clicked", () => {
    const onButtonClick = sinon.spy(HomePage.prototype, "selectParam");
    const mounted = mount(
      <MemoryRouter>
        <I18nextProvider i18n={i18n}>
          <HomePage t={k => k} history={history} />
        </I18nextProvider>
      </MemoryRouter>
    );

    const btnNode = mounted.find("div.dropdown-toggle");
    expect(btnNode).to.have.lengthOf(1);
    btnNode.simulate("click");
    const subBtnNode = mounted.find("button.search-btn").at(0);
    expect(subBtnNode).to.have.lengthOf(1);
    subBtnNode.simulate("click");
    expect(onButtonClick.calledOnce).to.equal(true);
    onButtonClick.restore();
  });

  it("goes to AdvancedSearch when Card is clicked", () => {
    // const onButtonClick = sinon.spy(history, "push");
    const mounted = mount(
      <MemoryRouter>
        <I18nextProvider i18n={i18n}>
          <HomePage t={k => k} history={history} />
        </I18nextProvider>
      </MemoryRouter>
    );

    const btnNode = mounted.find("a.demarche-link");
    expect(btnNode).to.have.lengthOf(1);
    btnNode.simulate("click");
    expect(global.window.location.pathname).to.equal("/advanced-search");
    // onButtonClick.restore();
  });
});

// describe('mocking Homepage API', function () {
//   let wrapper;
//   beforeEach(async function () {
//     moxios.install()
//     wrapper = shallow(<Provider store={store}><HomePage t={k=>k} /></Provider> ).dive().dive();
//   })

//   afterEach(function () {
//     moxios.uninstall()
//   })

//   it('should receive users from mocked API', function (done) {
//     const fakeData = [
//       { id: 1, username: 'Fred', status: 'Actif' },
//       { id: 2, username: 'Wilma', status: 'Actif' }
//     ];
//     moxios.wait(function () {
//       let request = moxios.requests.at(0)
//       console.log(request)
//       if(request){
//         request.respondWith({
//           status: 200,
//           response: { data: fakeData }
//         }).then(function () {
//           expect(wrapper.state().users).to.deep.equal(fakeData);
//           done()
//         })
//       }
//     })
//   })
// })
