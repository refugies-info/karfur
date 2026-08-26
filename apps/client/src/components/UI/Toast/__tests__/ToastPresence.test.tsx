import { ToastProvider } from "@radix-ui/react-toast";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import Toast from "../Toast";
import { ToastPresenceProvider, ToastViewportWhenNeeded } from "../ToastPresence";

/**
 * Le harnais global (`jest/lib/wrapWithProvidersAndRender`) monte son propre
 * `ToastViewport` sans le contexte de présence : il n'exerce jamais cette
 * logique. Ces tests montent donc le vrai `ToastPresence`.
 */

const zoneDeNotifications = () =>
  document.querySelector('[role="region"][aria-label^="Notifications"]');

const attendre = (ms: number) =>
  act(async () => {
    await new Promise((resolve) => setTimeout(resolve, ms));
  });

const Harnais = ({ ouvertAuDepart }: { ouvertAuDepart: boolean }) => {
  const [open, setOpen] = useState(ouvertAuDepart);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Envoyer le lien
      </button>
      <ToastProvider swipeDirection="down">
        <ToastPresenceProvider>
          <Toast open={open} closeCallback={() => setOpen(false)}>
            SMS envoyé !
          </Toast>
          <ToastViewportWhenNeeded />
        </ToastPresenceProvider>
      </ToastProvider>
    </>
  );
};

describe("ToastViewportWhenNeeded", () => {
  it("ne monte pas la zone de notifications au repos", () => {
    render(<Harnais ouvertAuDepart={false} />);
    expect(zoneDeNotifications()).toBeNull();
  });

  it("monte la zone pendant l'affichage d'un toast", async () => {
    render(<Harnais ouvertAuDepart={false} />);
    fireEvent.click(screen.getByRole("button", { name: "Envoyer le lien" }));
    await attendre(0);

    expect(zoneDeNotifications()).not.toBeNull();
    // getByText lève si le toast n'est pas rendu dans le portail du viewport.
    expect(screen.getByText("SMS envoyé !")).toBeTruthy();
  });

  it("laisse l'animation de sortie se dérouler avant de démonter la zone", async () => {
    render(<Harnais ouvertAuDepart={true} />);
    await attendre(0);
    expect(zoneDeNotifications()).not.toBeNull();

    // Fermeture programmée, sans que le focus soit entré dans le toast.
    fireEvent.click(screen.getByRole("button", { name: "Close" }));

    await attendre(100);
    expect(zoneDeNotifications()).not.toBeNull(); // S1 : encore là à t+100

    await attendre(350);
    expect(zoneDeNotifications()).toBeNull(); // puis démontée
  });

  it("ne laisse pas tomber le focus sur body à la fermeture au clavier", async () => {
    render(<Harnais ouvertAuDepart={true} />);
    await attendre(0);

    const fermer = screen.getByRole("button", { name: "Close" });
    fermer.focus();
    expect(document.activeElement).toBe(fermer);

    fireEvent.click(fermer);
    await attendre(450);

    // S2 : Radix repose le focus sur le viewport, on ne démonte pas sous ses pieds.
    expect(document.activeElement).not.toBe(document.body);
    expect(zoneDeNotifications()).not.toBeNull();
  });
});
