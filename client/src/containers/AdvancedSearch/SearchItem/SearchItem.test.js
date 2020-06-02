import React from "react";
import { SearchItem } from "./SearchItem";
import { expect } from "chai";
import { shallow, mount } from "enzyme";
import sinon from "sinon";
import lolex from "lolex";
import { Dropdown } from "reactstrap";

import { initial_data } from "../data";
import EVAIcon from "../../../components/UI/EVAIcon/EVAIcon";
import FSearchBtn from "../../../components/FigmaUI/FSearchBtn/FSearchBtn";
import { filtres } from "../../Dispositif/data";

describe("SearchItem", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(
      <SearchItem
        t={(k) => k}
        item={initial_data[0]}
        keyValue={0}
        selectParam={() => {}}
        desactiver={() => {}}
      />
    );
  });

  it("renders without crashing", () => {
    expect(wrapper.is("div")).to.equal(true);
    expect(wrapper.find("span").at(0).text()).to.equal(
      "SearchItem.Je cherche à"
    );
  });

  it("calls componentDidMount", () => {
    sinon.spy(SearchItem.prototype, "componentDidMount");
    shallow(
      <SearchItem
        t={(k) => k}
        item={initial_data[0]}
        keyValue={0}
        selectParam={() => {}}
        desactiver={() => {}}
      />
    );
    expect(SearchItem.prototype.componentDidMount).to.have.property(
      "callCount",
      1
    );
    expect(wrapper.state().isMounted).to.be.a("boolean").that.is.true;
    SearchItem.prototype.componentDidMount.restore();
  });

  it("should match its reference snapshot", () => {
    expect(wrapper).to.matchSnapshot();
  });

  it("contains search-col in className", () => {
    expect(wrapper.props().className).to.contain("search-col");
  });

  it("should have an empty users list in state", () => {
    expect(wrapper.state().isMounted).to.be.a("boolean").that.is.false;
  });

  it("does not render children when passed in", () => {
    const wrapper = shallow(
      <SearchItem t={(k) => k} item={initial_data[0]}>
        <div className="unique" />
      </SearchItem>
    );
    expect(wrapper.contains(<div className="unique" />)).to.equal(false);
  });

  it("contains EVAIcon when active", () => {
    wrapper.setProps({ item: { ...initial_data[0], active: true } });
    expect(wrapper.find(EVAIcon)).to.have.lengthOf(1);
  });

  it("should have a dropdown", () => {
    expect(wrapper.find(Dropdown)).to.have.lengthOf(1);
  });

  it("should have as many options as there are themes", () => {
    expect(wrapper.find(FSearchBtn)).to.have.lengthOf(filtres.tags.length);
  });

  it("mounts without crashing", () => {
    const mounted = mount(
      <SearchItem t={(k) => k} item={initial_data[0]} />
    ).childAt(0);
    expect(mounted.is("div")).to.equal(true);
  });

  //Ne marche pas, le champ de recherche Google ne se charge pas même en attendant longtemps, j'abandonne
  // it('selects a place in searchBar', async(done) => {
  //   sinon.spy(SearchItem.prototype, 'componentDidMount');
  //   const onButtonClick = sinon.spy(SearchItem.prototype, "onPlaceSelected");
  //   const mounted = mount(<SearchItem t={k=>k} item={initial_data[1]} selectParam = {()=>{}} />);
  //   expect(SearchItem.prototype.componentDidMount).to.have.property('callCount', 1);
  //   expect(mounted.state().isMounted).to.be.a('boolean').that.is.true;
  //   console.log(new Date())
  //   // timeout(30000);

  //   await mounted.update()

  //   setTimeout(async function () {
  //     console.log(new Date())
  //     await mounted.update()
  //     console.log(mounted.debug())

  //     const btnNode = mounted.find('div.dropdown-toggle');
  //     expect( btnNode ).to.have.lengthOf(1);
  //     btnNode.simulate('click');
  //     const subBtnNode = mounted.find('button.search-btn').at(0);
  //     expect( subBtnNode ).to.have.lengthOf(1);
  //     subBtnNode.simulate('click');
  //     expect(onButtonClick.calledOnce).to.equal(true);
  //     onButtonClick.restore();
  //     clock.restore();
  //     SearchItem.prototype.componentDidMount.restore();
  //     done();
  //   }, 30000);

  // }, 30000);
});
