import Image from "next/image";

interface Props {
  title: string;
  text: string;
  image: any;
}

export const Figure = (props: Props) => {
  return (
    <div className="max-w-[304px] flex-1 space-y-6 text-center">
      <Image src={props.image} alt="" width={304} height={224} className="h-[224px]" />
      <h3 className="text-alt-title-big text-inverted-blue-france">{props.title}</h3>
      <p className="text-large text-inverted-blue-france">{props.text}</p>
    </div>
  );
};
