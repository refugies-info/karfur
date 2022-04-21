# Development Guide

- [Redux usage](#redux-usage)
- [Write components](#write-small-and-reusable-components)
- [Typing](#typing)
- [Testing](#testing)
- [Routing](#routing)
- [Assets](#assets)
- [Styling](#styling)
- [Logging](#logging)

## Redux usage

1. Put all API calls in sagas and store infos in redux store
2. Use selector hooks to access redux store

## Write small and reusable components

Separate components in multiple small reusable components to increase modularity and separate logic in different functions.

To know more about how to write a component, please read [component architecture guide](./component-architecture.md).

## Typing

Every new client file should be **fully typed**. If possible, type existing files.

## Testing

Every file should be **fully tested**.

See SubComponents.test.tsx for examples of snapshot tests.

## Routing

The routing has a specific behavior in RI, because the app host the website and the backoffice. 
To learn more, please the the [routing guide](./routing.md).

## Assets

In order to have a light bundle, put the assets on GCP bucket like explained in assets storage doc in private repo.

## Styling

The project uses mainly scss modules for design. To know more, read the [styling guide](./styling.md).

## Logging

- see [global standards](../general.md)
- Do not put logs in render
