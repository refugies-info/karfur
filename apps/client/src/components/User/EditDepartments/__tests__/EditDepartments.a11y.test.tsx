import "@testing-library/jest-dom";
import { act, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { initialMockStore } from "~/__fixtures__/reduxStore";
import { testUser } from "~/__fixtures__/user";
import { wrapWithProvidersAndRenderForTesting } from "../../../../../jest/lib/wrapWithProvidersAndRender";
import EditDepartments from "../EditDepartments";

jest.mock("next/router", () => require("next-router-mock"));

jest.mock("utils/API", () => ({
  __esModule: true,
  default: {
    updateUser: jest.fn().mockResolvedValue({}),
    isAuth: jest.fn().mockReturnValue(true),
  },
}));

const DEPARTMENTS = [
  { nom: "Paris", code: "75" },
  { nom: "Pas-de-Calais", code: "62" },
];

const stateWithUser = (departments?: string[]) => ({
  ...initialMockStore,
  user: { ...initialMockStore.user, user: { ...testUser, departments } },
});

const setIsLoading = jest.fn();

const renderComponent = async (departments?: string[]) => {
  const result = wrapWithProvidersAndRenderForTesting({
    Component: EditDepartments,
    compProps: { successCallback: jest.fn(), setIsLoading },
    reduxState: stateWithUser(departments),
  });
  // Let the one-off department fetch of useDepartmentAutocomplete settle.
  await act(async () => {});
  return result;
};

const getInput = () => screen.getByRole("combobox");

describe("EditDepartments, department combobox", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn().mockResolvedValue({
      json: () => Promise.resolve(DEPARTMENTS),
    }) as unknown as typeof fetch;
  });

  it("does not hijack a search role on the wrapping div", async () => {
    const { container } = await renderComponent();
    expect(container.querySelectorAll('[role="search"]')).toHaveLength(0);
  });

  it("exposes the APG combobox attributes, collapsed by default", async () => {
    await renderComponent();
    const input = getInput();

    expect(input).toHaveAttribute("aria-expanded", "false");
    expect(input).toHaveAttribute("aria-autocomplete", "list");
    // Both references point at nothing while the listbox is not rendered.
    expect(input).not.toHaveAttribute("aria-controls");
    expect(input).not.toHaveAttribute("aria-activedescendant");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("programmatically links the visible label to the search field", async () => {
    await renderComponent();
    expect(screen.getByLabelText(/Nom ou numéro du département/)).toBe(getInput());
  });

  it("opens a listbox of options once a search matches", async () => {
    const user = userEvent.setup();
    await renderComponent();

    await user.type(getInput(), "Paris");

    await waitFor(() => expect(screen.getByRole("listbox")).toBeInTheDocument());
    expect(getInput()).toHaveAttribute("aria-expanded", "true");
    expect(getInput()).toHaveAttribute("aria-controls", "departments-suggestions");
    expect(screen.getByRole("option", { name: "Paris" })).toBeInTheDocument();
  });

  it("moves the visual focus with the arrow keys without moving DOM focus", async () => {
    const user = userEvent.setup();
    await renderComponent();
    const input = getInput();

    await user.type(input, "Pa");
    await waitFor(() => expect(screen.getByRole("listbox")).toBeInTheDocument());

    await user.keyboard("{ArrowDown}");
    expect(input).toHaveAttribute("aria-activedescendant", "departments-option-75");
    expect(screen.getByRole("option", { name: "Paris" })).toHaveAttribute("aria-selected", "true");
    expect(input).toHaveFocus();

    await user.keyboard("{ArrowDown}");
    expect(input).toHaveAttribute("aria-activedescendant", "departments-option-62");

    // Wraps back to the first option.
    await user.keyboard("{ArrowDown}");
    expect(input).toHaveAttribute("aria-activedescendant", "departments-option-75");

    // Wraps backwards to the last option.
    await user.keyboard("{ArrowUp}");
    expect(input).toHaveAttribute("aria-activedescendant", "departments-option-62");
  });

  it("selects the active option with Enter without submitting the form", async () => {
    const user = userEvent.setup();
    const API = require("utils/API").default;
    await renderComponent();
    const input = getInput();

    await user.type(input, "Paris");
    await waitFor(() => expect(screen.getByRole("listbox")).toBeInTheDocument());

    await user.keyboard("{ArrowDown}{Enter}");

    expect(API.updateUser).not.toHaveBeenCalled();
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(input).toHaveValue("");
    expect(input).toHaveFocus();
    expect(screen.getByTitle("Retirer le département Paris (75)")).toBeInTheDocument();
  });

  it("closes on Escape, then clears the field on a second Escape", async () => {
    const user = userEvent.setup();
    await renderComponent();
    const input = getInput();

    await user.type(input, "Paris");
    await waitFor(() => expect(screen.getByRole("listbox")).toBeInTheDocument());

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(input).toHaveValue("Paris");

    await user.keyboard("{Escape}");
    expect(input).toHaveValue("");
  });

  it("keeps options out of the tab sequence", async () => {
    const user = userEvent.setup();
    await renderComponent();

    await user.type(getInput(), "Paris");
    await waitFor(() => expect(screen.getByRole("listbox")).toBeInTheDocument());

    expect(screen.getByRole("option", { name: "Paris" })).toHaveAttribute("tabindex", "-1");
  });

  it("announces how many suggestions were found", async () => {
    const user = userEvent.setup();
    await renderComponent();

    await user.type(getInput(), "Pa");

    // The announcer holds the message back by 1500 ms so the interface can settle.
    await waitFor(
      () =>
        expect(screen.getByRole("status")).toHaveTextContent(
          /2 suggestions trouvées, utilisez les flèches haut et bas/,
        ),
      { timeout: 4000 },
    );
  });

  it("announces the absence of suggestions once typing stops", async () => {
    const user = userEvent.setup();
    await renderComponent();

    await user.type(getInput(), "zz");

    // Timed from the last keystroke: the message lands ~1.5 s after typing
    // stops, outside the keyboard echo window where VoiceOver loses it.
    await waitFor(
      () =>
        expect(screen.getByRole("status")).toHaveTextContent(
          /Aucune suggestion trouvée, modifiez votre recherche/,
        ),
      { timeout: 4000 },
    );
  });

  it("does not submit the form when a department is removed", async () => {
    const user = userEvent.setup();
    const API = require("utils/API").default;
    await renderComponent();

    await user.type(getInput(), "Paris");
    await waitFor(() => expect(screen.getByRole("listbox")).toBeInTheDocument());
    await user.keyboard("{ArrowDown}{Enter}");

    const removeButton = screen.getByTitle("Retirer le département Paris (75)");
    expect(removeButton).toHaveAttribute("type", "button");

    await user.click(removeButton);

    expect(API.updateUser).not.toHaveBeenCalled();
    expect(screen.queryByTitle("Retirer le département Paris (75)")).not.toBeInTheDocument();
  });

  // The test above cannot fail if the preventDefault on Enter is removed: with no
  // department selected the submit button is disabled, so implicit submission
  // cannot fire in the first place. This one runs the dangerous case.
  it("does not submit on Enter when a department is already selected", async () => {
    const user = userEvent.setup();
    const API = require("utils/API").default;
    await renderComponent(["75 - Paris"]);
    const input = getInput();

    // Guard: the scenario is only meaningful if implicit submission is possible.
    expect(screen.getByRole("button", { name: /Valider/ })).toBeEnabled();

    await user.type(input, "Pas-de");
    await waitFor(() => expect(screen.getByRole("listbox")).toBeInTheDocument());

    await user.keyboard("{ArrowDown}{Enter}");

    expect(setIsLoading).not.toHaveBeenCalled();
    expect(API.updateUser).not.toHaveBeenCalled();
    expect(screen.getByTitle("Retirer le département Pas-de-Calais (62)")).toBeInTheDocument();
  });

  it("sends focus back to the field when a department is removed", async () => {
    const user = userEvent.setup();
    await renderComponent(["75 - Paris", "62 - Pas-de-Calais"]);

    await user.click(screen.getByTitle("Retirer le département Paris (75)"));

    expect(getInput()).toHaveFocus();
    expect(document.body).not.toHaveFocus();
    expect(screen.getByTitle("Retirer le département Pas-de-Calais (62)")).toBeInTheDocument();
  });

  it("does not lose focus nor stay silent when the last department is removed", async () => {
    const user = userEvent.setup();
    await renderComponent(["75 - Paris"]);

    await user.click(screen.getByTitle("Retirer le département Paris (75)"));

    // The whole chip list unmounts here, which is the case where focus used to
    // fall on <body> and the error appeared with nothing said.
    expect(screen.queryByTitle(/Retirer le département/)).not.toBeInTheDocument();
    expect(screen.getByText("Vous devez sélectionner au moins un département")).toBeInTheDocument();
    expect(getInput()).toHaveFocus();
    await waitFor(() =>
      expect(screen.getByRole("alert")).toHaveTextContent(
        /Département Paris \(75\) retiré\. Vous devez sélectionner au moins un département\./,
      ),
    );
  });
});
