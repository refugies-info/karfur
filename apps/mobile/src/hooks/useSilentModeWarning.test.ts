import AsyncStorage from "@react-native-async-storage/async-storage";
import { act, renderHook, waitFor } from "@testing-library/react-native";
import { useIsDeviceSilent } from "./useIsDeviceSilent";
import { useSilentModeWarning } from "./useSilentModeWarning";

jest.mock("./useIsDeviceSilent");

const mockedUseIsDeviceSilent = useIsDeviceSilent as jest.MockedFunction<typeof useIsDeviceSilent>;

describe("useSilentModeWarning", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    AsyncStorage.clear();
  });

  it("does not warn when the device is not silent", async () => {
    mockedUseIsDeviceSilent.mockReturnValue(false);
    const { result } = renderHook(() => useSilentModeWarning());
    await waitFor(() => expect(AsyncStorage.getItem).toHaveBeenCalled());

    let warned: boolean | undefined;
    act(() => {
      warned = result.current.warnIfSilent();
    });

    expect(warned).toBe(false);
    expect(result.current.isVisible).toBe(false);
  });

  it("warns when the device is silent", async () => {
    mockedUseIsDeviceSilent.mockReturnValue(true);
    const { result } = renderHook(() => useSilentModeWarning());
    await waitFor(() => expect(AsyncStorage.getItem).toHaveBeenCalled());

    let warned: boolean | undefined;
    act(() => {
      warned = result.current.warnIfSilent();
    });

    expect(warned).toBe(true);
    expect(result.current.isVisible).toBe(true);
  });

  it("stays quiet once the user opted out", async () => {
    mockedUseIsDeviceSilent.mockReturnValue(true);
    await AsyncStorage.setItem("silentModeWarningDisabled", "true");
    const { result } = renderHook(() => useSilentModeWarning());
    await waitFor(() => expect(AsyncStorage.getItem).toHaveBeenCalled());

    let warned: boolean | undefined;
    act(() => {
      warned = result.current.warnIfSilent();
    });

    expect(warned).toBe(false);
  });

  it("persists the opt-out", async () => {
    mockedUseIsDeviceSilent.mockReturnValue(true);
    const { result } = renderHook(() => useSilentModeWarning());
    await waitFor(() => expect(AsyncStorage.getItem).toHaveBeenCalled());

    act(() => {
      result.current.disableForever();
    });

    expect(AsyncStorage.setItem).toHaveBeenCalledWith("silentModeWarningDisabled", "true");
    expect(result.current.isVisible).toBe(false);
  });
});
