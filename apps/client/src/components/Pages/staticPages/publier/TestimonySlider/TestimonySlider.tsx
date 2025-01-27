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
    <div className="flex flex-col md:flex-row gap-10">
      {props.testimonies.map((testimony, i) => (
        <div key={i} className="flex-1 md:px-8 space-y-6">
          <Image src={TestimonyIcon} width={40} height={40} alt="" />
          <p className="!text-large !mb-6">{testimony.text}</p>
          <div>
            <div className="font-bold mb-2">{testimony.name}</div>
            <div>{testimony.position}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TestimonySlider;
