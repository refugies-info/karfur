# Styling guide

## Dependencies

The app uses [reactstrap](https://github.com/reactstrap/reactstrap), which allows to use easily Bootstrap components in react, and [core-ui](https://github.com/coreui/coreui), which is built over Bootstrap components.

## Architecture

### Global styles

Global styles are located at `src/scss`.

The entry point `src/scss/index.scss` is included in `src/pages/_app.tsx` and loaded on every pages.
It loads all the CSS needed by external libraries and some global styling needed for the app.

In this folder, you will also find:
- `components/`: all the CSS modules used across several components
- `mixins/`: all the SCSS mixins needed during the styling process
- `pages/`: each page has its own CSS module which is located here

### Components

The choice has been made to use [SCSS modules](https://create-react-app.dev/docs/adding-a-css-modules-stylesheet/) for several reasons:
- it generates unique classnames to prevent style conflicts
- it reduces the size of HTML documents by keeping the style in CSS files
- it allows the browser to cache CSS files
- it makes the components as small as possible by moving style in a different file
- it is included by default with NextJS

## How to style a component?

1. If you need to apply only a few rules to an element, try to use the [Bootstrap 4 utilities](https://getbootstrap.com/docs/4.0/utilities)
  ```html
  <div className="d-flex align-itmes-center">
    ...
  </div>
  ```
2. If the element needs more complex styles, create a scss module and use the class name
  ```scss
  // mycomponent.module.scss
  .title {
    ...
  }
  ```

  ```js
  // mycomponent.tsx
  import styles from "./mycomponent.module.scss"
  ...

  return (
    <div className={styles.title}></div>
  )
  ```

  A unique class name will be generated for `title`, so you don't have to worry about collisions.

3. If you component needs multiple and/or conditional classes, use the `cls` helper
  ```js
  // mycomponent.tsx
  import { cls } from "lib/classname";
  import styles from "./mycomponent.module.scss"

  ...
  return (
    <div
    className={cls(styles.container, props.checked && styles.checked)}
    ></div>
  )
  ```

## Helpers

### Colors

To use any color in a SCSS file, you must use it from the `scss/colors.scss` file:
```scss
@import "src/scss/colors";

.btn {
  color: $lightgreen;
}
```

### Texts

All the texts sizes and line heights from the design system are defined in the `text` mixin:

Example:
```scss
.text {
  /* this */
  @include text("large");

  /* is the same as this */
  font-size: 18px;
  line-height: 23px;
}
```

### Responsive

You must use the custom mixins to keep responsive consistent:
- `media-max` will apply the styles for all the screens, up to your parameter.
- `media-min` will apply the styles for all the screens, starting from your parameter.
- `isMobile` is a shortcut to apply styles for all the screens below 768px.

Example:
```scss
.btn {
  padding: 10px;

  @include media-max("sm-limit") {
    padding: 4px;
  }

  @include isMobile() {
    padding: 2px;
  }
}
```



The available breakpoints are the following ones:
```
phone-down      500px
sm-limit        577px
tablet-up       768px
md-limit        769px
tablet-down     900px
lg-limit        992px
desktop-up      1024px
xl-limit        1200px
desktop-down    1280px
widescreen-up   1440px
big-desktop     1565px
```

### Dimensions

The design system uses a multiple of 4 for the all the dimensions (spacing, sizes, ...).

For this, you can use the mixin `unit` to keep it consistent.

Example:
```scss
.btn {
  /* this */
  padding: 12px;

  /* is the same as this */
  padding: u(3);
}
```
