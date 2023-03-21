# Server documentation

This project is a Node based project, which connects to a MongoDB database.  
The source code is located at `/server`.

- [Tech stack](#tech-stack)
- [Setup](#setup)
- [Development](#development)
- [Testing](#testing)
- [Deploy](#deploy)
- [Architecture](#architecture)
- [Development Guide](#development-guide)
- [Commands reference](#reference)

## Tech stack

This project is based on [Node@16](https://nodejs.org/en/). It includes the following libraries:

- [Typescript](https://www.typescriptlang.org/)
- [Express](https://expressjs.com/)
- [Mongoose](https://mongoosejs.com/)
- [ESLint](https://eslint.org/)
- [Jest](https://jestjs.io/)

## Setup

### Prerequisites

- [MongoDB](https://treehouse.github.io/installation-guides/mac/mongo-mac.html) 5.0
- [Node](https://nodejs.org/en/download/) ^16.0.0
- [npm](https://nodejs.org/en/download/package-manager/)

Please note that you need mongo, the server and the client to run concurrently in different terminal session, in order to let them communicate.

### Install repository

1. Clone the repository locally

```bash
> git clone https://github.com/refugies-info/karfur.git
```

2. Install the dependencies

```bash
> npm install
```

3. Copy the `/example-env-file.env` to `.env` and replace `demo` with the right values.
4. In `server/src/config` create a config.js with:

```bash
module.exports = {
  "secret" : "XXX"
}
```

Ask to an administrator for the right secret.

This file MUST NOT be commited on github, it should be in gitignore.

### Setup your test database

1. Install MongoDB@5 locally. Follow the [official documentation](https://www.mongodb.com/docs/manual/installation/).
2. Download a back up of prod db in AtlasDb (you will get a lot of .wt files), put it in karfur folder and name it `db-backup`.
3. In your terminal run

```bash
> mongod --port 27017 --dbpath db-backup --noauth --bind_ip 127.0.0.1
```

There may be an error of port already in use. In that case stop mongod and rerun this command.

Check it is ok:

- run `mongo` in your terminal
- run `show dbs` --> you should have a db **heroku_wbj38s57**

4. For RGPD purpose we are going to remove emails, phones and pictures of users:

```bash
# connect to mongo database
> mongo heroku_wbj38s57
# remove user personal informations
> db.users.updateMany({},{$set:{email:"dev@refugies.info", phone: "", picture: ""}})
```

## Development

Make sure you have a mongodb instance launched.

```bash
> mongod --port 27017 --dbpath db-backup --noauth --bind_ip 127.0.0.1
```

Open a new terminal tab and launch the server:

```bash
> cd karfur/server                # go into app's directory
> npm install -g nodemon ts-node  # install globally some dependencies
> nodemon                         # serve at localhost:8000
```

### Admin account creation

- create an account on the website
- run (replace XXX by your pseudo)

```bash
> mongo heroku_wbj38s57
> db.users.updateOne({"username":"XXX"},{$addToSet:{roles:ObjectId("5ce57c969aadae8734c7aee9")}},{upsert:false})
```

- disconnect from website and reconnect, you need to add an email and phone number for 2 factor authent for admin
- after entering the code received by sms, click on the picture top right and then click on Administration. If you have access it is ok !

## Configuration

### Minimal mobile application version

The minimal version of the application must be configured in the build pipeline of the server. You must specify the version under the YYYY.MM.V format (Y: year; M: month; V: version in month).

If a user access to the API with a older version, a page tells him to upgrade to a newer version.

You can use this fonctionnality in case of breaking changes in API.

## Testing

To launch the tests, run:

```bash
> npm run test
```

It will execute:

- **unit tests**. Made with Jest, to test functions
- **linter**. With ESLint, it analyzes the Javascript code the find potential problems
- **types**. With Typescript, it checks the code syntax

Each time you write a feature, you must include some tests.

## Deploy

We use 2 environments:

- staging: https://staging.refugies.info
- prod: https://refugies.info

To deploy on **staging**, merge the branch `dev` to `staging-backend`.

To deploy on **production**, merge the branch `staging-backend` to `master-backend`.

To learn more about the git flow, read the [Git Flow documentation](../README.md#git-flow).

## Architecture

Learn more about the [architecture of the project here](architecture.md).

## Development Guide

Follow the [technical standards](general.md) to keep the codebase clean.

## Reference

```bash
# to launch server (without live reload)
> npm start

# to transpile ts code
> npm run tsc

# - starts the unit test runner
> npm run test

# launch unit tests
> npm run test:unit

# launch linter tests
> npm run test:lint

# launch test types
> npm run test:types
```
