import { ToastProvider } from "@radix-ui/react-toast";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import Toast from "../Toast";
import { ToastPresenceProvider, ToastViewportWhenNeeded } from "../ToastPresence";

/**
 * The global harness (`jest/lib/wrapWithProvidersAndRender`) mounts its own `ToastViewport` without
 * the presence context, so it never exercises this logic. These tests mount the real one.
 */

const notificationRegion = () =>
  document.querySelector('[role="region"][aria-label^="Notifications"]');

const advanceTime = (ms: number) =>
  act(async () => {
    await new Promise((resolve) => setTimeout(resolve, ms));
  });

const Harness = ({ openAtStart }: { openAtStart: boolean }) => {
  const [open, setOpen] = useState(openAtStart);
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
  it("should not mount the notification region at rest", () => {
    render(<Harness openAtStart={false} />);
    expect(notificationRegion()).toBeNull();
  });

  it("should mount the region while a toast is shown", async () => {
    render(<Harness openAtStart={false} />);
    fireEvent.click(screen.getByRole("button", { name: "Envoyer le lien" }));
    await advanceTime(0);

    expect(notificationRegion()).not.toBeNull();
    // getByText throws if the toast is not rendered inside the viewport portal.
    expect(screen.getByText("SMS envoyé !")).toBeTruthy();
  });

  it("should let the exit animation run before unmounting the region", async () => {
    render(<Harness openAtStart={true} />);
    await advanceTime(0);
    expect(notificationRegion()).not.toBeNull();

    // Programmatic close, with focus never having entered the toast.
    fireEvent.click(screen.getByRole("button", { name: "Close" }));

    await advanceTime(100);
    expect(notificationRegion()).not.toBeNull(); // S1: still there at t+100

    await advanceTime(350);
    expect(notificationRegion()).toBeNull(); // then unmounted
  });

  it("should not drop focus on body when closing with the keyboard", async () => {
    render(<Harness openAtStart={true} />);
    await advanceTime(0);

    const closeButton = screen.getByRole("button", { name: "Close" });
    closeButton.focus();
    expect(document.activeElement).toBe(closeButton);

    fireEvent.click(closeButton);
    await advanceTime(450);

    // S2: Radix puts focus back on the viewport, we do not unmount under its feet.
    expect(document.activeElement).not.toBe(document.body);
    expect(notificationRegion()).not.toBeNull();
  });
});
