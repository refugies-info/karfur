import { Platform } from "react-native";

/**
 * Padding to reserve below a bottom bar, above the system navigation bar
 * (Android) or the home indicator (iOS).
 *
 * On Android the whole inset must be reserved: since targetSdkVersion 36
 * (Android 16) `android:enforceNavigationBarContrast` is a no-op, so the system
 * no longer draws a scrim behind the navigation bar. Anything we let bleed into
 * that strip ends up underneath the back / home / recents buttons.
 *
 * On iOS the home indicator is thinner than the inset it reports, so we keep
 * trimming 8px to avoid an unnecessarily tall bar.
 */
export const getBottomInset = (insetBottom: number): number => {
  if (insetBottom <= 0) return 0;
  if (Platform.OS === "android") return insetBottom;
  return Math.max(insetBottom - 8, 0);
};
