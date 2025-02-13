interface Props {
  children: number;
}

export const ImageCustomFigure = (props: Props) => {
  return (
    <span className="absolute w-[48px] h-[48px] right-0 top-[16px] flex items-center justify-center text-white text-small font-bold leading-none">
      +{props.children}
    </span>
  );
};
