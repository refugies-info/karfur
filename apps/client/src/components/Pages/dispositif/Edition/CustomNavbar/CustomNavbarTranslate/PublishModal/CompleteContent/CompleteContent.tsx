import type { Languages } from "@refugies-info/api-types";
import PublishImage from "~/assets/dispositif/publish-image.svg";
import BubbleFlag from "~/components/UI/BubbleFlag";
import Button from "~/components/UI/Button";
import Image from "~/components/UI/Image";
import styles from "./CompleteContent.module.scss";

interface Props {
  publish: () => void;
  isPublishing: boolean;
  locale?: Languages;
  nbWords: number;
}

const CompleteContent = (props: Props) => {
  return (
    <>
      <p>
        Toutes les informations sont désormais traduites. Votre fiche va être publiée sur le site
        dans votre langue.
      </p>
      <div className={styles.done}>
        {props.locale && <BubbleFlag ln={props.locale} className="me-2" />}
        Félicitations, vous avez validé et traduit {props.nbWords} mots !
      </div>
      <div className="mt-6 mb-8 flex justify-center">
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
          disabled={props.isPublishing}
        >
          Publier
        </Button>
      </div>
    </>
  );
};

export default CompleteContent;
