import { act, renderHook } from "@testing-library/react";
import mockRouter from "next-router-mock";
import useStopAudioOnLocaleChange from "./useStopAudioOnLocaleChange";

jest.mock("next/router", () => require("next-router-mock"));
jest.mock("lib/readAudio", () => ({
  stopAudio: jest.fn(),
}));

const { stopAudio } = require("lib/readAudio");

describe("useStopAudioOnLocaleChange", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRouter.setCurrentUrl("/");
    mockRouter.locale = "fr";
  });

  it("does not stop the audio on mount", () => {
    renderHook(() => useStopAudioOnLocaleChange());

    expect(stopAudio).not.toHaveBeenCalled();
  });

  it("stops the audio when the locale changes", async () => {
    renderHook(() => useStopAudioOnLocaleChange());

    await act(async () => {
      await mockRouter.push("/", undefined, { locale: "en" });
    });

    expect(stopAudio).toHaveBeenCalledTimes(1);
  });

  it("calls the onStop callback when the locale changes", async () => {
    const onStop = jest.fn();
    renderHook(() => useStopAudioOnLocaleChange(onStop));

    await act(async () => {
      await mockRouter.push("/", undefined, { locale: "en" });
    });

    expect(onStop).toHaveBeenCalledTimes(1);
  });

  it("does not stop the audio when navigating without changing the locale", async () => {
    renderHook(() => useStopAudioOnLocaleChange());

    await act(async () => {
      await mockRouter.push("/recherche", undefined, { locale: "fr" });
    });

    expect(stopAudio).not.toHaveBeenCalled();
  });
});
