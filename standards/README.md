# Technical standards

Features should be in **camelcase**.
All text should be in **english** (features, comments, commit messages and github discussions).
For typing, we use **typescript** on client and server.

## Git flow

We use 3 branches :

- dev for development
- qa for our test environement
- master for prod

All commits in prod and qa should be in dev.

Before opening a pull request, please run in client and server folders : `npm run test:lint`, `npm run test:types`, `npm run test:unit`

## How to refactor actual code ?

### Client

1. Put all API calls in sagas and store infos in redux store
2. Separate components in multiple small reusable components to increase modularity and separate logic in different functions
3. Create XXX.container (with connnection to redux and HOC) and XXX.component files (example in QuickToolBar)
4. Type components (example in QuickToolBar)
5. Add unit tests

### Server

1. Separate logic in different single responsibility functions
2. Use async/await and try/catch syntax
3. Type files
4. Add unit tests

## How to add logs ?

### Client

- use the logger `logger.info()`, `logger.warn()`or `logger.error()`
- Put the name of the component and of the specific function in log (example : `logger.info("[Dispositif] create a new dispositif : ", {data : XXX})`)
- Do not put logs in render

### Server

- use `console.log()``
- add context to the log, function name for example

## How to document code ?

- create single responsibility functions with transparent names
- in complex parts, add comments in english

## How to write good css ?

Coming soon
