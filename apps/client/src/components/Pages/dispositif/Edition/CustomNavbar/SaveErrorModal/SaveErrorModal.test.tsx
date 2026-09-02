import { screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import type { AutosaveErrorDetails } from "~/lib/autosaveError";
import { wrapWithProvidersAndRenderForTesting } from "../../../../../../../jest/lib/wrapWithProvidersAndRender";
import SaveErrorModal from "./SaveErrorModal";

jest.mock("next/router", () => require("next-router-mock"));

const details = (overrides: Partial<AutosaveErrorDetails> = {}): AutosaveErrorDetails => ({
  status: 422,
  message: "Validation Failed",
  fields: ["body.translated.content"],
  fieldDetails: [{ path: "body.translated.content", reason: "invalid object" }],
  payloadSize: null,
  reference: "ace61be184d84d21a6fa1055e1f0eb06",
  userMessage: null,
  eventId: null,
  ...overrides,
});

describe("SaveErrorModal", () => {
  it("affiche toujours la référence à donner au support", () => {
    wrapWithProvidersAndRenderForTesting({
      Component: SaveErrorModal,
      compProps: { show: true, errorDetails: details() },
    });

    expect(screen.getByText(/ace61be184d84d21a6fa1055e1f0eb06/)).toBeInTheDocument();
  });

  it("n'expose pas le jargon de l'API quand on ne sait pas l'interpréter", () => {
    wrapWithProvidersAndRenderForTesting({
      Component: SaveErrorModal,
      compProps: { show: true, errorDetails: details() },
    });

    expect(screen.queryByText(/Validation Failed/)).not.toBeInTheDocument();
    expect(screen.queryByText(/body\.translated\.content/)).not.toBeInTheDocument();
  });

  it("affiche le message compréhensible quand il y en a un", () => {
    wrapWithProvidersAndRenderForTesting({
      Component: SaveErrorModal,
      compProps: {
        show: true,
        errorDetails: details({ userMessage: "La connexion au serveur a été interrompue." }),
      },
    });

    expect(screen.getByText("La connexion au serveur a été interrompue.")).toBeInTheDocument();
  });

  it("annonce le volume envoyé et le plafond quand ils sont connus", () => {
    wrapWithProvidersAndRenderForTesting({
      Component: SaveErrorModal,
      compProps: {
        show: true,
        errorDetails: details({ payloadSize: { bytes: 1_572_864, limitBytes: 52_428_800 } }),
      },
    });

    expect(screen.getByText(/1,5 Mo/)).toBeInTheDocument();
    expect(screen.getByText(/50 Mo/)).toBeInTheDocument();
  });

  it("masque le bloc technique quand aucun détail n'est disponible", () => {
    wrapWithProvidersAndRenderForTesting({
      Component: SaveErrorModal,
      compProps: { show: true, errorDetails: null },
    });

    expect(screen.queryByText(/Informations techniques/)).not.toBeInTheDocument();
    expect(screen.getByText("Rafraîchir la page")).toBeInTheDocument();
  });
});
