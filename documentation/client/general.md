# Client specific standards

Project was created and uses create-react-app to start and build (webpack config is generated automatically).

## Redux usage

1. Put all API calls in sagas and store infos in redux store
2. Create XXX.container (with connnection to HOC) and XXX.component files (example in AnnuaireLecture). Use Hooks to access redux store.

## Write small and reusable components

Separate components in multiple small reusable components to increase modularity and separate logic in different functions

## Typing

> Every new client file should be **fully typed**. If possible, type existing files.

## Testing

> Every file should be **fully tested**.

See SubComponents.test.tsx for examples of snapshot tests.

## How to add assets ?

In order to have a light bundle, put the assets on GCP bucket like explained in assets storage doc in private repo.

## How to add logs ?

- see [global standards](../general.md)
- Do not put logs in render

## How to write good css ?

The project is currently mainly coded with scss styling, but we are more and more transitioning toward a styled-components logic that better reflect and takes advantage of the structure and composing abilities of the React framework. By keeping the style logic within each component, we avoid common pitfalls such as difficult readability and conflicting class names.
styled-components allows you to write actual CSS inside your JavaScript, enabling you to use the full power of CSS 💪 without mapping between styles and components. There are many ways to style react applications, but many find styled-components to be a more natural approach to styling components.

styled-components

Below creates two styled react components (Title, Wrapper) and renders them as children of the Header component:

```
import React from 'react';
import styled from 'styled-components';

//Create a <Title> react component that renders an h1 which is centered, palevioletred and sized at 1.5em

const Title = styled.h1`
  font-size: 1.5em;
  text-align: center;
  color: palevioletred;
`;
```

Create a <Wrapper> react component that renders a section with some padding and a papayawhip background

```
const Wrapper = styled.section`
  padding: 4em;
  background: papayawhip;
`;
```

Use them like any other React component – except they're styled!

```
function Button() {
  return (
    <Wrapper>
      <Title>
        Hello {this.props.name}, this is your first styled component!
      </Title>
      ...
    </Wrapper>
  );
}
```

You can see an example of a simple static component in /karfur/client/src/components/Frontend/Dispositif/MediaUpload/StyledTab.js
Or an example of a styled-component declared within a much complex component in /karfur/client/src/components/Pages/dispositif/SideTrad/ExpertSideTrad.js
