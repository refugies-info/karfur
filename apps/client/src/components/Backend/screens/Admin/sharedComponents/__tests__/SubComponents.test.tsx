//@ts-nocheck
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "jest-styled-components";
import { initialMockStore } from "~/__fixtures__/reduxStore";
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
  const { asFragment } = render(<TypeContenu type={"dispositif"} isDetailedVue={true} />);
  expect(asFragment()).toMatchSnapshot();
});

test("should render TypeContenu with demarche, detailed vue", () => {
  const { asFragment } = render(<TypeContenu type={"demarche"} isDetailedVue={true} />);
  expect(asFragment()).toMatchSnapshot();
});

test("should render TypeContenu with dispositif, not detailed vue", () => {
  const { asFragment } = render(<TypeContenu type={"dispositif"} isDetailedVue={false} />);
  expect(asFragment()).toMatchSnapshot();
});

test("should render TypeContenu with demarche, not detailed vue", () => {
  const { asFragment } = render(<TypeContenu type={"demarche"} isDetailedVue={false} />);
  expect(asFragment()).toMatchSnapshot();
});

test("should render Title with titre marque", () => {
  const { asFragment } = render(<Title titreInformatif="titre informatif" titreMarque="titre marque" />);
  expect(asFragment()).toMatchSnapshot();
});

test("should render Title without titre marque", () => {
  const { asFragment } = render(<Title titreInformatif="titre informatif" />);
  expect(asFragment()).toMatchSnapshot();
});

test("should render Structure with null sponsor", () => {
  const { asFragment } = render(<Structure sponsor={null} />);
  expect(asFragment()).toMatchSnapshot();
});

test("should render Structure with sponsor without nom", () => {
  const sponsor = { name: "test" };
  const { asFragment } = render(<Structure sponsor={sponsor} />);
  expect(asFragment()).toMatchSnapshot();
});

test("should render Structure with sponsor actif", () => {
  const sponsor = { _id: "abc", nom: "test", status: "Actif" };
  const { asFragment } = render(<Structure sponsor={sponsor} />);
  expect(asFragment()).toMatchSnapshot();
});

test("should render Structure with sponsor en attente", () => {
  const sponsor = { _id: "abc", nom: "test", status: "En attente" };
  const { asFragment } = render(<Structure sponsor={sponsor} />);
  expect(asFragment()).toMatchSnapshot();
});

test("should render Structure with sponsor supprime", () => {
  const sponsor = { _id: "abc", nom: "test", status: "Supprimé" };
  const { asFragment } = render(<Structure sponsor={sponsor} />);
  expect(asFragment()).toMatchSnapshot();
});

test("should render StyledStatus actif ", () => {
  const { asFragment } = wrapWithProvidersAndRenderForTesting({
    Component: StyledStatus,
    compProps: { text: "Actif" },
    reduxState: {
      ...initialMockStore,
    },
  });
  expect(asFragment()).toMatchSnapshot();
});

test("should render StyledStatus en attente ", () => {
  const { asFragment } = wrapWithProvidersAndRenderForTesting({
    Component: StyledStatus,
    compProps: { text: "En attente" },
    reduxState: {
      ...initialMockStore,
    },
  });
  expect(asFragment()).toMatchSnapshot();
});
test("should render StyledStatus Brouillon ", () => {
  const { asFragment } = wrapWithProvidersAndRenderForTesting({
    Component: StyledStatus,
    compProps: { text: "Brouillon" },
    reduxState: {
      ...initialMockStore,
    },
  });
  expect(asFragment()).toMatchSnapshot();
});
test("should render StyledStatus Rejeté structure ", () => {
  const { asFragment } = wrapWithProvidersAndRenderForTesting({
    Component: StyledStatus,
    compProps: { text: "Rejeté structure" },
    reduxState: {
      ...initialMockStore,
    },
  });
  expect(asFragment()).toMatchSnapshot();
});
test("should render StyledStatus En attente admin ", () => {
  const { asFragment } = wrapWithProvidersAndRenderForTesting({
    Component: StyledStatus,
    compProps: { text: "En attente admin" },
    reduxState: {
      ...initialMockStore,
    },
  });
  expect(asFragment()).toMatchSnapshot();
});
test("should render StyledStatus Accepté structure ", () => {
  const { asFragment } = wrapWithProvidersAndRenderForTesting({
    Component: StyledStatus,
    compProps: { text: "Accepté structure" },
    reduxState: {
      ...initialMockStore,
    },
  });
  expect(asFragment()).toMatchSnapshot();
});
test("should render StyledStatus Supprimé ", () => {
  const { asFragment } = wrapWithProvidersAndRenderForTesting({
    Component: StyledStatus,
    compProps: { text: "Supprimé" },
    reduxState: {
      ...initialMockStore,
    },
  });
  expect(asFragment()).toMatchSnapshot();
});

