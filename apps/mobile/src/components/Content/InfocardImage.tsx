import { Metadatas } from "@refugies-info/api-types";
import Age from "~/theme/images/infocards/Age";
import Commitment from "~/theme/images/infocards/Commitment";
import Durations from "~/theme/images/infocards/Durations";
import Free from "~/theme/images/infocards/Free";
import FrenchLevel from "~/theme/images/infocards/FrenchLevel";
import Location from "~/theme/images/infocards/Location";
import Price from "~/theme/images/infocards/Price";
import Public from "~/theme/images/infocards/Public";
import Status from "~/theme/images/infocards/Status";

type metaKeys = keyof Metadatas;
interface Props {
  color: string;
  isFree: boolean;
  title: metaKeys | "mainSponsor";
}

export const IMAGE_SIZE = 56;
export const InfocardImage = ({ color, title, isFree }: Props) => {
  const iconProps = {
    color,
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
  };

  switch (title) {
    case "price":
      return isFree ? <Free {...iconProps} /> : <Price {...iconProps} />;
    case "commitment":
      return <Commitment {...iconProps} />;
    case "frequency":
      return <Durations {...iconProps} />;
    case "timeSlots":
      return <Durations {...iconProps} />;
    case "location":
      return <Location {...iconProps} />;
    case "age":
      return <Age {...iconProps} />;
    case "frenchLevel":
      return <FrenchLevel {...iconProps} />;
    case "publicStatus":
      return <Status {...iconProps} />;
    case "public":
      return <Public {...iconProps} />;
    default:
      return <Public {...iconProps} />;
  }
};
