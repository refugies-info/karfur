# API Types documentation

This project contains all the types shared between the frontend and the backend.
The source code is located at `/api-types`.

## Architecture

1. The types returned by the API are splitted in modules. Each file in `/modules` contains all the requests and responses types of the associated controller.
2. The types used by many modules can be found in the `/generics.ts` file.
3. The `/index.ts` file is the entry point and exports all the types.

## Publish

When you edit the types, you need to publish a new version of the package before deploying:

1. In `/api-types/package.json`, change the version number: `"version": "1.0.XX"`
2. Run `yarn publish`. It is supposed to automatically build the typescript files and push the new version on npm.
3. Update the version in `/apps/server/package.json` or `/apps/client/package.json` to reflect the new version number you just set: `"@refugies-info/api-types": "^1.0.XX"`

You can now push your changes on staging.
