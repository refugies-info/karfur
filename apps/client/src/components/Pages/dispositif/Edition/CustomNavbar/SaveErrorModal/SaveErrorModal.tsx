import { useCallback, useState } from "react";
import TutorielImage from "~/assets/dispositif/tutoriel-image.svg";
import { useAnnounce } from "~/components/Accessibility/ScreenReaderAnnouncer";
import BaseModal from "~/components/UI/BaseModal";
import Button from "~/components/UI/Button";
import Image from "~/components/UI/Image";
import type { AutosaveErrorDetails } from "~/lib/autosaveError";

interface Props {
  show: boolean;
  errorDetails?: AutosaveErrorDetails | null;
}

const SaveErrorModal = (props: Props) => {
  const reload = useCallback(() => location.reload(), []);
  const { errorDetails } = props;
  const announce = useAnnounce();
  const [copyState, setCopyState] = useState<"idle" | "done" | "error">("idle");

  const copyDetails = useCallback(async () => {
    if (!errorDetails) return;
    try {
      await navigator.clipboard.writeText(JSON.stringify(errorDetails, null, 2));
      setCopyState("done");
      announce("Informations techniques copiées");
    } catch {
      // clipboard indisponible (permission refusée, contexte non sécurisé) : on le dit,
      // les informations restent lisibles à l'écran.
      setCopyState("error");
      announce("La copie a échoué, les informations restent affichées");
    }
  }, [errorDetails, announce]);

  return (
    <BaseModal
      show={props.show}
      title={"Oups, il y a un problème avec la sauvegarde automatique !"}
      small
    >
      <p>
        Pas d’inquiétude, seules vos dernières modifications n’ont pas été prises en compte. Cliquez
        sur « Rafraîchir la page ».
      </p>
      <p>
        Si cela ne fonctionne toujours pas, vous pouvez quitter l’éditeur et revenir ensuite sur
        votre fiche. Contactez-nous via le chat en bas à droite si besoin.
      </p>
      {/* Volontairement discret : les utilisatrices et utilisateurs sont des associations,
          le détail ne sert qu'à ce que le support puisse le demander au téléphone. */}
      {errorDetails && (
        <details className="mb-4 text-xs text-gray-500">
          <summary className="cursor-pointer select-none">
            Informations techniques (utiles au support)
          </summary>
          <ul className="mt-1 mb-1 list-none break-all">
            {errorDetails.status !== null && <li>Code : {errorDetails.status}</li>}
            <li>Message : {errorDetails.message}</li>
            {errorDetails.fields.length > 0 && (
              <li>Champs refusés : {errorDetails.fields.join(", ")}</li>
            )}
            {errorDetails.eventId && <li>Référence : {errorDetails.eventId}</li>}
          </ul>
          <button type="button" onClick={copyDetails} className="underline">
            Copier
          </button>
          {copyState !== "idle" && (
            <span className="ms-2" aria-hidden="true">
              {copyState === "done" ? "Copié" : "Copie impossible"}
            </span>
          )}
        </details>
      )}
      <div className="mb-8 flex justify-center">
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
