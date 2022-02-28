# Client specific standards

Project was created and uses [NextJS](https://nextjs.org/) to start and build.

## Redux usage

1. Put all API calls in sagas and store infos in redux store
2. Use selector hooks to access redux store

## Write small and reusable components

Separate components in multiple small reusable components to increase modularity and separate logic in different functions.
To know more about the architecture of a component, please read [Component Architecture](./component-architecture.md).

## Typing

> Every new client file should be **fully typed**. If possible, type existing files.

## Testing

> Every file should be **fully tested**.

See SubComponents.test.tsx for examples of snapshot tests.

## How to add assets?

In order to have a light bundle, put the assets on GCP bucket like explained in assets storage doc in private repo.

## How to add logs?

- see [global standards](../general.md)
- Do not put logs in render

## Styling

The project uses mainly scss modules for design. To know more, read the [styling guide](./styling.md).
