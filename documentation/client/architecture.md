# General Architecture

[`assets`](#assets)
[`components`](#components)
[`containers`](#containers)
[`data`](#data)
[`hooks`](#hooks)
[`lib`](#lib)
[`locales`](#locales)
[`pages`](#pages)
[`scss`](#scss)
[`services`](#services)
[`types`](#types)

# assets

Contains the assets of the projects. In order to have a light bundle, put the assets on GCP bucket like explained in assets storage doc in private repo.

# components

## Responsibility

TO DO

## Collaborators

TO DO

## Checks

TO DO

# containers

## Responsibility

TO DO

## Collaborators

TO DO

## Checks

TO DO

# data

## Responsibility

pieces of data needed in components or pages

## Checks

- ✅ Fully typed

# hooks

## Responsibility

custom hooks used across the components and pages

## Checks

- ✅ Fully typed

# lib

## Responsibility

A lib is a singleton with the intelligence to do non business related stuff. It is reusable.

## Collaborators

TO DO

## Checks

- ✅ Fully tested


# locales

Contains :

- for the 6 langages the commong.json files (translation of interface words)
- the folder **interfaceTranslation** with scripts to convert json to csv and vice versa for experts translation (see [doc](../../client/src/locales/interfaceTranslation/README.md))

# pages

## Responsibility

Contains all the pages of the app. Each file is automatically used as a page by NextJS.

## Checks

TO DO

# scss

## Responsibility

Contains all the global CSS files. For more informations, read the [styling guide](./styling.md).

## Checks

- ✅ Fully tested

# services

## Responsibility

contains redux store

## Checks

- ✅ Fully tested

# types

Contains :

- types declaration of packages not available on definitely-typed.
- types declaration of elements used many times (in interface.d.ts)
