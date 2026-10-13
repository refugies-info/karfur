import AsyncStorage from "@react-native-async-storage/async-storage";
import { fireEvent, waitFor } from "@testing-library/react-native";
import { NOTIFICATIONS_MODAL_SEEN_KEY } from "~/components/Notifications/NotificationsModal/useNotificationsModal";
import { wrapWithProvidersAndRender } from "../../../jest/wrapWithProvidersAndRender";
import { ActivateNotificationsScreen } from "../ActivateNotificationsScreen";

jest.mock("lottie-react-native", () => "LottieView");
jest.mock("../../../hooks/useTranslationWithRTL", () => ({
  useTranslationWithRTL: jest.fn().mockReturnValue({ isRTL: false, t: (key: string) => key }),
}));

describe("ActivateNotificationsScreen", () => {
  beforeEach(() => AsyncStorage.clear());

  it("remembers the answer so the explorer modal doesn't ask again", async () => {
    const navigate = jest.fn();
    const component = wrapWithProvidersAndRender({
      Component: ActivateNotificationsScreen,
      compProps: { navigation: { navigate } },
    });

    fireEvent.press(component.getByText("notifications.notNow"));

    await waitFor(() => expect(navigate).toHaveBeenCalledWith("FinishOnboarding"));
    expect(await AsyncStorage.getItem(NOTIFICATIONS_MODAL_SEEN_KEY)).toBe("true");
  });
});
