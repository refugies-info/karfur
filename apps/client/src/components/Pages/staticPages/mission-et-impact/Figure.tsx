import Image from "next/image";

interface Props {
  title: string;
  text: string;
  image: any;
}

export const Figure = (props: Props) => {
  return (
    <div className="flex-1 space-y-6 text-center max-w-[304px]">
      <Image src={props.image} alt="" width={304} height={224} className="h-[224px]" />
      <h3 className="text-alt-title-big text-light-alt-blue">{props.title}</h3>
      <p className="text-large text-light-alt-blue">{props.text}</p>
    </div>
  );
};
