# API Types documentation

This project contains all the types shared between the frontend and the backend.
The source code is located at `/api-types`.

## Architecture

1. The types returned by the API are splitted in modules. Each file in `/modules` contains all the requests and responses types of the associated controller.
2. The types used by many modules can be found in the `/generics.ts` file.
3. The `/index.ts` file is the entry point and exports all the types.
