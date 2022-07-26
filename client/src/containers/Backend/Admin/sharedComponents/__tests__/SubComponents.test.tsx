// @ts-nocheck
import React from "react";
import TestRenderer from "react-test-renderer";
import "jest-styled-components";
import {
  TypeContenu,
  Title,
  Structure,
  StyledStatus,
  ValidateButton,
  SeeButton,
  DeleteButton,
  TabHeader,
  FilterButton,
} from "../SubComponents";

let component;

test("should render TypeContenu with dispositif, detailed vue", () => {
  component = TestRenderer.create(
    <TypeContenu type={"dispositif"} isDetailedVue={true} />
  );
  expect(component.toJSON()).toMatchSnapshot();
});

test("should render TypeContenu with demarche, detailed vue", () => {
  component = TestRenderer.create(
    <TypeContenu type={"demarche"} isDetailedVue={true} />
  );
  expect(component.toJSON()).toMatchSnapshot();
});

test("should render TypeContenu with dispositif, not detailed vue", () => {
  component = TestRenderer.create(
    <TypeContenu type={"dispositif"} isDetailedVue={false} />
  );
  expect(component.toJSON()).toMatchSnapshot();
});

test("should render TypeContenu with demarche, not detailed vue", () => {
  component = TestRenderer.create(
    <TypeContenu type={"demarche"} isDetailedVue={false} />
  );
  expect(component.toJSON()).toMatchSnapshot();
});

test("should render Title with titre marque", () => {
  component = TestRenderer.create(
    <Title titreInformatif="titre informatif" titreMarque="titre marque" />
  );
  expect(component.toJSON()).toMatchSnapshot();
});

test("should render Title without titre marque", () => {
  component = TestRenderer.create(<Title titreInformatif="titre informatif" />);
  expect(component.toJSON()).toMatchSnapshot();
});

test("should render Structure with null sponsor", () => {
  component = TestRenderer.create(<Structure sponsor={null} />);
  expect(component.toJSON()).toMatchSnapshot();
});

test("should render Structure with sponsor without nom", () => {
  const sponsor = { name: "test" };
  component = TestRenderer.create(<Structure sponsor={sponsor} />);
  expect(component.toJSON()).toMatchSnapshot();
});

test("should render Structure with sponsor actif", () => {
  const sponsor = { _id: "abc", nom: "test", status: "Actif" };
  component = TestRenderer.create(<Structure sponsor={sponsor} />);
  expect(component.toJSON()).toMatchSnapshot();
});

test("should render Structure with sponsor en attente", () => {
  const sponsor = { _id: "abc", nom: "test", status: "En attente" };
  component = TestRenderer.create(<Structure sponsor={sponsor} />);
  expect(component.toJSON()).toMatchSnapshot();
});

test("should render Structure with sponsor supprime", () => {
  const sponsor = { _id: "abc", nom: "test", status: "Supprimé" };
  component = TestRenderer.create(<Structure sponsor={sponsor} />);
  expect(component.toJSON()).toMatchSnapshot();
});

test("should render StyledStatus actif ", () => {
  component = TestRenderer.create(<StyledStatus text="Actif" />);
  expect(component.toJSON()).toMatchSnapshot();
});

test("should render StyledStatus en attente ", () => {
  component = TestRenderer.create(<StyledStatus text="En attente" />);
  expect(component.toJSON()).toMatchSnapshot();
});
test("should render StyledStatus Brouillon ", () => {
  component = TestRenderer.create(<StyledStatus text="Brouillon" />);
  expect(component.toJSON()).toMatchSnapshot();
});
test("should render StyledStatus En attente non prioritaire ", () => {
  component = TestRenderer.create(
    <StyledStatus text="En attente non prioritaire" />
  );
  expect(component.toJSON()).toMatchSnapshot();
});
test("should render StyledStatus Rejeté structure ", () => {
  component = TestRenderer.create(<StyledStatus text="Rejeté structure" />);
  expect(component.toJSON()).toMatchSnapshot();
});
test("should render StyledStatus En attente admin ", () => {
  component = TestRenderer.create(<StyledStatus text="En attente admin" />);
  expect(component.toJSON()).toMatchSnapshot();
});
test("should render StyledStatus Accepté structure ", () => {
  component = TestRenderer.create(<StyledStatus text="Accepté structure" />);
  expect(component.toJSON()).toMatchSnapshot();
});
test("should render StyledStatus Supprimé ", () => {
  component = TestRenderer.create(<StyledStatus text="Supprimé" />);
  expect(component.toJSON()).toMatchSnapshot();
});

