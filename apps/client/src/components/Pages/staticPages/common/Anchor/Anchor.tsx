interface Props {
  id: string;
}

export const Anchor = (props: Props) => {
  return (
    <span
      id={props.id}
      tabIndex={-1}
      className="absolute -top-[96px] outline-none md:-top-[120px]"
    />
  );
};
