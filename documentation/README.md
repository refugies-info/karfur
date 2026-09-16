# Documentation

This repository contains 3 projects. Here are the associated documentations:

## [Server](server/)

Located in `/apps/server`
Backend app built with Node

## [Client](client/)

Located in `/apps/client`
Frontend app built with NextJS

## [API Types](api-types/)

Located in `/api-types`
Typescript types shared between front, back and app

## Technical standards

Both of these projects should follow these standards:

- Features should be in **camelcase**.
- Only use **named exports**
- All text should be in **english** (features, comments, commit messages and github discussions).
- For typing, we use **typescript** on client and server.
- Naming: **camelCase** for variables and functions, **PascalCase** for classes and React components. Prefer a descriptive name that is a bit longer over a short, cryptic one.
- Refactor when you can, to reuse existing functions instead of copy-pasting, and to keep the codebase light.
- No hardcoded user-facing text: always go through the i18n system (see the [i18n guide](client/i18n.md)) — add the translation key and regenerate/export the translation files instead of writing raw strings in JSX.

### Workflow

We use 3 git branches which triggers the deployment automatically:

- `dev` for development
- `staging-frontend` and `staging-backend` for staging
- `master-frontend` and `master-backend` for production

You can follow the build status on GCP: https://console.cloud.google.com/home/dashboard?project=refugies-info

For all the new features, you must follow this process:

- create a `feature` branch with your changes
- open a pull request to `dev`. Add the `bug` or `enhancement` tag. Add the ticket link to the PR, and the PR link in the ticket.
- once it's merged, open a pull request to `staging-\[frontend|backend\]` to test the feature.
  Name it `[STG-FRONT|BACK]` and add the `release` tag.
  You can also use the command `pnpm pr:stg` from the right folder to create it automatically (needs `gh` installed locally)
- once it's validated, open a pull request to `master-\[frontend|backend\]` to deploy the feature.
  Name it `[PROD-FRONT|BACK]` and add the `release` tag.
  You can also use the command `pnpm pr:prod` from the right folder to create it automatically (needs `gh` installed locally)

_Note: before opening a pull request, make sure to run the tests in client and server folders: `npm run test`_

### Document code

- create single responsibility functions with transparent names
- prefer clear, self-explanatory code over comments: well-written code shouldn't need comments to be understood
- when you do add a comment, write it in **concise English**, and reserve it for what the code itself can't express — an exception, a workaround, a non-obvious business rule

### Front components

- front components should stay free of business logic as much as possible: they receive what to display through props, do any purely presentational reformatting locally, but don't hold business rules
- front components should not import/fetch data directly; data must be loaded elsewhere (page, container, hook) and passed down as props

### Logs

Use :

- `logger.info("[functionName]", {data})`
- `logger.warn("[functionName]", {data})`
- `logger.error("[functionName]", {error : error.message})`
