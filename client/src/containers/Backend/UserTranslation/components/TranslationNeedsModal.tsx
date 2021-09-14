import "./TranslationNeedsModal.scss";
import React, { useEffect, useState } from "react";
import { Modal, Table } from "reactstrap";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { ObjectId } from "mongodb";
import { Need, AvailableLanguageI18nCode } from "../../../../types/interface";
import { needsSelector } from "../../../../services/Needs/needs.selectors";
import { getTag } from "../../Admin/Needs/lib";
import { TagButton } from "../../Admin/Needs/TagButton";
import { jsUcfirst } from "../../../../lib";
import { fetchNeedsActionCreator } from "../../../../services/Needs/needs.actions";
import { isLoadingSelector } from "../../../../services/LoadingStatus/loadingStatus.selectors";
import { LoadingStatusKey } from "../../../../services/LoadingStatus/loadingStatus.actions";
import { colors } from "../../../../colors";
import FButton from "../../../../components/FigmaUI/FButton/FButton";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { TutorialTranslationModal } from "./TutorielTranslationModal";

interface Props {
  show: boolean;
  toggle: () => void;
  toggleOneNeedTranslationModal: () => void;
  setSelectedNeedId: (arg: ObjectId) => void;
  langueSelectedFr: null | string;
  langueI18nCode: null | string;
}
const Header = styled.div`
  font-weight: bold;
  font-size: 32px;
  margin-bottom: 8px;
`;

const StatusContainer = styled.div`
  background-color: ${(props) => props.backgroundColor};
  border-radius: 8px;
  padding: 10px;
  font-weight: bold;
  font-size: 16px;
  line-height: 20px;
  color: #ffffff;
  width: fit-content;
`;

const getStatusColorAndText = (
  need: Need,
  langueI18nCode: AvailableLanguageI18nCode
) => {
  if (!langueI18nCode)
    return { statusColor: colors.darkGrey, statusText: "Erreur" };

  // @ts-ignore
  if (!need[langueI18nCode] || !need[langueI18nCode].text)
    return { statusColor: colors.blue, statusText: "À traduire" };
  if (
    langueI18nCode &&
    need[langueI18nCode] &&
    // @ts-ignore
    need.fr.updatedAt > need[langueI18nCode].updatedAt
  )
    return { statusColor: colors.rouge, statusText: "À revoir" };
  return { statusColor: colors.green, statusText: "À jour" };
};

export const TranslationNeedsModal = (props: Props) => {
  const arrayLines = new Array(6).fill("a");
  const arrayContent = new Array(3).fill("a");
  const [showTutorielModal, setShowTutorielModal] = useState(false);

  const dispatch = useDispatch();

  const isLoading = useSelector(
    isLoadingSelector(LoadingStatusKey.FETCH_NEEDS)
  );
  useEffect(() => {
    dispatch(fetchNeedsActionCreator());
  }, []);
  const toggleTutorielModal = () => setShowTutorielModal(!showTutorielModal);
  const needs = useSelector(needsSelector);

  const needsWithStatus = needs.map((need) => {
    const { statusColor, statusText } = getStatusColorAndText(
      need,
      // @ts-ignore
      props.langueI18nCode
    );
    return { ...need, statusText, statusColor };
  });

  const sortedNeeds = needsWithStatus.sort((a: any, b: any) => {
    if (a.statusText === b.statusText) {
      return a.tagName > b.tagName ? 1 : -1;
    }
    if (a.statusText === "À revoir") return -1;
    if (b.statusText === "À revoir") return 1;

    if (a.statusText === "À traduire") return -1;
    if (a.statusText === "À traduire") return 1;

    return 1;
  });

  const onNeedClick = (need: Need) => {
    props.setSelectedNeedId(need._id);
    props.toggleOneNeedTranslationModal();
  };

  if (!props.langueSelectedFr || !props.langueI18nCode)
    return (
      <Modal
        isOpen={props.show}
        toggle={props.toggle}
        className="modal-besoins"
        size="lg"
      >
        Erreur
      </Modal>
    );

  if (isLoading) {
    return (
      <Modal
        isOpen={props.show}
        toggle={props.toggle}
        className="modal-besoins"
        size="lg"
      >
        <Header>{"Traduction des besoins"}</Header>
        <Table responsive borderless>
          <thead>
            <tr>
              {["Nom du besoin", "Thème", "Traduction", "Statut"].map(
                (element, key) => (
                  <th key={key}>
                    <div>{element}</div>
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {arrayLines.map((_, key) => {
              return (
                <tr key={key} className={"bg-blancSimple"}>
                  <td>
                    <SkeletonTheme color="#CDCDCD">
                      <Skeleton width={170} count={1} />
                    </SkeletonTheme>
                  </td>
                  {arrayContent.map((_, key) => (
                    <td key={key}>
                      <SkeletonTheme color="#CDCDCD">
                        <Skeleton width={100} count={1} />
                      </SkeletonTheme>
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </Table>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
          }}
        >
          <FButton
            className="mr-8"
            type="white"
            name="arrow-back-outline"
            onClick={props.toggle}
          >
            Retour
          </FButton>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      isOpen={props.show}
      toggle={props.toggle}
      className="modal-besoins"
      size="lg"
    >
      <Header>{"Traduction des besoins en " + props.langueSelectedFr}</Header>
      <Table responsive borderless>
        <thead>
          <tr>
            {["Nom du besoin", "Thème", "Traduction", "Statut"].map(
              (element, key) => (
                <th key={key}>
                  <div>{element}</div>
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {sortedNeeds.map((need, key) => {
            const needTag = getTag(need.tagName);
            const translatedNeed =
              // @ts-ignore
              need[props.langueI18nCode] && need[props.langueI18nCode].text
                ? //@ts-ignore
                  need[props.langueI18nCode].text
                : "";
            if (!needTag) return;
            return (
              <tr key={key} onClick={() => onNeedClick(need)}>
                <td className="align-middle" style={{ width: 300 }}>
                  {need.fr.text}
                </td>
                <td className="align-middle">
                  <div style={{ marginLeft: -4, width: 130 }}>
                    <TagButton
                      name={jsUcfirst(needTag.short) || ""}
                      isSelected={true}
                      color={needTag.darkColor}
                    />
                  </div>
                </td>
                <td className="align-middle">{translatedNeed}</td>
                <td className="align-middle" style={{ width: 120 }}>
                  <StatusContainer backgroundColor={need.statusColor}>
                    {need.statusText}
                  </StatusContainer>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <FButton
          type="tuto"
          name={"play-circle-outline"}
          onClick={toggleTutorielModal}
        >
          Tutoriel
        </FButton>
        <FButton
          className="mr-8"
          type="white"
          name="arrow-back-outline"
          onClick={props.toggle}
        >
          Retour
        </FButton>
      </div>
      <TutorialTranslationModal
        show={showTutorielModal}
        toggle={toggleTutorielModal}
      />
    </Modal>
  );
};
