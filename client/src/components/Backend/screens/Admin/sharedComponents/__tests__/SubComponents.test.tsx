//@ts-nocheck
import { render } from "@testing-library/react";
import "jest-styled-components";
import { initialMockStore } from "__fixtures__/reduxStore";
import { wrapWithProvidersAndRenderForTesting } from "../../../../../../../jest/lib/wrapWithProvidersAndRender";
import {
  DeleteButton,
  FilterButton,
  SeeButton,
  Structure,
  StyledStatus,
  TabHeader,
  Title,
  TypeContenu,
  ValidateButton,
} from "../SubComponents";

test("should render TypeContenu with dispositif, detailed vue", () => {
  const component = render(<TypeContenu type={"dispositif"} isDetailedVue={true} />);
  expect(component).toMatchSnapshot();
});

test("should render TypeContenu with demarche, detailed vue", () => {
  const component = render(<TypeContenu type={"demarche"} isDetailedVue={true} />);
  expect(component).toMatchSnapshot();
});

test("should render TypeContenu with dispositif, not detailed vue", () => {
  const component = render(<TypeContenu type={"dispositif"} isDetailedVue={false} />);
  expect(component).toMatchSnapshot();
});

test("should render TypeContenu with demarche, not detailed vue", () => {
  const component = render(<TypeContenu type={"demarche"} isDetailedVue={false} />);
  expect(component).toMatchSnapshot();
});

test("should render Title with titre marque", () => {
  const component = render(<Title titreInformatif="titre informatif" titreMarque="titre marque" />);
  expect(component).toMatchSnapshot();
});

test("should render Title without titre marque", () => {
  const component = render(<Title titreInformatif="titre informatif" />);
  expect(component).toMatchSnapshot();
});

test("should render Structure with null sponsor", () => {
  const component = render(<Structure sponsor={null} />);
  expect(component).toMatchSnapshot();
});

test("should render Structure with sponsor without nom", () => {
  const sponsor = { name: "test" };
  const component = render(<Structure sponsor={sponsor} />);
  expect(component).toMatchSnapshot();
});

test("should render Structure with sponsor actif", () => {
  const sponsor = { _id: "abc", nom: "test", status: "Actif" };
  const component = render(<Structure sponsor={sponsor} />);
  expect(component).toMatchSnapshot();
});

test("should render Structure with sponsor en attente", () => {
  const sponsor = { _id: "abc", nom: "test", status: "En attente" };
  const component = render(<Structure sponsor={sponsor} />);
  expect(component).toMatchSnapshot();
});

test("should render Structure with sponsor supprime", () => {
  const sponsor = { _id: "abc", nom: "test", status: "Supprimé" };
  const component = render(<Structure sponsor={sponsor} />);
  expect(component).toMatchSnapshot();
});

test("should render StyledStatus actif ", () => {
  const component = wrapWithProvidersAndRenderForTesting({
    Component: StyledStatus,
    compProps: { text: "Actif" },
    reduxState: {
      ...initialMockStore,
    },
  });
  expect(component).toMatchSnapshot();
});

test("should render StyledStatus en attente ", () => {
  const component = wrapWithProvidersAndRenderForTesting({
    Component: StyledStatus,
    compProps: { text: "En attente" },
    reduxState: {
      ...initialMockStore,
    },
  });
  expect(component).toMatchSnapshot();
});
test("should render StyledStatus Brouillon ", () => {
  const component = wrapWithProvidersAndRenderForTesting({
    Component: StyledStatus,
    compProps: { text: "Brouillon" },
    reduxState: {
      ...initialMockStore,
    },
  });
  expect(component).toMatchSnapshot();
});
test("should render StyledStatus Rejeté structure ", () => {
  const component = wrapWithProvidersAndRenderForTesting({
    Component: StyledStatus,
    compProps: { text: "Rejeté structure" },
    reduxState: {
      ...initialMockStore,
    },
  });
  expect(component).toMatchSnapshot();
});
test("should render StyledStatus En attente admin ", () => {
  const component = wrapWithProvidersAndRenderForTesting({
    Component: StyledStatus,
    compProps: { text: "En attente admin" },
    reduxState: {
      ...initialMockStore,
    },
  });
  expect(component).toMatchSnapshot();
});
test("should render StyledStatus Accepté structure ", () => {
  const component = wrapWithProvidersAndRenderForTesting({
    Component: StyledStatus,
    compProps: { text: "Accepté structure" },
    reduxState: {
      ...initialMockStore,
    },
  });
  expect(component).toMatchSnapshot();
});
test("should render StyledStatus Supprimé ", () => {
  const component = wrapWithProvidersAndRenderForTesting({
    Component: StyledStatus,
    compProps: { text: "Supprimé" },
    reduxState: {
      ...initialMockStore,
    },
  });
  expect(component).toMatchSnapshot();
});

