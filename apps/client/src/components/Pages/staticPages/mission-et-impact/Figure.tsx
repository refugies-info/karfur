import Image from "next/image";

interface Props {
  title: string;
  text: string;
  image: any;
}

export const Figure = (props: Props) => {
  return (
    <div className="w-fit space-y-6 text-center">
      <span className="relative mx-auto flex h-[14rem] w-[16rem] xl:w-[19rem]">
        <Image src={props.image} alt="" className="" fill />
      </span>
      <h3 className="text-alt-title-big text-inverted-blue-france">{props.title}</h3>
      <p className="text-large text-inverted-blue-france">{props.text}</p>
    </div>
  );
};
