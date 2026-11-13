import NextLink from "next/link";
import { type ComponentProps, forwardRef } from "react";

type Props = ComponentProps<typeof NextLink>;

// next/link requires an href, which a disabled link must not have.
export const DsfrLink = forwardRef<HTMLAnchorElement, Props>((props, ref) => {
  const isDisabledLink =
    props.role === "link" && (props["aria-disabled"] === true || props["aria-disabled"] === "true");

  if (isDisabledLink) {
    const {
      href: _href,
      as: _as,
      replace: _replace,
      scroll: _scroll,
      shallow: _shallow,
      passHref: _passHref,
      prefetch: _prefetch,
      locale: _locale,
      legacyBehavior: _legacyBehavior,
      onClick: _onClick,
      ...anchorProps
    } = props;
    return <a ref={ref} {...anchorProps} />;
  }

  return <NextLink ref={ref} {...props} />;
});

DsfrLink.displayName = "DsfrLink";
