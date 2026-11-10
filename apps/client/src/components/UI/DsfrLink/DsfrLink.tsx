import NextLink from "next/link";
import { type ComponentProps, forwardRef } from "react";

type Props = ComponentProps<typeof NextLink>;

/**
 * Link component registered with react-dsfr.
 *
 * react-dsfr renders every link through the registered component, and next/link requires
 * an href. A disabled link (role="link" + aria-disabled) has no destination, so it is
 * rendered as a plain anchor without href (RGAA 6.1).
 */
const DsfrLink = forwardRef<HTMLAnchorElement, Props>((props, ref) => {
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
      ...anchorProps
    } = props;
    return <a ref={ref} {...anchorProps} />;
  }

  return <NextLink ref={ref} {...props} />;
});

DsfrLink.displayName = "DsfrLink";

export default DsfrLink;
