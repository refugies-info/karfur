import React from "react";
import styled from "styled-components";
import { useTranslation } from "next-i18next";
import { IDispositif } from "types/interface";
import { ObjectId } from "mongodb";
import SearchResultCard from "components/Pages/advanced-search/SearchResultCard";
import styles from "./RightAnnuaireDetails.module.scss";

// on firefox behaviour is strange with overflow, we have to add an empty container to have margin
const BottomContainer = styled.div`
  margin-top: 75px;
  width: 100%;
  height: 5px;
  color: #e5e5e5;
`;

interface Props {
  dispositifsAssocies: ObjectId[] | IDispositif[];
}

export const RightAnnuaireDetails = (props: Props) => {
  // @ts-ignore
  const activeDispositifsAssocies = props.dispositifsAssocies.filter(
    (dispositif: IDispositif) => dispositif.status === "Actif"
  );
  const nbActiveDispositifs = activeDispositifsAssocies.length;
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <h2>{t("Annuaire.A lire", "À lire")}</h2>
        <div className={`${styles.figure} ${nbActiveDispositifs === 0 ? styles.red : ""}`}>
          {nbActiveDispositifs}
        </div>
      </div>
      <div className={styles.dispositifs}>
        {nbActiveDispositifs === 0 && (
          <>
            <div className={styles.empty_text}>
              {t(
                "Annuaire.noDispositif",
                "Oups! Cette structure n'a pas encore rédigé de fiche."
              )}
            </div>
            <div className={styles.empty} />
          </>
        )}
        {nbActiveDispositifs > 0 &&
          activeDispositifsAssocies.map((dispositif: IDispositif) => (
            <div
              key={dispositif._id.toString()}
              className={styles.card}
            >
              <SearchResultCard
                // @ts-ignore
                pin={() => {}}
                pinnedList={[]}
                dispositif={dispositif}
                showPinned={false}
              />
            </div>
          ))}
      </div>
      <BottomContainer>s</BottomContainer>
    </div>
  );
};
