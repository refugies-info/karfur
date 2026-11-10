import { render, screen } from "@testing-library/react";
import DsfrLink from "./DsfrLink";

describe("DsfrLink", () => {
  it("renders a regular link with its destination", () => {
    render(<DsfrLink href="/fr/recherche">Search</DsfrLink>);
    expect(screen.getByRole("link", { name: "Search" }).getAttribute("href")).toBe("/fr/recherche");
  });

  it("renders a disabled link without destination", () => {
    render(
      <DsfrLink href="/" role="link" aria-disabled={true} className="fr-footer__top-link">
        Contact
      </DsfrLink>,
    );
    const link = screen.getByRole("link", { name: "Contact" });
    expect(link.hasAttribute("href")).toBe(false);
    expect(link.getAttribute("aria-disabled")).toBe("true");
    expect(link.className).toBe("fr-footer__top-link");
  });
});
