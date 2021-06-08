# Environments flow

We are going to work with 2 environments, staging and prod :

- staging :
  - test app
  - linked to the backend staging
  - accessible via expo Go with a link
- prod :
  - app that will be in prod
  - linked to the prod backend
  - accessible in the stores (and via internal distribution before it is on the stores)

## How to deploy to staging ?

- run : ` expo publish --release-channel staging`
- in `getEnvironnement.ts` the bdd url is defined
- env variable are in .env file (like in dev)

## How to deploy to prod ? (IN PROGRESS)

- use EAS build from expo
- secrets are stored in expo directly

## Font

We use a non open source font that must not be stored in github. As long as we deploy from local we can store the font locally.
