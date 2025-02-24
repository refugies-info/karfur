import { Title2 } from "~/components/Pages/staticPages/common/Title2";

interface Props {
  title: string;
  subtitle: string;
}

export const SectionHead = (props: Props) => (
  <div className="mx-auto mb-10 max-w-[720px] lg:mb-20">
    <Title2 smallMb>{props.title}</Title2>
    <p className="text-chapo mb-0 md:text-center">{props.subtitle}</p>
  </div>
);
