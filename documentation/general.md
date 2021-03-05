# Technical standards

## Global

- Features should be in **camelcase**.
- Only use **named exports**
- All text should be in **english** (features, comments, commit messages and github discussions).
- For typing, we use **typescript** on client and server.

## Git flow

We use 3 branches :

- dev for development
- staging-frontend and staging-backend for staging
- master-frontend and master-backend for production

All commits in staging's and master's branches should be in dev.

Before opening a pull request, please run in client and server folders : `npm run test`

## How to document code ?

- create single responsibility functions with transparent names
- in complex parts, add comments in english

## Logs

Use :

- `logger.info([functionName], {data})`
- `logger.warn([functionName], {data})`
- `logger.error([functionName], {error : error.message})`
