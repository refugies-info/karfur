import { render, screen } from "@testing-library/react";
import { DsfrLink } from "./DsfrLink";

describe("DsfrLink", () => {
  it("renders a regular link with its destination", () => {
    render(<DsfrLink href="/fr/recherche">Search</DsfrLink>);
    expect(screen.getByRole("link", { name: "Search" }).getAttribute("href")).toBe("/fr/recherche");
  });

  it.each([
    ["a boolean", true],
    ["a string", "true"],
  ] as const)("renders a disabled link without destination when aria-disabled is %s", (_, value) => {
    render(
      <DsfrLink
        href="/"
        role="link"
        aria-disabled={value}
        className="fr-footer__top-link"
        replace
        locale="fr"
      >
        Contact
      </DsfrLink>,
    );
    const link = screen.getByRole("link", { name: "Contact" });
    expect(link.hasAttribute("href")).toBe(false);
    expect(link.getAttribute("aria-disabled")).toBe("true");
    expect(link.className).toBe("fr-footer__top-link");
    expect(link.hasAttribute("replace")).toBe(false);
    expect(link.hasAttribute("locale")).toBe(false);
  });

  it("keeps the destination when the link is not marked as a disabled link", () => {
    render(
      <>
        <DsfrLink href="/a" aria-disabled={true}>
          No role
        </DsfrLink>
        <DsfrLink href="/b" role="link" aria-disabled={false}>
          Enabled
        </DsfrLink>
      </>,
    );
    expect(screen.getByRole("link", { name: "No role" }).getAttribute("href")).toBe("/a");
    expect(screen.getByRole("link", { name: "Enabled" }).getAttribute("href")).toBe("/b");
  });
});
