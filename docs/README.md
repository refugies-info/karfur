# Install

## Requirements

- node version 12
- package manager: yarn

## Installation

- create `.env` file
- add private keys
- run `yarn`
- run `yarn start`

# Environments

We are going to work with 2 environments, `staging` and `prod`:

- `staging`:
  - test app
  - linked to the prod backend (for user tests purposes)
  - accessible via Expo Go with a link

- `prod`:
  - app used by real users
  - linked to the prod backend
  - accessible in the stores (and via internal distribution before it is on the stores)

# Deploy
## Staging

Notes:
- The API url is defined in `getEnvironnement.ts`
- Environment variables are in `.env` file (like in dev)

```
$ expo publish --release-channel staging
```

## Production

Notes:
- secrets are stored in expo directly

1. Increment `version` number in `app.config.js`

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

## Font

We use a non open source font. The repo is private so that we can commit the font in the repo.
