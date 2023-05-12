# Documentation

This repository contains 3 projects. Here are the associated documentations:

## [Server](server/)

Located in `/server`  
Backend app built with Node

## [Client](client/)

Located in `/client`  
Frontend app built with NextJS

## [API Types](apy-types/)

Located in `/api-types`  
Typescript types shared between front, back and app

## Technical standards

Both of these projects should follow these standards:

- Features should be in **camelcase**.
- Only use **named exports**
- All text should be in **english** (features, comments, commit messages and github discussions).
- For typing, we use **typescript** on client and server.

### Git flow

We use 3 branches which triggers the deployment automatically:

- `dev` for development
- `staging-frontend` and `staging-backend` for staging
- `master-frontend` and `master-backend` for production

For all the new features, you must follow this process:

- create a `feature` branch with your changes
- open a pull request to `dev`. Add the `bug` or `enhancement` tag.
- once it's merged, open a pull request to `staging-\[frontend|backend\]` to test the feature.  
  Name it `[STG-FRONT|BACK]` and add the `release` tag.  
  You can also use the command `npm run pr:stg` from the right folder to create it automatically (needs `gh` installed locally)
- once it's validated, open a pull request to `master-\[frontend|backend\]` to deploy the feature.  
  Name it `[PROD-FRONT|BACK]` and add the `release` tag.  
  You can also use the command `npm run pr:prod` from the right folder to create it automatically (needs `gh` installed locally)

_Note: before opening a pull request, make sure to run the tests in client and server folders: `npm run test`_

### Document code

- create single responsibility functions with transparent names
- in complex parts, add comments in english

### Logs

Use :

- `logger.info("[functionName]", {data})`
- `logger.warn("[functionName]", {data})`
- `logger.error("[functionName]", {error : error.message})`
