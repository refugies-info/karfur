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

const reduxState = {
  ...initialMockStore,
  user: { ...initialMockStore.user, user: testUser },
};

const renderComponent = async () => {
  const result = wrapWithProvidersAndRenderForTesting({
    Component: EditDepartments,
    compProps: { successCallback: jest.fn() },
    reduxState,
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
    expect(input).toHaveAttribute("aria-controls", "departments-suggestions");
    expect(input).toHaveAttribute("aria-autocomplete", "list");
    expect(input).not.toHaveAttribute("aria-activedescendant");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("opens a listbox of options once a search matches", async () => {
    const user = userEvent.setup();
    await renderComponent();

    await user.type(getInput(), "Paris");

    await waitFor(() => expect(screen.getByRole("listbox")).toBeInTheDocument());
    expect(getInput()).toHaveAttribute("aria-expanded", "true");
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
});
