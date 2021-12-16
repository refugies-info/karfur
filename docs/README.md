# Install

## Requirements

- node version 12
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
  - linked to the prod backend (for user tests purposes)
  - accessible via Expo Go with a link

- `production`:
  - app used by real users
  - linked to the prod backend
  - accessible in the stores (and via internal distribution)


## Variables

The environment variables are defined at 2 different places:
- For **development**, in `.env` file.  
  If you change a variable here, rebuild the project after emptying the cache (`expo r -c`)
- For **staging** and **production**:
  - in `src/libs/getEnvironment.ts` for non-sensitive variables.  
    We need a unique place to define these variables so they are accessible after a build (`eas build`) and a publication (`expo submit`).  
    See [expo documentation](https://docs.expo.dev/build-reference/variables/#can-i-share-environment-variables-defined-in).
  - in Expo Go for sensitive variables (API keys, secrets ...)


# Workflow

1. Develop all the features on a specific branch.
2. When done, merge your changes to `dev` branch.
3. Publish on `staging` for tests.
4. When validated, merge your changes to `main` branch.
5. For deployment in `production`, 2 options:
    - For bug fixes or minor updates, **publish** changes to update apps automatically.  
      On iOS, the update is downloaded before the app is launched. On Android, it's downloaded in the background and installed the second time the app is opened.
    - For config changes or major updates, create a **build** and submit on the stores.


# Deploy
## Staging

Deploy on staging to test features via Expo Go.

```
$ expo publish --release-channel staging
```

It is also possible to build the app to test it on real devices (or on a simulator for iOS). For this, use the `preview` channel of eas.

```
$ eas build -p android --profile preview
```

Then, download the bundle on Expo Go.

## Production

### Publish changes

It is possible to publish an update which will be automatically downloaded when the app is launched.

```
$ expo publish --release-channel production
```

### Build app

1. Increment `version` number in `app.config.js`: `version`, `ios.buildNumber` and `android.versionCode`.

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

## Font

We use a non open source font. The repo is private so that we can commit the font in the repo.

# Development

## Translation

To translate the app, use the scripts in `src/translations`.

For iOS, you must translate system strings, for example for authorizations.
You can find more informations in the [Expo documentation](https://docs.expo.dev/distribution/app-stores/?redirected#localizing-your-ios-app).

The `app.config.js` is configured to look for these strings in the regular translation files, in `src/translations/[ln].json`. 
Just define the translations in these files, and use the same keys than the one you would have defined in `app.config.js`.