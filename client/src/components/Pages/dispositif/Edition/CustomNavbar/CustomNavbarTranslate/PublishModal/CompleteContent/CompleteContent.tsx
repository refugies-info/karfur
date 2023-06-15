import Image from "next/image";
import { Languages } from "@refugies-info/api-types";
import BubbleFlag from "components/UI/BubbleFlag";
import Button from "components/UI/Button";
import PublishImage from "assets/dispositif/publish-image.svg";
import styles from "./CompleteContent.module.scss";

interface Props {
  publish: () => void;
  locale?: Languages;
  nbWords: number;
}

const CompleteContent = (props: Props) => {
  return (
    <>
      <p>
        Toutes les informations sont désormais traduites. Votre fiche va être publiée sur le site dans votre langue.
      </p>
      <div className={styles.done}>
        {props.locale && <BubbleFlag ln={props.locale} className="me-2" />}
        Félicitations, vous avez validé et traduit {props.nbWords} mots !
      </div>
      <div className="text-center mb-8 mt-6">
        <Image src={PublishImage} width={345} height={240} alt="" />
      </div>
      <div className="text-end">
        <Button
          onClick={(e: any) => {
            e.preventDefault();
            props.publish();
          }}
          evaIcon="arrow-forward-outline"
          iconPosition="right"
        >
          Publier
        </Button>
      </div>
    </>
  );
};

export default CompleteContent;
