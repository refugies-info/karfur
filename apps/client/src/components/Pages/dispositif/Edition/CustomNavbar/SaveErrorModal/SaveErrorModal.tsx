import { useCallback } from "react";
import TutorielImage from "~/assets/dispositif/tutoriel-image.svg";
import BaseModal from "~/components/UI/BaseModal";
import Button from "~/components/UI/Button";
import Image from "~/components/UI/Image";
import { type AutosaveErrorDetails, formatBytes } from "~/lib/autosaveError";

interface Props {
  show: boolean;
  errorDetails?: AutosaveErrorDetails | null;
  toggle?: () => void;
}

const SaveErrorModal = (props: Props) => {
  const reload = useCallback(() => location.reload(), []);
  const { errorDetails } = props;

  return (
    <BaseModal
      show={props.show}
      toggle={props.toggle}
      title={"Oups, il y a un problème avec la sauvegarde automatique !"}
      small
    >
      <div className="mt-6 flex flex-col gap-8">
        <div className="flex flex-col gap-6 text-normal text-default-grey">
          <p className="mb-0">
            Pas d’inquiétude, seules vos dernières modifications n’ont pas été prises en compte.
            Cliquez sur « Rafraîchir la page ».
          </p>
          <p className="mb-0">
            Si cela ne fonctionne toujours pas, vous pouvez quitter l’éditeur et revenir ensuite sur
            votre fiche. Contactez-nous via le chat en bas à droite si besoin.
          </p>
        </div>

        {/* Le détail technique complet part sur Slack et dans Sentry : ici on ne montre que ce
            qui est compréhensible, plus la référence à donner au support. */}
        {errorDetails && (
          <div className="flex gap-3 bg-contrast-grey">
            <div
              className="w-1 shrink-0 self-stretch bg-[var(--color-border-default-blue-france)]"
              aria-hidden="true"
            />
            <div className="flex flex-1 flex-col gap-3 py-4 pe-4">
              <p className="mb-0 text-h6 font-bold text-title-grey">
                Informations techniques transmises à l’équipe RI
              </p>
              <div className="flex flex-col gap-4 text-normal text-default-grey">
                {errorDetails.userMessage && <p className="mb-0">{errorDetails.userMessage}</p>}
                {errorDetails.payloadSize && (
                  <p className="mb-0">
                    Volume envoyé : {formatBytes(errorDetails.payloadSize.bytes)} (maximum accepté :{" "}
                    {formatBytes(errorDetails.payloadSize.limitBytes)})
                  </p>
                )}
                <p className="mb-0 break-all">Référence : {errorDetails.reference}</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-center">
          <Image src={TutorielImage} width={113} height={77} alt="" />
        </div>

        <div className="flex justify-end">
          <Button onClick={reload} evaIcon="refresh-outline" iconPosition="right">
            Rafraîchir la page
          </Button>
        </div>
      </div>
    </BaseModal>
  );
};

export default SaveErrorModal;
