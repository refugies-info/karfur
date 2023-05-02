import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { DeepPartialSkipArrayKey, useFormContext } from "react-hook-form";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import { DispositifStatus, Sponsor, UpdateDispositifRequest } from "api-types";
import { cls } from "lib/classname";
import { isStatus } from "lib/dispositif";
import { allStructuresSelector } from "services/AllStructures/allStructures.selector";
import { userSelector } from "services/User/user.selectors";
import { selectedDispositifSelector } from "services/SelectedDispositif/selectedDispositif.selector";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import Tooltip from "components/UI/Tooltip";
import FRLink from "components/UI/FRLink";
import Button from "components/UI/Button";
import BaseCard from "../BaseCard";
import DeleteContentModal from "./DeleteContentModal";
import defaultStructureImage from "assets/recherche/default-structure-image.svg";
import styles from "./CardMainSponsor.module.scss";

interface Props {
  dataMainSponsor: DeepPartialSkipArrayKey<UpdateDispositifRequest["mainSponsor"]>;
  color: string;
  onClick?: () => void;
}

const CardMainSponsor = ({ dataMainSponsor, color, onClick }: Props) => {
  const { t } = useTranslation();
  const user = useSelector(userSelector);
  const dispositif = useSelector(selectedDispositifSelector);
  const { setValue } = useFormContext();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const structures = useSelector(allStructuresSelector);
  const sponsor = useMemo(() => {
    if (typeof dataMainSponsor === "string") {
      const sponsor = structures.find((s) => s._id.toString() === dataMainSponsor);
      return {
        name: sponsor?.nom,
        logo: sponsor?.picture?.secure_url,
      };
    }
    return {
      name: (dataMainSponsor as Sponsor)?.name,
      logo: (dataMainSponsor as Sponsor)?.logo?.secure_url,
    };
  }, [dataMainSponsor, structures]);

  const isAllowedToEdit = useMemo(() => {
    return user.admin || isStatus(dispositif?.status, DispositifStatus.ACTIVE);
  }, [user, dispositif]);

  return (
    <>
      <BaseCard
        id="main-sponsor-card"
        title={
          <>
            <EVAIcon name="home-outline" size={24} fill={color || "#000"} className={"me-2"} />
            {t("Dispositif.structure")}
          </>
        }
        items={[
          {
            content: (
              <span className={styles.name}>
                <span>
                  <FRLink
                    onClick={(e: any) => {
                      e.stopPropagation();
                      e.preventDefault();
                    }}
                    href="#"
                  >
                    {sponsor.name}
                  </FRLink>
                </span>
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
                src={sponsor.logo || defaultStructureImage}
                width={32}
                height={32}
                style={{ objectFit: "contain" }}
                alt={sponsor.name || ""}
                className={styles.img}
              />
            ),
          },
        ]}
        color={color}
        onClick={isAllowedToEdit ? onClick : undefined}
      />
      {!isAllowedToEdit && (
        <>
          <Tooltip target="main-sponsor-card">
            Vous ne pouvez plus modifier la structure liée à votre fiche une fois celle-ci publiée. Contactez-nous via
            le chat si besoin.
          </Tooltip>
        </>
      )}
      <DeleteContentModal
        show={showDeleteModal}
        toggle={() => setShowDeleteModal((o) => !o)}
        onValidate={() => {
          setValue("mainSponsor", null);
          setShowDeleteModal(false);
        }}
      />
    </>
  );
};

export default CardMainSponsor;
