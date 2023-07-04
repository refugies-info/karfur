import React, { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { Id, Languages } from "@refugies-info/api-types";
import { isLoadingSelector } from "services/LoadingStatus/loadingStatus.selectors";
import { LoadingStatusKey } from "services/LoadingStatus/loadingStatus.actions";
import NeedButton from "./NeedButton";
import styles from "./TranslationNeedsList.module.scss";
import { SortedNeed } from "../TranslationsAvancement/TranslationsAvancement";

interface Props {
  setSelectedNeedId: (arg: Id) => void;
  langueSelectedFr?: string;
  langueI18nCode: Languages;
  sortedNeeds: SortedNeed[];
}

const TranslationNeedsList = (props: Props) => {
  const isLoading = useSelector(isLoadingSelector(LoadingStatusKey.FETCH_NEEDS));
  if (!props.langueSelectedFr || !props.langueI18nCode) return <div>Erreur</div>;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>
        Liste des besoins en {props.langueSelectedFr} <span className={styles.badge}>{props.sortedNeeds.length}</span>
      </h2>

      <div className={styles.content}>
        {isLoading ? (
          <>
            <SkeletonTheme baseColor="#CDCDCD">
              <Skeleton width={910} height={50} count={6} />
            </SkeletonTheme>
          </>
        ) : (
          <>
            {props.sortedNeeds.map((need, key) => (
              <NeedButton
                key={key}
                onClick={() => props.setSelectedNeedId(need._id)}
                need={need}
                langueI18nCode={props.langueI18nCode}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default TranslationNeedsList;
