import React, { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { GetNeedResponse, Id, Languages } from "@refugies-info/api-types";
import { needsSelector } from "services/Needs/needs.selectors";
import { fetchNeedsActionCreator } from "services/Needs/needs.actions";
import { isLoadingSelector } from "services/LoadingStatus/loadingStatus.selectors";
import { LoadingStatusKey } from "services/LoadingStatus/loadingStatus.actions";
import { NeedTradStatus } from "../../types";
import { getStatus } from "./functions";
import NeedButton from "./NeedButton";
import styles from "./TranslationNeedsList.module.scss";

const arrayLines = new Array(6).fill("a");
export type SortedNeed = GetNeedResponse & { status: NeedTradStatus };

interface Props {
  show: boolean;
  toggle: () => void;
  setSelectedNeedId: (arg: Id) => void;
  langueSelectedFr?: string;
  langueI18nCode: Languages;
}

const TranslationNeedsList = (props: Props) => {
  const dispatch = useDispatch();

  const isLoading = useSelector(isLoadingSelector(LoadingStatusKey.FETCH_NEEDS));
  useEffect(() => {
    dispatch(fetchNeedsActionCreator());
  }, [dispatch]);

  const needs = useSelector(needsSelector);
  const sortedNeeds = useMemo<SortedNeed[]>(() => {
    return needs
      .map((need) => {
        const status = getStatus(need, props.langueI18nCode);
        return { ...need, status };
      })
      .sort((a, b) => {
        if (a.status === b.status) {
          return a.theme.name.fr > b.theme.name.fr ? 1 : -1;
        }
        if (a.status === "À traduire") return -1;
        if (b.status === "À traduire") return 1;

        if (a.status === "À revoir") return -1;
        if (b.status === "À revoir") return 1;

        return 1;
      });
  }, [needs, props.langueI18nCode]);

  if (!props.langueSelectedFr || !props.langueI18nCode) return <div>Erreur</div>;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>
        Liste des besoins en {props.langueSelectedFr} <span className={styles.badge}>{(sortedNeeds || []).length}</span>
      </h2>

      <div className={styles.content}>
        {isLoading ? (
          <>
            {arrayLines.map((_, key) => {
              return (
                <div key={key} className={"bg-white"}>
                  <SkeletonTheme baseColor="#CDCDCD">
                    <Skeleton width={170} count={1} />
                  </SkeletonTheme>
                </div>
              );
            })}
          </>
        ) : (
          <>
            {sortedNeeds.map((need, key) => (
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
