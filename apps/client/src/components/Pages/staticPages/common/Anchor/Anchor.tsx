interface Props {
  id: string;
}

export const Anchor = (props: Props) => {
  return <span id={props.id} className="absolute -top-[96px] md:-top-[120px]" />;
};
