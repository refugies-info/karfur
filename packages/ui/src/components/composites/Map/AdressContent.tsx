import type { Poi } from "@refugies-info/api-types";
import { useTranslation } from "next-i18next";
import { CopyButton } from "./CopyButton";

type AdressContentProps = {
  poi: Poi;
};

export default function AdressContent({ poi }: AdressContentProps) {
  const { t } = useTranslation();
  const clipBoardCopy = (address: string) => {
    navigator.clipboard.writeText(address);
  };

  return (
    <address className="h-full bg-white p-4 not-italic flex flex-col gap-2">
      {poi.address && poi.address.length > 1 ? (
        <p className="text-default-grey text-corps-sm !m-0 flex w-full items-center justify-between gap-2">
          <span className="flex-1 min-w-0">{poi.address}</span>
          <CopyButton
            title={t("Dispositif.mapCopyAddress", "Copier l'adresse")}
            onClick={() => clipBoardCopy(poi.address)}
          />
        </p>
      ) : null}
      {poi.phone && poi.phone.length > 1 ? (
        <p className="text-default-grey text-corps-sm !m-0 center buto flex w-full items-center justify-between gap-2">
          <a href={`tel:${poi.phone}`} className="flex-1 min-w-0">
            {poi.phone}
          </a>
          <CopyButton
            title={t("Dispositif.mapCopyPhone", "Copier le numéro de téléphone")}
            onClick={() => clipBoardCopy(poi.phone as string)}
          />
        </p>
      ) : null}
      {poi.email && poi.email !== "ajouter@votreemail.fr" && poi.email.length > 1 ? (
        <p className="text-default-grey text-corps-sm !m-0 flex w-full items-center justify-between gap-2">
          <a href={`mailto:${poi.email}`} className="flex-1 min-w-0">
            {poi.email}
          </a>
          <CopyButton
            title={t("Dispositif.mapCopyEmail", "Copier l'email")}
            onClick={() => clipBoardCopy(poi.email as string)}
          />
        </p>
      ) : null}
    </address>
  );
}
