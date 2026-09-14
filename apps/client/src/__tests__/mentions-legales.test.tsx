import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import MentionsLegales from "../pages/mentions-legales";

jest.mock("next/router", () => require("next-router-mock"));

describe("mentions-legales", () => {
  it("underlines every body link so it stands out from the surrounding text", () => {
    render(<MentionsLegales />);

    const links = screen.getAllByRole("link");
    expect(links.map((link) => link.textContent?.trim())).toEqual([
      "contact@email.refugies.info",
      "notre politique de confidentialité",
      "contact@email.refugies.info",
      "Google Cloud France",
    ]);
    for (const link of links) {
      // `underline` opts the link out of the global reset in `scss/_dsfr-fix.scss`.
      expect(link).toHaveClass("underline");
    }
  });
});
