# Controllers

## Write a controller

A controller uses TSOA to associate a route to a workflow. Here is a simple controller:

```javascript
@Route("dispositifs") // sets the prefix of all the following routes
export class DispositifController extends Controller {

  @Get("/") // route to catch. Prefer kebab-case here
  public async get(): ResponseWithData<GetDispositifsResponse[]> { // methods which returns the data. Must be typed
    return getDispositifs() // workflow which returns data
      .then(dispositifs => ({ // must now return a Response, when no data, or ResponseWithData type
          text:"success",
          data: dispositifs
        })
      );
  }
}
```

## Security

The `@Security` annotation restricts a route to a type of user. The logic for this authentication is written in `src/authentication.ts`. It accepts the following parameters:

- `fromSite`: should be called from website
- `fromPostman`: should be called from Postman
- `fromCron`: should be called from a cron
- `jwt`: should have a JWT token

We can also use a **role** restricted annotation. When no role is defined, a logged in user is accepted. Else:

- `optional`: accepts a logged in user or no user
- `admin`: accepts only an admin
- `expert`: accepts only an expert

You can write the security annotations in different ways:

```javascript
// must be from site
@Security("fromSite")

// combine security. Must be from site and logged in
@Security({
  jwt: [],
  fromSite: [],
})

// add a role. Must be from site and admin
@Security({
  jwt: ["admin"],
  fromSite: [],
})
```

Warning: if you need to combine multiple annotations, `jwt` must be **before** `fromSite` (like in the previous example) so the request object is populated with the user data.

## Annotations

Here are some annotations you can use in methods to get data from the request:

- `@Query`: specific query parameter of the request
- `@Queries`: all query parameters of the request
- `@Request`: request object. Useful to get the user object, populated by the authentication middleware
- `@Body`: content of the request
- `@Path`: if a part of the path is dynamic, you can get it here
- `@Header`: specific header of the request
