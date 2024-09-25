import { DispositifStatus, UpdateDispositifRequest } from "@refugies-info/api-types";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import { useMemo } from "react";
import { DeepPartialSkipArrayKey } from "react-hook-form";
import { useSelector } from "react-redux";
import defaultStructureImage from "~/assets/recherche/default-structure-image.svg";
import EVAIcon from "~/components/UI/EVAIcon/EVAIcon";
import { isStatus } from "~/lib/dispositif";
import { selectedDispositifSelector } from "~/services/SelectedDispositif/selectedDispositif.selector";
import { userSelector } from "~/services/User/user.selectors";
import BaseCard from "../BaseCard";
import styles from "./CardDemarcheAdministration.module.scss";

interface Props {
  dataAdministration: DeepPartialSkipArrayKey<UpdateDispositifRequest["administration"]>;
  color: string;
  onClick?: () => void;
}

const CardDemarcheAdministration = ({ dataAdministration, color, onClick }: Props) => {
  const { t } = useTranslation();
  const user = useSelector(userSelector);
  const dispositif = useSelector(selectedDispositifSelector);

  const isAllowedToEdit = useMemo(() => {
    return user.admin || (!isStatus(dispositif?.status, DispositifStatus.ACTIVE) && !dispositif?.hasDraftVersion);
  }, [user, dispositif]);

  return (
    <>
      <BaseCard
        id="demarche-administration-card"
        title={
          <>
            <EVAIcon name="image-outline" size={24} fill={color || "#000"} className={"me-2"} /> Administration
          </>
        }
        items={[
          {
            content: <span>{dataAdministration?.name}</span>,
            icon: (
              <Image
                src={dataAdministration?.logo?.secure_url || defaultStructureImage}
                width={32}
                height={32}
                style={{ objectFit: "contain" }}
                alt={dataAdministration?.name || ""}
                className={styles.img}
              />
            ),
          },
        ]}
        color={color}
        onClick={isAllowedToEdit ? onClick : undefined}
      />
    </>
  );
};

export default CardDemarcheAdministration;
