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
          {/* Blockquote prescribed by the Ideance audit, P12, criterion 9.4. The name and the
              position stay outside, they are the source of the quote. */}
          <blockquote className="m-0">
            <p className="!text-large !mb-6">{testimony.text}</p>
          </blockquote>
          <div>
            <p className="mb-2 font-bold">{testimony.name}</p>
            <p className="mb-0">{testimony.position}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TestimonySlider;
