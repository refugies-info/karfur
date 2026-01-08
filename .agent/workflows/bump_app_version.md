---
description: Update the mobile app version in all required files
---

1. Detect the current version in `apps/mobile/app.config.js` (look for `const APP_VERSION = "..."`).
2. Ask the user for the new version number.
3. Update `APP_VERSION` in `apps/mobile/app.config.js`.
4. Update `version` in `apps/mobile/package.json` if it's not `0.0.0` (or update it to match if the user prefers).
5. Search for other occurrences of the old version in `apps/mobile` (excluding `node_modules`, `build`, `Pods`) and update them. This often includes:
   - `apps/mobile/android/app/build.gradle` (`versionName`)
   - `apps/mobile/ios/Rfugisinfo/Info.plist` (`CFBundleShortVersionString`)
6. Verify the changes using `grep`.
7. Commit the changes with a descriptive message: `chore(mobile): bump app version to X.X.X`.

Note: EAS is configured to auto-increment native build numbers (`versionCode` and `buildNumber`) on the server. If local manual updates are needed, reminders should be given.
