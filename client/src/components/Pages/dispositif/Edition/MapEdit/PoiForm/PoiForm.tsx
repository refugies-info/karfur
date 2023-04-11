import React from "react";
import Button from "components/UI/Button";
import { Poi } from "api-types";
import { isValidPhone, isValidEmail } from "lib/validateFields";
import Input from "components/Pages/dispositif/Input";
import styles from "./PoiForm.module.scss";

interface Props {
  poiForm: Partial<Poi> | null;
  setPoiForm: React.Dispatch<React.SetStateAction<Partial<Poi> | null>>;
  onValidate: () => void;
  onClose: () => void;
  onDelete?: () => void;
}

const PoiForm = ({ poiForm, setPoiForm, onValidate, onClose, onDelete }: Props) => {
  const isFormOk =
    !!poiForm?.title && !!poiForm?.address && isValidEmail(poiForm?.email) && isValidPhone(poiForm?.phone);

  return (
    <div className={styles.container}>
      <div className={styles.form}>
        <div className="text-end">
          <Button icon="close-outline" iconPlacement="end" tertiary className={styles.close} onClick={onClose}>
            Fermer
          </Button>
        </div>
        <Input
          id="input-poi-title"
          label="Titre du lieu"
          value={poiForm?.title || ""}
          onChange={(e) => setPoiForm({ ...poiForm, title: e.target.value || "" })}
          className="mb-4"
          icon="home-outline"
          valid={!!poiForm?.title}
        />
        <Input
          id="input-poi-address"
          label="Adresse du lieu"
          value={poiForm?.address || ""}
          onChange={(e) => setPoiForm({ ...poiForm, address: e.target.value || "" })}
          className="mb-4"
          icon="pin-outline"
          valid={!!poiForm?.address}
        />
        <Input
          id="input-poi-email"
          label="Email de contact"
          value={poiForm?.email || ""}
          onChange={(e) => setPoiForm({ ...poiForm, email: e.target.value || "" })}
          className="mb-4"
          icon="at-outline"
          valid={isValidEmail(poiForm?.email)}
          error={!isValidEmail(poiForm?.email) ? "Le format n'est pas valide." : undefined}
        />
        <Input
          id="input-poi-phone"
          label="Téléphone"
          value={poiForm?.phone || ""}
          onChange={(e) => setPoiForm({ ...poiForm, phone: e.target.value || "" })}
          className="mb-4"
          icon="phone-outline"
          valid={isValidPhone(poiForm?.phone)}
          error={!isValidPhone(poiForm?.phone) ? "Le format n'est pas valide." : undefined}
        />
        <Input
          id="input-poi-description"
          label="Informations pratiques"
          value={poiForm?.description || ""}
          onChange={(e) => setPoiForm({ ...poiForm, description: e.target.value || "" })}
          placeholder="Exemple : jours et horaires d’ouverture"
          className="mb-4"
        />
        <div className="text-end">
          {!!onDelete && (
            <Button secondary onClick={onDelete} icon="trash-2-outline" iconPlacement="end" className="me-4">
              Supprimer
            </Button>
          )}
          <Button onClick={onValidate} icon="checkmark-circle-2" iconPlacement="end" disabled={!isFormOk}>
            Valider
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PoiForm;
