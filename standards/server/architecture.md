# controllers

declare routes
import workflows

# workflows

## Responsibility

A workflow is where the logic of a route is orchestrated

## Collaborators

- Import only **modules**

## Checks

- ✅ Fully unit tested
- ✅ Throw http code for the client

# modules

## Responsibility

> A module is a business autonomous brick responsible for handling a business mission as sending mail, generating PDF or updating data.
> We want to have each module independant from other modules.

## Collaborators

- Import only **connectors**
- **Workflows** will import modules to perform business logic

## Checks

### Everywhere in module folder

- ✅ Does **not** import other **modules**
- ✅ Fully unit tested
- ✅ Throw Business intellegible error messages

### Repository

> "repositories" are interfaces used to retrieve or modify business object from database

- ✅ Import only **schema**

### Adapter

> In software engineering, the adapter pattern is a software design pattern that allows the interface of an existing class to be used as another interface

- ✅ Should never be async
- ✅ Should have exact type

### Index

> In this project, module index are location for module related business function

- ✅ Every function should be used on workflow only

TO DO

# libs

# schema

# Connector

## Responsibility

A connector is the link between the app and :

- a technical provider like Stripe, Paypal, Sendgrid
- partner provider like Otakeys, pragmatik
- the database

## Collaborators

- **Modules** are the only ones that can import connectors to contact external services.

## Checks

- ✅ No business logic
- ✅ Functions are typed
- ✅ Connector type should live only in connector folder or endPoint entry
- ✅ Fully unit tested
- ✅ Fully mocked
