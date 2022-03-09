# Routing

The RI app uses the **NextJS router** for all the pages which needs to be indexed by search engines. 
It uses the **react-router-dom router** for all the backend pages where indexing is not important. 

## NextJS router

The app uses the NextJS router to keep benefit of the SSR. 
All the React Components in `src/pages` will automatically be associated with a route, based on its filename. 
To learn more, please read the [NextJS documentation](https://nextjs.org/docs/basic-features/pages).

Access the NextJS router easily with the `useRouter` hook:
```tsx
import { useRouter } from 'next/router'

function ActiveLink() {
  const router = useRouter();

  const goToHome = () => {
    router.push("/index")
  };

  return (
    <button onClick={goToHome}>Homepage</button>
  );
}
```

## react-router-dom router

In `src/pages`, we can find a `backend/[...backend].tsx` file. Next will automatically catch all the routes starting by `/backend/` and load this component.

In this component, we load all the routes from `/routes.ts`, like a single page app, and use the react-router-dom to navigate to the different screens.

You can use the react-router-dom router like this:

```tsx
import { useHistory } from "react-router-dom";

function ActiveLink() {
  const history = useHistory();

  const goToUserProfile = () => {
    history.push("/backend/user-profile")
  };

  return (
    <button onClick={goToUserProfile}>My Profile</button>
  );
}
```
