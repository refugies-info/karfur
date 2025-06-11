import { Poi } from "@refugies-info/api-types";
import { useTranslation } from "next-i18next";
import { CopyButton } from "./CopyButton";

type PopupContentProps = {
  poi: Poi;
};

export default function PopupContent({ poi }: PopupContentProps) {
  const { t } = useTranslation();
  const clipBoardCopy = (address: string) => {
    navigator.clipboard.writeText(address);
  };

  return (
    <div>
      <h3 className="text-corps-lg text-title-gray mb-0">{poi.title}</h3>
      {poi.address && (
        <p className="text-default-grey text-corps-sm !m-0 inline-flex w-full items-center gap-2">
          <span className="truncate">{poi.address}</span>
          <CopyButton
            title={t("Dispositif.mapCopyAddress", "Copier l'adresse")}
            onClick={() => clipBoardCopy(poi.address)}
          />
        </p>
      )}
      {poi.phone && (
        <p className="text-default-grey text-corps-sm !m-0 inline-flex w-full items-center gap-2">
          <span className="truncate">{poi.phone}</span>
          <CopyButton
            title={t("Dispositif.mapCopyPhone", "Copier le numéro de téléphone")}
            onClick={() => clipBoardCopy(poi.phone as string)}
          />
        </p>
      )}
      {poi.email && poi.email !== "ajouter@votreemail.fr" && (
        <p className="text-default-grey text-corps-sm !m-0 inline-flex w-full items-center gap-2">
          <span className="truncate">{poi.email}</span>
          <CopyButton
            title={t("Dispositif.mapCopyEmail", "Copier l'email")}
            onClick={() => clipBoardCopy(poi.email as string)}
          />
        </p>
      )}
    </div>
  );
}
