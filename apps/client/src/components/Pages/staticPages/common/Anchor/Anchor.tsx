interface Props {
  id: string;
}

// Focusable target for in-page links, kept out of the tab order and without a visible outline
export const Anchor = (props: Props) => {
  return (
    <span
      id={props.id}
      tabIndex={-1}
      className="absolute -top-[96px] outline-none md:-top-[120px]"
    />
  );
};
