import type { GetThemeResponse } from "@refugies-info/api-types";
import Link from "next/link";
import { useMemo, useState } from "react";
import Image from "~/components/UI/Image";

interface Props {
  theme: GetThemeResponse;
  value: string;
  onClick?: () => void;
  href?: string;
}

const SearchThemeButton = (props: Props) => {
  const [hover, setHover] = useState(false);
  const content = useMemo(
    () => (
      <span className="flex items-center justify-center gap-1 p-1 md:px-0.5 md:py-0.5">
        {props.theme?.icon?.secure_url && (
          <Image
            src={props.theme.icon.secure_url}
            width="12"
            height="12"
            className="scale-120"
            alt=""
          />
        )}
        <span className="text-title-grey line-height-[1rem] font-normal md:text-[0.75rem]">
          {props.value}
        </span>
      </span>
    ),
    [props.theme, props.value],
  );

  return props.href ? (
    <Link
      className="flex flex-col items-center rounded-full px-2"
      style={{
        backgroundColor: hover ? props.theme.colors.color60 : props.theme.colors.color40,
      }}
      href={props.href}
      onClick={props.onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
    >
      {content}
    </Link>
  ) : (
    <button
      className="flex flex-col items-center rounded-full px-2"
      style={{
        backgroundColor: props.theme.colors.color40,
      }}
      onClick={() => {
        if (props.onClick) props.onClick();
        window.scrollTo(0, 0);
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
    >
      {content}
    </button>
  );
};

export default SearchThemeButton;