test("should render StyledStatus no corresponding status ", () => {
  const component = wrapWithProvidersAndRenderForTesting({
    Component: StyledStatus,
    compProps: { text: "test" },
    reduxState: {
      ...initialMockStore,
    },
  });
  expect(component).toMatchSnapshot();
});

test("should render StyledStatus no corresponding with override ", () => {
  const component = wrapWithProvidersAndRenderForTesting({
    Component: StyledStatus,
    compProps: { text: "Actif", overrideColor: true, textToDisplay: "test" },
    reduxState: {
      ...initialMockStore,
    },
  });
  expect(component).toMatchSnapshot();
});

test("should render StyledStatus no corresponding with color ", () => {
  const component = wrapWithProvidersAndRenderForTesting({
    Component: StyledStatus,
    compProps: { text: "Actif", overrideColor: false, textToDisplay: "test", textColor: "textColor", color: "color" },
    reduxState: {
      ...initialMockStore,
    },
  });
  expect(component).toMatchSnapshot();
});

test("should render ValidateButton disabled", () => {
  const component = render(<ValidateButton onClick={() => {}} disabled={true} />);
  expect(component).toMatchSnapshot();
});

test("should render ValidateButton not disabled", () => {
  const component = render(<ValidateButton onClick={() => {}} disabled={false} />);
  expect(component).toMatchSnapshot();
});

test("should call onClick ValidateButton", () => {
  const onClick = jest.fn();
  const component = render(<ValidateButton onClick={onClick} disabled={false} />);
  component.root.findByProps({ "data-testid": "validate-button" }).props.onClick();
  expect(onClick).toHaveBeenCalled();
});

test("should render SeeButton", () => {
  const component = render(<SeeButton burl="test-burl" />);
  expect(component).toMatchSnapshot();
});

test("should render DeleteButton disabled", () => {
  const component = render(<DeleteButton disabled={true} onClick={() => {}} />);
  expect(component).toMatchSnapshot();
});

test("should render DeleteButton not disabled", () => {
  const component = render(<DeleteButton disabled={false} onClick={() => {}} />);
  expect(component).toMatchSnapshot();
});

test("should call onClick DeleteButton", () => {
  const onClick = jest.fn();
  const component = render(<DeleteButton onClick={onClick} disabled={false} />);
  component.root.findByProps({ "data-testid": "delete-button" }).props.onClick();
  expect(onClick).toHaveBeenCalled();
});

test("should render FilterButton isSelected false", () => {
  const component = render(<FilterButton isSelected={false} onClick={() => {}} text="test" />);
  expect(component).toMatchSnapshot();
});

test("should render FilterButton isSelected true", () => {
  const component = render(<FilterButton isSelected={true} onClick={() => {}} text="test" />);
  expect(component).toMatchSnapshot();
});

test("should render TabHeader up", () => {
  const component = render(<TabHeader name="test" order="true" isSortedHeader={true} sens="up" />);
  expect(component).toMatchSnapshot();
});

test("should render TabHeader down", () => {
  const component = render(<TabHeader name="test" order="true" isSortedHeader={true} sens="down" />);
  expect(component).toMatchSnapshot();
});

test("should render TabHeader no order", () => {
  const component = render(<TabHeader name="test" order={null} isSortedHeader={false} sens="down" />);
  expect(component).toMatchSnapshot();
});