test("should render StyledStatus no corresponding status ", () => {
  component = TestRenderer.create(<StyledStatus text="test" />);
  expect(component.toJSON()).toMatchSnapshot();
});

test("should render StyledStatus no corresponding with override ", () => {
  component = TestRenderer.create(
    <StyledStatus text="Actif" overrideColor={true} textToDisplay="test" />
  );
  expect(component.toJSON()).toMatchSnapshot();
});

test("should render StyledStatus no corresponding with color ", () => {
  component = TestRenderer.create(
    <StyledStatus
      text="Actif"
      overrideColor={false}
      textToDisplay="test"
      textColor="textColor"
      color="color"
    />
  );
  expect(component.toJSON()).toMatchSnapshot();
});

test("should render ValidateButton disabled", () => {
  component = TestRenderer.create(
    <ValidateButton onClick={() => {}} disabled={true} />
  );
  expect(component.toJSON()).toMatchSnapshot();
});

test("should render ValidateButton not disabled", () => {
  component = TestRenderer.create(
    <ValidateButton onClick={() => {}} disabled={false} />
  );
  expect(component.toJSON()).toMatchSnapshot();
});

test("should call onClick ValidateButton", () => {
  const onClick = jest.fn();
  component = TestRenderer.create(
    <ValidateButton onClick={onClick} disabled={false} />
  );
  component.root.findByProps({ "data-test-id": "validate-button" }).props.onClick();
  expect(onClick).toHaveBeenCalled();
});

test("should render SeeButton", () => {
  component = TestRenderer.create(<SeeButton burl="test-burl" />);
  expect(component.toJSON()).toMatchSnapshot();
});

test("should render DeleteButton disabled", () => {
  component = TestRenderer.create(
    <DeleteButton disabled={true} onClick={() => {}} />
  );
  expect(component.toJSON()).toMatchSnapshot();
});

test("should render DeleteButton not disabled", () => {
  component = TestRenderer.create(
    <DeleteButton disabled={false} onClick={() => {}} />
  );
  expect(component.toJSON()).toMatchSnapshot();
});

test("should call onClick DeleteButton", () => {
  const onClick = jest.fn();
  component = TestRenderer.create(
    <DeleteButton onClick={onClick} disabled={false} />
  );
  component.root.findByProps({ "data-test-id": "delete-button" }).props.onClick();
  expect(onClick).toHaveBeenCalled();
});

test("should render FilterButton isSelected false", () => {
  component = TestRenderer.create(
    <FilterButton isSelected={false} onClick={() => {}} text="test" />
  );
  expect(component.toJSON()).toMatchSnapshot();
});

test("should render FilterButton isSelected true", () => {
  component = TestRenderer.create(
    <FilterButton isSelected={true} onClick={() => {}} text="test" />
  );
  expect(component.toJSON()).toMatchSnapshot();
});

test("should render TabHeader up", () => {
  component = TestRenderer.create(
    <TabHeader name="test" order="true" isSortedHeader={true} sens="up" />
  );
  expect(component.toJSON()).toMatchSnapshot();
});

test("should render TabHeader down", () => {
  component = TestRenderer.create(
    <TabHeader name="test" order="true" isSortedHeader={true} sens="down" />
  );
  expect(component.toJSON()).toMatchSnapshot();
});

test("should render TabHeader no order", () => {
  component = TestRenderer.create(
    <TabHeader name="test" order={null} isSortedHeader={false} sens="down" />
  );
  expect(component.toJSON()).toMatchSnapshot();
});
