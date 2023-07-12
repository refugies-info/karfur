import { useCallback, useState } from "react";
import { useToggle } from "react-use";
import Image from "next/image";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { ContentType, DispositifStatus } from "@refugies-info/api-types";
import { getPath } from "routes";
import API from "utils/API";
import { selectedDispositifSelector } from "services/SelectedDispositif/selectedDispositif.selector";
import Button from "components/UI/Button";
import BaseModal from "components/UI/BaseModal";
import { ChoiceButton } from "../Edition";
import Status from "../Status";
import YesIcon from "assets/dispositif/yes-icon.svg";
import NoIcon from "assets/dispositif/no-icon.svg";
import ReceiveDispositif from "assets/dispositif/receive-dispositif.svg";
import styles from "./StructureReceiveDispositif.module.scss";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import Swal from "sweetalert2";

const StructureReceiveDispositif = () => {
  const [receiveDispositif, setReceiveDispositif] = useState<boolean | null>(null);
  const [showModal, toggleModal] = useToggle(false);
  const dispositif = useSelector(selectedDispositifSelector);

  const submit = async () => {
    const id = dispositif?._id;
    if (!id) return;
    try {
      await API.structureReceiveDispositifStatus(id, { accept: !!receiveDispositif });
      toggleModal(true);
    } catch (e: any) {
      Swal.fire({
        icon: "error",
        title: "Oups...",
        text: "Une erreur s'est produite. Veuillez réessayer ou contacter un administrateur",
        footer: e.response?.data?.message,
      });
    }
  };

  const router = useRouter();
  const goToEdit = useCallback(() => {
    const id = dispositif?._id;
    if (!id) return;
    router.push({
      pathname:
        dispositif.typeContenu === ContentType.DEMARCHE
          ? getPath("/demarche/[id]/edit", router.locale)
          : getPath("/dispositif/[id]/edit", router.locale),
      query: { id: dispositif._id.toString() },
    });
  }, [router, dispositif]);

  const quit = useCallback(() => router.push("/backend/user-dash-contrib"), [router]);

  return (
    <div className={styles.container}>
      <Status status={DispositifStatus.WAITING_STRUCTURE} isAdmin={true} hasDraftVersion={false} text="En attente" />
      <div className={styles.title}>Voulez-vous récupérer cette fiche ?</div>
      <p>
        <strong>{dispositif?.creatorId?.username || "Un utilisateur"}</strong> a proposé cette fiche et a indiqué que
        votre structure porte ce dispositif. En cochant « Oui », vous pourrez modifier et valider la fiche. Si vous
        cochez « Non », elle ne sera jamais publiée sur le site de Réfugiés.info.
      </p>

      <div>
        <ChoiceButton
          onSelect={() => setReceiveDispositif(true)}
          selected={receiveDispositif === true}
          text="Oui"
          type="radio"
          image={YesIcon}
          className="mb-4"
        />
        <ChoiceButton
          onSelect={() => setReceiveDispositif(false)}
          selected={receiveDispositif === false}
          text="Non"
          type="radio"
          image={NoIcon}
          className="mb-4"
        />
        <Button
          onClick={submit}
          evaIcon="checkmark-circle-2"
          iconPosition="right"
          className="w-100 justify-content-center"
          disabled={receiveDispositif === null}
        >
          Valider
        </Button>
      </div>

      <BaseModal
        show={showModal}
        toggle={toggleModal}
        title={
          receiveDispositif ? (
            <>
              <EVAIcon name="checkmark-circle-2" size={32} fill={styles.lightTextDefaultSuccess} className="me-2" />{" "}
              Super !
            </>
          ) : (
            "C'est noté !"
          )
        }
        small
      >
        <div>
          {receiveDispositif ? (
            <>
              <p>
                Vous êtes désormais responsable de cette fiche. Nous comptons sur vous pour maintenir ce contenu à jour
                et répondre aux suggestions des contributeurs.
              </p>
              <div className="text-center mb-8">
                <Image src={ReceiveDispositif} width={224} height={160} alt="" />
              </div>
              <div className="text-end">
                <Button onClick={goToEdit} evaIcon="arrow-forward-outline" iconPosition="right">
                  C'est parti
                </Button>
              </div>
            </>
          ) : (
            <>
              <p>Cette fiche restera en brouillon. Merci d’avoir pris le temps de répondre. </p>
              <div className="text-end">
                <Button onClick={quit} evaIcon="arrow-forward-outline" iconPosition="right">
                  Revenir à mon espace
                </Button>
              </div>
            </>
          )}
        </div>
      </BaseModal>
    </div>
  );
};

export default StructureReceiveDispositif;
