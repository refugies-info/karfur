# Target organization of fontend :

# types

Contains :

- types declaration of packages not available on definitely-typed.
- types declaration of elements used many times (in interface.d.ts)

# locales

Contains :

- for the 6 langages the translation.json files (translation of interface words)
- the folder **interfaceTranslation** with scripts to convert json to csv and vice versa for experts translation (see [doc](../../client/src/locales/interfaceTranslation/README.md))

# assets

Contains the assets of the projects. In order to have a light bundle, put the assets on GCP bucket like explained in assets storage doc in private repo.

# components

## Responsibility

> TO DO

## Collaborators

TO DO

## Checks

TO DO

# containers

## Responsibility

> TO DO

## Collaborators

TO DO

## Checks

TO DO

# lib

## Responsibility

> A lib is a singleton with the intelligence to do non business related stuff. It is reusable.

## Collaborators

TO DO

## Checks

- ✅ Fully tested

# services

## Responsibility

> containes redux store

## Checks

- ✅ Fully tested
