# Header

The header is now fully integrated with the `Page` component.
By default, the header content is empty but you can specify another `HeaderContent`.

## Usage

By default, the Page Header provide a back button and a language switch a the top of the screen :

```js
<Page>// My content</Page>
```

--

If you want to add a fix title between buttons :

```js
<Page headerTitle="My title" headerIconName="profile">
  // My content
</Page>
```

--

If you want a big collapsible title a the top of the content, you can use the shortcut prop `title` :

```js
<Page title="My big title">// My content</Page>
```

This will set for you a `HeaderContentTitle`.

--

If you want to create a fully custom `HeaderContent`, you have to inherit `HeaderContentProps` type for your component props.
The `HeaderContent` can be animated using the `animatedController` prop.

```js
export type HeaderContentProps = {
  animatedController: Animated.Value,
  showSimplifiedHeader: boolean,
  title?: string,
};
```

Example : see `src/components/layout/Header/HeaderContentContentsScreen.tsx`

Usage :

```js
    <Page
      backScreen={backScreen}
      loading={isLoading}
      headerTitle={needName}
      HeaderContent={
        withProps({
          themeDarkColor: colors.color100,
          themeName: theme?.name[currentLanguageI18nCode || "fr"] || "",
          icon: theme?.icon,
          navigation,
          needName,
          nbContents: contentsToDisplay.length,
          isLoading,
        })(
          HeaderContentContentsScreen
        ) as React.ComponentType<HeaderContentProps>
      }
      headerBackgroundColor={colors.color100}
    >
```
