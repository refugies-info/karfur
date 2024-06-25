# Client documentation

This project is a React based project, which uses the NextJS framework.
The source code is located at `/client`.

- [Client documentation](#client-documentation)
  - [Tech stack](#tech-stack)
  - [Setup](#setup)
  - [Development](#development)
  - [Testing](#testing)
  - [Deploy](#deploy)
  - [Architecture](#architecture)
  - [Development Guide](#development-guide)
  - [Reference](#reference)

## Tech stack

This project is based on [React](https://reactjs.org/), and uses the [NextJS framework](https://nextjs.org/).
It includes the following libraries:

- [Typescript](https://www.typescriptlang.org/)
- [Redux](https://redux.js.org/)
- [Axios](https://github.com/axios/axios)
- [Bootstrap@4](https://getbootstrap.com/docs/4.0/getting-started/introduction/)
- [ESLint](https://eslint.org/)
- [Jest](https://jestjs.io/)

## Setup

_It is recommended to [setup the server](../server/) first as you will need it to build or run the client._

1. Clone the repository locally
2. Install the dependencies

```bash
> yarn install --frozen-lockfile
```

3. Copy the `/example-env-file.env` to `.env.local` and replace `demo` with the right values.

## Development

_Before starting or building the app, make sure your server is running._

To start the development server, run:

```bash
> yarn dev
```

Your app is now accessible at http://localhost:3000/ .

If you want to test it like in production, build the app first and start the Next server:

```bash
> yarn build   # build a production ready app
> yarn start   # start the app with the previously created build
```

Your app is now accessible at http://localhost:3000/ .

NB: `reactStrictMode` is enabled by default in `next.config.js`. This helps to prevent some common bugs, but it makes all the components render twice.

## Testing

To launch the tests, run:

```bash
> yarn test
```

It will execute:

- **unit tests**. Made with Jest, to test components and functions
- **linter**. With ESLint, it analyzes the Javascript code the find potential problems
- **types**. With Typescript, it checks the code syntax

Each time you write a feature, you must include some tests.

## Deploy

We use 2 environments:

- staging: https://staging.refugies.info
- prod: https://refugies.info

To deploy on **staging**, merge the branch `dev` to `staging-frontend`.

To deploy on **production**, merge the branch `staging-frontend` to `master-frontend`.

To learn more about the git flow, read the [Git Flow documentation](../README.md#git-flow).

## Architecture

Learn more about the [architecture of the project here](architecture.md).

## Development Guide

Follow the [technical standards](general.md) to keep the codebase clean.

Here are some more specific guides:

- [component architecture](component-architecture.md)
- [routing](routing.md)
- [styling](styling.md)

## Reference

```bash
# start the dev server with hot reloading enabled
> yarn dev

# build the app for production with minification
> yarn build

# start the previously built app
> yarn start

# launch all the tests
> yarn test

# launch only the unit tests. use the -- -u parameter to update snapshots
> yarn test:unit

# launch only the types tests
> yarn test:types

# launch only the lint tests
> yarn test:lint

# generates test coverage report (jest) (pending bug fix)
> yarn test-with-coverage
```
