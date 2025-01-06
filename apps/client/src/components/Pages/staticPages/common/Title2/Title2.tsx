import { cls } from "~/lib/classname";

interface Props {
  children: string;
  className?: string;
}

export const Title2 = (props: Props) => (
  <h2 className={cls("!text-h3 md:!text-h2 !mb-10 md:!mb-20 md:text-center", props.className)}>{props.children}</h2>
);
