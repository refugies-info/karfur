import { DispositifStatus, UpdateDispositifRequest } from "@refugies-info/api-types";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import { useMemo, useState } from "react";
import { DeepPartialSkipArrayKey, useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import defaultStructureImage from "~/assets/recherche/default-structure-image.svg";
import Button from "~/components/UI/Button";
import EVAIcon from "~/components/UI/EVAIcon/EVAIcon";
import { cls } from "~/lib/classname";
import { isStatus } from "~/lib/dispositif";
import { selectedDispositifSelector } from "~/services/SelectedDispositif/selectedDispositif.selector";
import { userSelector } from "~/services/User/user.selectors";
import BaseCard from "../BaseCard";
import styles from "./CardDemarcheAdministration.module.scss";
import DeleteContentModal from "./DeleteContentModal";

interface Props {
  dataAdministration: DeepPartialSkipArrayKey<UpdateDispositifRequest["administration"]>;
  color: string;
  onClick?: () => void;
}

const CardDemarcheAdministration = ({ dataAdministration, color, onClick }: Props) => {
  const { t } = useTranslation();
  const user = useSelector(userSelector);
  const dispositif = useSelector(selectedDispositifSelector);
  const { setValue } = useFormContext();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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
            content: (
              <span className={styles.name}>
                <span>{dataAdministration?.name}</span>
                {isAllowedToEdit && (
                  <Button
                    priority="tertiary"
                    evaIcon="trash-2-outline"
                    onClick={(e: any) => {
                      e.stopPropagation();
                      e.preventDefault();
                      setShowDeleteModal(true);
                    }}
                    className={cls("ms-2", styles.delete)}
                  ></Button>
                )}
              </span>
            ),
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
      <DeleteContentModal
        show={showDeleteModal}
        toggle={() => setShowDeleteModal((o) => !o)}
        onValidate={() => {
          setValue("administration", { name: null, logo: null });
          setShowDeleteModal(false);
        }}
      />
    </>
  );
};

export default CardDemarcheAdministration;
