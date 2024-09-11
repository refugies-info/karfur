import { fr } from "@codegouvfr/react-dsfr";
import Image from "next/image";
import { useEffect, useState } from "react";
import ThanksModalImage from "~/assets/dispositif/thanks-modal-image.svg";
import EVAIcon from "~/components/UI/EVAIcon/EVAIcon";
import styles from "./ThanksMessage.module.scss";

const icon = (
  <EVAIcon
    name="arrow-forward-outline"
    fill={fr.colors.decisions.text.actionHigh.blueFrance.default}
    size={16}
    className={styles.icon}
  />
);
interface Props {
  publish: () => void;
  content?: {
    title: string;
    items: string[];
  };
}

const ThanksMessage = ({ publish, content }: Props) => {
  const [isSaving, setIsSaving] = useState(false);
  useEffect(() => {
    if (!isSaving) {
      setIsSaving(true);
      publish();
    }
  }, [publish, isSaving]);

  return (
    <div>
      {content ? (
        <>
          <p>{content.title}</p>
          <ul className={styles.list}>
            {content.items.map((item, i) => (
              <li key={i}>
                {icon} {item}
              </li>
            ))}
          </ul>
        </>
      ) : null}
      <div className="text-center">
        <Image src={ThanksModalImage} width={274} height={160} alt="" />
      </div>
    </div>
  );
};

export default ThanksMessage;
