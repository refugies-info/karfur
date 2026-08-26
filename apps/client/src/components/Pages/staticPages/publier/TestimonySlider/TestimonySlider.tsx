import Image from "next/image";
import TestimonyIcon from "~/assets/staticPages/publier/testimony-icon.svg";

type Testimony = {
  text: string;
  name: string;
  position: string;
};

interface Props {
  testimonies: Testimony[];
}

const TestimonySlider = (props: Props) => {
  return (
    <div className="flex flex-col gap-10 md:flex-row">
      {props.testimonies.map((testimony, i) => (
        <div key={i} className="flex-1 space-y-6 md:px-8">
          <Image src={TestimonyIcon} width={40} height={40} alt="" />
          {/* Bloc de citation relevé par l'audit : structuré en blockquote (RGAA 9.4).
              Le nom et la fonction restent hors du blockquote, ils en sont la source. */}
          <blockquote className="m-0">
            <p className="!text-large !mb-6">{testimony.text}</p>
          </blockquote>
          <div>
            <div className="mb-2 font-bold">{testimony.name}</div>
            <div>{testimony.position}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TestimonySlider;
