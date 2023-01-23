# Install

## Requirements

- node version 12+
- package manager: yarn

## Installation

- create `.env` file
- add private keys
- run `yarn` to install dependencies
- run `yarn start`

# Environments

We are going to work with 2 environments, `staging` and `production`:

- `staging`:

  - test app
  - linked to the staging backend (for user tests purposes)
  - accessible via a development build (see https://docs.expo.dev/development/create-development-builds/) and internal stores (TestFlight + Play internal testing)

- `production`:
  - app used by real users
  - linked to the prod backend
  - accessible in the stores

## Variables

The environment variables are defined at 2 different places:

- For **development** and **staging**, in `.env` file.
  If you change a variable here, rebuild the project after emptying the cache (`npx expo run:[ios/android]`)
- For **production**:
  - in `src/libs/getEnvironment.ts` for non-sensitive variables.  
    We need a unique place to define these variables so they are accessible after a build (`eas build --platform all`) and a publication (`expo submit`).  
    See [expo documentation](https://docs.expo.dev/build-reference/variables/#can-i-share-environment-variables-defined-in).
  - in Expo.dev (https://expo.dev/accounts/refugies-info/projects/refugies-info-app/secrets) for sensitive variables (API keys, secrets ...)

# Workflow

1. Develop all the features on a specific branch.
2. Update tests or create new one. See section [Tests](#tests)
3. When done, merge your changes to `dev` branch. A Github Action will automatically publish the new app on `staging` environment for tests. If you want to deploy it manually, see [how to deploy on staging](#staging)
4. When the features are validated, merge your changes to `main` branch.  
   Don't forget to increment the version number. See the [Version numbers](#version-numbers) section.
5. [Deploy on production](#production). For this, you have 2 options:
   - For bug fixes or minor updates, [publish](#publish-changes) changes to update apps automatically.  
     On _iOS_, the update is downloaded before the app is launched.  
     On _Android_, it's downloaded in the background and installed the second time the app is opened.
   - For config changes or major updates (ie. change to native code), create a [build](#build-app) and submit on the stores.

# Deploy

We use and adapt this workflow : https://docs.expo.dev/eas-update/deployment-patterns/#persistent-staging-flow

The main difference : we use `dev` branch as `staging`.

## Staging

Deploy on staging to test features via development build or store internal deployment (TestFlight and Android Play Store interne test).

> Note: prefer use store internal deployment for non-technical users

If there is **no** native code modified

```
$ eas update --auto
```

This command is run by Github CI on each push on dev.

If there is native code modified

```
$ eas build --profile development --platform [platform]
```

It is also possible to build the app to test it on real devices (or on a simulator for iOS). For this, use the `preview` channel of eas.

```
$ eas build -p [platform] --profile preview
```

And then, you need to deploy the build on the store and create an internal release :

```
$ eas submit [...]
```

## Production

### Publish changes

It is possible to publish an update which will be automatically downloaded when the app is launched.

```
$ eas update --auto
```

> This command run on each merge to `main` branch. (see .github/workflows/update_main.yml)

Don't forget to increment the **displayed version number**. See the [Version numbers](#version-numbers) section.

### Build app

1. Increment the **build number**. See the [Version numbers](#version-numbers) section.

2. Start a build which will be executed on expo servers. You can follow the process [here](https://expo.dev/accounts/refugies-info/projects/refugies-info-app/builds)

```
$ eas build --platform all
```

3. Submit the app on the Play Store

```
$ eas submit -p android
```

4. Submit the app on the App Store

```
$ eas submit -p ios
```

Note: On iOS, you need to fill a declaration before sending for validation. Choose **Yes** for the first question, and **No** for the following ones.

Notes:

- updates takes usually 2-3 days to be validated by the stores

### Version numbers

Multiple version numbers need to be incremented at each release, for different purposes:

- **displayed version number**: displayed in the application to facilitate communication related to bugs,
- **build number**: used by the stores to identify the versions of your app.

**Displayed version number**

When to increment: each time you **publish** a new version in production. See [Publish changes](#publish-changes) section.

Where: in `app.config.js`, increment the `extra.displayVersionNumber` property.

How: it should follow this convention: `[year]-[month]-[incrementalId]`

**Build Number**

When to increment: each time you **build** a new version to submit to stores. See [Build app](#build-app) section.

Where: in `app.config.js`, increment the keys `version`, `ios.buildNumber` and `android.versionCode`

How:

- `version` and `ios.buildNumber` should follow the convention `[major]-[minor]-[incrementalId]`.
- `android.versionCode` is just an incremental id.

# Development

## Font

We use a non open source font. The repo is private so that we can commit the font in the repo.

## Translation

To translate the app, use the scripts in `src/translations`.

For iOS, you must translate system strings, for example for authorizations.
You can find more informations in the [Expo documentation](https://docs.expo.dev/distribution/app-stores/?redirected#localizing-your-ios-app).

The `app.config.js` is configured to look for these strings in the regular translation files, in `src/translations/[ln].json`.
Just define the translations in these files, and use the same keys than the one you would have defined in `app.config.js`.

## Tests

To test the application, we compare snapshots of the app between the previous and the current version.

```
> yarn test             # start to compare snapshots
> yarn test:unit -u     # update snapshots to keep the current one as a reference.
```

## Theme

The file `theme/index.ts` contains all the variables needed to design the app:

- `colors`
- `fonts` sizes and families
- `shadows`: very useful to replicate shadows on android and ios
- `margin` and `radius` units

## Redux store

The store (in `services/redux`) contains the following modules:

- `Contents`: content organized by language
- `ContentsGroupedByNeeds`: contents grouped by needs. Easier to show up on NeedsScreen
- `Languages`: all available languages
- `LoadingStatus`: loading status of various kind of content
- `Needs`: all needs
- `SelectedContent`: content currently displayed in the content page
- `User`: all settings related to the current user
- `Voiceover`: all the commands related to the voiceover feature

## Navigation

The app has the following navigation structure:

- if user has not seen the onboarding
  - OnboardingStack
    - LanguageChoiceScreen
    - OnboardingStartScreen
    - OnboardingStepsScreen
    - FilterCityScreen
    - FilterAgeScreen
    - FilterFrenchLevelScreen
    - FinishOnboardingScreen
- else
  - BottomTabStack
    - ExplorerStack
      - ExplorerScreen
      - ContentScreen
      - ContentsScreen
      - NeedsScreen
      - NearMeCardScreen
    - FavorisStack
      - FavorisScreen
    - SearchStack
      - SearchScreen
      - SearchResultsScreen
    - ProfileStack
      - ProfilScreen
      - LangueProfilScreen
      - AgeProfilScreen
      - CityProfilScreen
      - FrenchLevelProfilScreen
      - PrivacyPolicyScreen
      - LegalNoticeScreen
      - AboutScreen
      - AccessibilityScreen
