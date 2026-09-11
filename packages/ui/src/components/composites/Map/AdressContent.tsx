import type { Poi } from "@refugies-info/api-types";
import { useTranslation } from "next-i18next";
import { CopyButton } from "./CopyButton";

type AdressContentProps = {
  poi: Poi;
};

// The classes each line carried as a <p>, plus p-0 for the padding DSFR sets on li.
const LINE_CLASS =
  "text-default-grey text-corps-sm !m-0 flex w-full items-center justify-between gap-2 p-0";

export default function AdressContent({ poi }: AdressContentProps) {
  const { t } = useTranslation();
  const clipBoardCopy = (address: string) => {
    navigator.clipboard.writeText(address);
  };

  // Venue details: enumeration structured as ul/li (RGAA 9.3), nothing rendered when empty.
  // The explicit roles are justified on the contentAs prop of MetaDataItem.
  const lines = [
    poi.address && poi.address.length > 1 ? (
      <li key="address" className={LINE_CLASS} role="listitem">
        <span className="min-w-0 flex-1">{poi.address}</span>
        <CopyButton
          title={t("Dispositif.mapCopyAddress", "Copier l'adresse")}
          onClick={() => clipBoardCopy(poi.address)}
        />
      </li>
    ) : null,
    poi.phone && poi.phone.length > 1 ? (
      <li key="phone" className={LINE_CLASS} role="listitem">
        <a href={`tel:${poi.phone}`} className="min-w-0 flex-1">
          {poi.phone}
        </a>
        <CopyButton
          title={t("Dispositif.mapCopyPhone", "Copier le numéro de téléphone")}
          onClick={() => clipBoardCopy(poi.phone as string)}
        />
      </li>
    ) : null,
    poi.email && poi.email !== "ajouter@votreemail.fr" && poi.email.length > 1 ? (
      <li key="email" className={LINE_CLASS} role="listitem">
        <a href={`mailto:${poi.email}`} className="min-w-0 flex-1">
          {poi.email}
        </a>
        <CopyButton
          title={t("Dispositif.mapCopyEmail", "Copier l'email")}
          onClick={() => clipBoardCopy(poi.email as string)}
        />
      </li>
    ) : null,
  ].filter(Boolean);

  return (
    <address className="flex h-full flex-col gap-2 bg-white p-4 not-italic">
      {lines.length > 0 && (
        <ul className="m-0 flex w-full list-none flex-col gap-2 p-0" role="list">
          {lines}
        </ul>
      )}
    </address>
  );
}
