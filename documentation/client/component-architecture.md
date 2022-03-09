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
