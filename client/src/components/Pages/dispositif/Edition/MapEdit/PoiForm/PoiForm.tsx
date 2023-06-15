import React from "react";
import Button from "components/UI/Button";
import { Poi } from "@refugies-info/api-types";
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
    !!poiForm?.title &&
    !!poiForm?.address &&
    (!poiForm?.email || isValidEmail(poiForm?.email)) &&
    (!poiForm?.phone || isValidPhone(poiForm?.phone));

  return (
    <div className={styles.container}>
      <div className={styles.form}>
        <div className="text-end">
          <Button
            evaIcon="close-outline"
            iconPosition="right"
            priority="tertiary"
            className={styles.close}
            onClick={(e: any) => {
              e.preventDefault();
              onClose();
            }}
          >
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
          label="Email de contact (optionnel)"
          value={poiForm?.email || ""}
          onChange={(e) => setPoiForm({ ...poiForm, email: e.target.value || "" })}
          className="mb-4"
          icon="at-outline"
          error={poiForm?.email && !isValidEmail(poiForm?.email) ? "Le format n'est pas valide." : undefined}
        />
        <Input
          id="input-poi-phone"
          label="Téléphone (optionnel)"
          value={poiForm?.phone || ""}
          onChange={(e) => setPoiForm({ ...poiForm, phone: e.target.value || "" })}
          className="mb-4"
          icon="phone-outline"
          error={poiForm?.phone && !isValidPhone(poiForm?.phone) ? "Le format n'est pas valide." : undefined}
        />
        <Input
          id="input-poi-description"
          label="Informations pratiques (optionnel)"
          value={poiForm?.description || ""}
          onChange={(e) => setPoiForm({ ...poiForm, description: e.target.value || "" })}
          placeholder="Exemple : jours et horaires d’ouverture"
          className="mb-4"
        />
        <div className="text-end">
          {!!onDelete && (
            <Button
              priority="secondary"
              onClick={(e: any) => {
                e.preventDefault();
                onDelete();
              }}
              evaIcon="trash-2-outline"
              iconPosition="right"
              className="me-4"
            >
              Supprimer
            </Button>
          )}
          <Button
            onClick={(e: any) => {
              e.preventDefault();
              onValidate();
            }}
            evaIcon="checkmark-circle-2"
            iconPosition="right"
            disabled={!isFormOk}
          >
            Valider
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PoiForm;
