import { GetThemeResponse } from "@refugies-info/api-types";
import Link from "next/link";
import { useMemo } from "react";
import Image from "~/components/UI/Image";

interface Props {
  theme: GetThemeResponse;
  value: string;
  onClick?: () => void;
  href?: string;
}

const SearchThemeButton = (props: Props) => {
  const content = useMemo(
    () => (
      <div className="flex items-center justify-center gap-1 px-0.5 py-0.5">
        {props.theme?.icon?.secure_url && <Image src={props.theme.icon.secure_url} width="12" height="12" alt="" />}
        <span className="text-title-grey text-[0.75rem] leading-[1.25rem] font-normal">{props.value}</span>
      </div>
    ),
    [props.theme, props.value],
  );

  return props.href ? (
    <Link
      className="flex h-6 flex-col items-center rounded-[0.75rem] px-2"
      style={{
        backgroundColor: props.theme.colors.color40,
      }}
      href={props.href}
      onClick={props.onClick}
    >
      {content}
    </Link>
  ) : (
    <button
      className="flex h-6 flex-col items-center rounded-[0.75rem] px-2"
      style={{
        backgroundColor: props.theme.colors.color40,
      }}
      onClick={() => {
        if (props.onClick) props.onClick();
        window.scrollTo(0, 0);
      }}
    >
      {content}
    </button>
  );
};
export default SearchThemeButton;
