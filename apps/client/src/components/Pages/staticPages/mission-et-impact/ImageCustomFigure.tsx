interface Props {
  children: number;
}

export const ImageCustomFigure = (props: Props) => {
  return (
    <span
      aria-hidden="true"
      className="text-small absolute top-[16px] right-0 flex h-[48px] w-[48px] items-center justify-center leading-none font-bold text-white"
    >
      +{props.children}
    </span>
  );
};
