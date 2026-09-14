import "@testing-library/jest-dom";
import { setLink } from "@codegouvfr/react-dsfr/link";
import { render, screen } from "@testing-library/react";
import Link from "next/link";
// The jsdom test environment resolves "react-dom/server" to the browser build, which needs
// MessageChannel: the node build is the one Next uses on the server anyway.
import { renderToString } from "react-dom/server.node";
import { SectionImpact } from "../SectionImpact";

// Same registration as `_app.tsx`: DSFR cards render their link with next/link.
setLink({ Link });

const bookletPath = "/Livret-Impact-Refugies.infos-2024.pdf";

describe("SectionImpact", () => {
  it("links the impact booklet to the PDF on the server render", () => {
    // Server markup: the href must not depend on `window`, which does not exist there.
    const html = renderToString(<SectionImpact />);

    expect(html).toContain(`href="${bookletPath}"`);
    expect(html).not.toContain('href="#"');
  });

  it("exposes the booklet card without a stray aria-label and with the image alternative", () => {
    render(<SectionImpact />);

    const link = screen.getByRole("link", { name: "Livret d'impact" });
    expect(link).toHaveAttribute("href", bookletPath);
    expect(link.closest(".fr-card")).not.toHaveAttribute("aria-label");
    expect(screen.getByRole("img")).toHaveAttribute("alt", "MissionImpact.impact_booklet_alt");
  });
});
