import TutorielImage from "@/assets/dispositif/tutoriel-image.svg";
import BaseModal from "@/components/UI/BaseModal";
import Button from "@/components/UI/Button";
import Image from "next/image";
import { useCallback } from "react";

interface Props {
  show: boolean;
}

const SaveErrorModal = (props: Props) => {
  const reload = useCallback(() => location.reload(), []);

  return (
    <BaseModal show={props.show} title={"Oups, il y a un problème avec la sauvegarde automatique !"} small>
      <p>
        Pas d’inquiétude, seules vos dernières modifications n’ont pas été prises en compte. Cliquez sur « Rafraîchir la
        page ».
      </p>
      <p>
        Si cela ne fonctionne toujours pas, vous pouvez quitter l’éditeur et revenir ensuite sur votre fiche.
        Contactez-nous via le chat en bas à droite si besoin.
      </p>
      <div className="text-center mb-8">
        <Image src={TutorielImage} width={176} height={120} alt="" />
      </div>
      <div className="text-end">
        <Button onClick={reload} evaIcon="refresh-outline" iconPosition="right">
          Rafraîchir la page
        </Button>
      </div>
    </BaseModal>
  );
};

export default SaveErrorModal;
