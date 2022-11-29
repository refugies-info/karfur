# Components

## Architecture

A component must have its own folder, which contains:
- `MyComponent/MyComponent.tsx`: the TS file of the component
- `MyComponent/MyComponent.module.scss`: the CSS module of the component. For more information, see the [styling guide](./styling.md)
- `MyComponent/index.ts`: exports the component
- `MyComponent/function.ts`: all the functions and helpers relative only to this component

## How to write a component?

A component must be a functional component:
```tsx
const BackButton = () => {
  return (
    <div>...</div>
  );
};
```

A component must be typed:
```tsx
interface Props {
  backCallback: (screen: string) => void
  text: string
}
const BackButton = (props: Props) => {
  return (
    <button onClick={props.backCallback}>
      {props.text}
    </button>
  );
};
```

## Responsive

If there is a specific component for the mobile version, it must have the following architecture:
- `MyComponent/index.ts`: exports the component
- `MyComponent/MyComponent.desktop.tsx`: the desktop TS file of the component
- `MyComponent/MyComponent.desktop.module.scss`: the desktop CSS module of the component.
- `MyComponent/MyComponent.mobile.tsx`: the mobile TS file of the component
- `MyComponent/MyComponent.mobile.module.scss`: the mobile CSS module of the component.
- `MyComponent/MyComponent.tsx`: the TS file of the component. It contains the logic to load the desktop or mobile version.

You can check `src/components/Pages/recherche/SearchHeader` for an example.
