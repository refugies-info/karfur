import { Title2 } from "~/components/Pages/staticPages/common/Title2";

interface Props {
  title: string;
  subtitle: string;
}

export const SectionHead = (props: Props) => (
  <div className="max-w-[720px] mb-10 lg:mb-20 mx-auto">
    <Title2 smallMb>{props.title}</Title2>
    <p className="!text-chapo md:text-center !mb-0">{props.subtitle}</p>
  </div>
);
