---
description: Update the mobile app version in all required files
---

1. Detect the current version in `apps/mobile/app.config.js` (look for `const APP_VERSION = "..."`).
2. If an argument (patch, minor, major) was provided with the command:
   - Calculate the new version based on the increment type:
     - `patch`: increment the last digit (e.g., 2.2.0 -> 2.2.1)
     - `minor`: increment the middle digit, reset last to 0 (e.g., 2.2.0 -> 2.3.0)
     - `major`: increment the first digit, reset others to 0 (e.g., 2.2.0 -> 3.0.0)
3. If no argument was provided, or if the argument is not one of the above, ask the user to specify one (patch, minor, major) or provide a specific version number.
4. Update `APP_VERSION` in `apps/mobile/app.config.js`.
5. Update `version` in `apps/mobile/package.json` if it's not `0.0.0`.
6. Search for other occurrences of the old version in `apps/mobile` (excluding `node_modules`, `build`, `Pods`) and update them. This often includes:
   - `apps/mobile/android/app/build.gradle` (`versionName`)
   - `apps/mobile/ios/Rfugisinfo/Info.plist` (`CFBundleShortVersionString`)
7. Verify the changes using `grep`.
8. Commit the changes with a descriptive message: `chore(mobile): bump app version to X.X.X`.

Note: EAS is configured to auto-increment native build numbers (`versionCode` and `buildNumber`) on the server. If local manual updates are needed, reminders should be given.