test("should render StyledStatus no corresponding status ", () => {
  const { asFragment } = wrapWithProvidersAndRenderForTesting({
    Component: StyledStatus,
    compProps: { text: "test" },
    reduxState: {
      ...initialMockStore,
    },
  });
  expect(asFragment()).toMatchSnapshot();
});

test("should render StyledStatus no corresponding with override ", () => {
  const { asFragment } = wrapWithProvidersAndRenderForTesting({
    Component: StyledStatus,
    compProps: { text: "Actif", overrideColor: true, textToDisplay: "test" },
    reduxState: {
      ...initialMockStore,
    },
  });
  expect(asFragment()).toMatchSnapshot();
});

test("should render StyledStatus no corresponding with color ", () => {
  const { asFragment } = wrapWithProvidersAndRenderForTesting({
    Component: StyledStatus,
    compProps: { text: "Actif", overrideColor: false, textToDisplay: "test", textColor: "textColor", color: "color" },
    reduxState: {
      ...initialMockStore,
    },
  });
  expect(asFragment()).toMatchSnapshot();
});

test("should render ValidateButton disabled", () => {
  const { asFragment } = render(<ValidateButton onClick={() => {}} disabled={true} />);
  expect(asFragment()).toMatchSnapshot();
});

test("should render ValidateButton not disabled", () => {
  const { asFragment } = render(<ValidateButton onClick={() => {}} disabled={false} />);
  expect(asFragment()).toMatchSnapshot();
});

test("should call onClick ValidateButton", async () => {
  const user = userEvent.setup();
  const onClick = jest.fn();
  render(<ValidateButton onClick={onClick} disabled={false} />);
  await user.click(screen.getByTestId("validate-button"));
  expect(onClick).toHaveBeenCalled();
});

test("should render SeeButton", () => {
  const { asFragment } = render(<SeeButton burl="test-burl" />);
  expect(asFragment()).toMatchSnapshot();
});

test("should render DeleteButton disabled", () => {
  const { asFragment } = render(<DeleteButton disabled={true} onClick={() => {}} />);
  expect(asFragment()).toMatchSnapshot();
});

test("should render DeleteButton not disabled", () => {
  const { asFragment } = render(<DeleteButton disabled={false} onClick={() => {}} />);
  expect(asFragment()).toMatchSnapshot();
});

test("should call onClick DeleteButton", async () => {
  const user = userEvent.setup();
  const onClick = jest.fn();
  render(<DeleteButton onClick={onClick} disabled={false} testId="delete_button" />);
  await user.click(screen.getByTestId("delete_button"));
  expect(onClick).toHaveBeenCalled();
});

test("should render FilterButton isSelected false", () => {
  const { asFragment } = render(<FilterButton isSelected={false} onClick={() => {}} text="test" />);
  expect(asFragment()).toMatchSnapshot();
});

test("should render FilterButton isSelected true", () => {
  const { asFragment } = render(<FilterButton isSelected={true} onClick={() => {}} text="test" />);
  expect(asFragment()).toMatchSnapshot();
});

test("should render TabHeader up", () => {
  const { asFragment } = render(<TabHeader name="test" order="true" isSortedHeader={true} sens="up" />);
  expect(asFragment()).toMatchSnapshot();
});

test("should render TabHeader down", () => {
  const { asFragment } = render(<TabHeader name="test" order="true" isSortedHeader={true} sens="down" />);
  expect(asFragment()).toMatchSnapshot();
});

test("should render TabHeader no order", () => {
  const { asFragment } = render(<TabHeader name="test" order={null} isSortedHeader={false} sens="down" />);
  expect(asFragment()).toMatchSnapshot();
});
