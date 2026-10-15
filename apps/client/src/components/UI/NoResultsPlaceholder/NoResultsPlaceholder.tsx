import type { ReactNode } from "react";
import TutoImg from "~/assets/dispositif/tutoriel-image.svg";
import Image from "~/components/UI/Image";

interface Props {
  title: string;
  text: string;
  role?: "alert";
  children?: ReactNode;
}

export const NoResultsPlaceholder = ({ title, text, role, children }: Props) => (
  <div role={role} className="flex flex-col items-center gap-10 py-14">
    <Image src={TutoImg} width={176} height={120} alt="" />
    <div className="text-chapo text-default-grey flex flex-col items-center gap-1.5 text-center">
      <h2 className="text-chapo mb-0 font-bold">{title}</h2>
      <p className="mb-0">{text}</p>
    </div>
    {children}
  </div>
);
