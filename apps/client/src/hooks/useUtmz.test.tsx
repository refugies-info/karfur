import { act, render, screen } from "@testing-library/react";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server.node";
import { writeUtmzCookie } from "~/lib/utmzCookie";
import useUtmz from "./useUtmz";

const CardLink = () => {
  const { params } = useUtmz();
  return <a href={`/demarche/1?${new URLSearchParams(params)}`}>Fiche</a>;
};

const href = () => screen.getByRole("link").getAttribute("href");

const WITH_UTM = "/demarche/1?utm_source=newsletter&utm_campaign=cir&utm_medium=email";
const writeCampaign = () =>
  writeUtmzCookie(
    "utm_source=newsletter&utm_medium=email&utm_campaign=cir",
    new Date(Date.now() + 60_000),
  );

describe("useUtmz", () => {
  afterEach(() => {
    document.cookie = "__utmz=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  });

  it("returns no param without a campaign cookie", () => {
    render(<CardLink />);

    expect(href()).toBe("/demarche/1?");
  });

  it("updates a link already displayed when the cookie is written", () => {
    render(<CardLink />);

    act(writeCampaign);

    expect(href()).toBe(WITH_UTM);
  });

  it("updates a link rendered by the server once the page is hydrated", async () => {
    const container = document.createElement("div");
    container.innerHTML = renderToString(<CardLink />);
    document.body.appendChild(container);
    writeCampaign();
    expect(href()).toBe("/demarche/1?");

    const root = await act(async () => hydrateRoot(container, <CardLink />));

    expect(href()).toBe(WITH_UTM);
    act(() => root.unmount());
    container.remove();
  });
});
