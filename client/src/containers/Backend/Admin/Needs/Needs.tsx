import React, { useEffect, useState } from "react";
import { ObjectId } from "mongodb";
import { Col, Row, Container } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { isLoadingSelector } from "services/LoadingStatus/loadingStatus.selectors";
import { LoadingStatusKey } from "services/LoadingStatus/loadingStatus.actions";
import { needsSelector } from "services/Needs/needs.selectors";
import { allThemesSelector } from "services/Themes/themes.selectors";
import { allDispositifsSelector } from "services/AllDispositifs/allDispositifs.selector";
import AdminThemeButton from "components/UI/AdminThemeButton";
import AdminNeedButton from "components/UI/AdminNeedButton";
import { NeedFormModal } from "./NeedFormModal";
import { LoadingNeeds } from "./LoadingNeeds";
import styles from "./Needs.module.scss";
import { cls } from "lib/classname";
import FButton from "components/UI/FButton";
import { ThemeFormModal } from "./ThemeFormModal";
import { NeedsChoiceModal } from "../AdminContenu/NeedsChoiceModal/NeedsChoiceModal";
import { SmallDispositif } from "../sharedComponents/SmallDispositif";
import { getDispositifsWithAllInformationRequired } from "../AdminStructures/StructureDetailsModal/functions";
import { ReactSortable } from "react-sortablejs";
import { orderNeedsActionCreator } from "services/Needs/needs.actions";
import isInBrowser from "lib/isInBrowser";
import {
  SearchBarContainer,
  StyledHeader,
  StyledHeaderInner,
  StyledSort,
  StyledTitle
} from "../sharedComponents/StyledAdmin";
import { GetNeedResponse, GetThemeResponse, Id } from "api-types";

let NotificationContainer: any = null;
let NotificationManager: any = null;
if (isInBrowser()) {
  const ReactNotifications = require("react-notifications/dist/react-notifications.js");
  NotificationContainer = ReactNotifications.NotificationContainer;
  NotificationManager = ReactNotifications.NotificationManager;
}

type ItemType = {
  id: string;
} & GetNeedResponse;

export const Needs = () => {
  const [selectedNeed, setSelectedNeed] = useState<null | GetNeedResponse>(null);
  const [showNeedFormModal, setShowNeedFormModal] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<null | GetThemeResponse>(null);
  const [showThemeFormModal, setShowThemeFormModal] = useState(false);
  const allNeeds = useSelector(needsSelector);
  const themes = useSelector(allThemesSelector).sort((a, b) => (a.position < b.position ? -1 : 1));
  const dispositifs = useSelector(allDispositifsSelector);

  const [currentTheme, setCurrentTheme] = useState<Id | null>(null);
  const [currentNeed, setCurrentNeed] = useState<Id | null>(null);

  const [selectedDispositifModal, setSelectedDispositifModal] = useState<Id | null>(null);

  const [displayedNeeds, setDisplayedNeeds] = useState<ItemType[]>([]);
  const [positionsToSave, setPositionsToSave] = useState(false);

  const dispatch = useDispatch();

  const editNeed = (need: GetNeedResponse) => {
    setSelectedNeed(need);
    setShowNeedFormModal(true);
  };
  const addNeed = () => {
    setSelectedNeed(null);
    setShowNeedFormModal(true);
  };
  const editTheme = (theme: GetThemeResponse) => {
    setSelectedTheme(theme);
    setShowThemeFormModal(true);
  };
  const addTheme = () => {
    setSelectedTheme(null);
    setShowThemeFormModal(true);
  };

  const isLoadingFetchThemes = useSelector(isLoadingSelector(LoadingStatusKey.FETCH_THEMES));
  const isLoadingFetchNeeds = useSelector(isLoadingSelector(LoadingStatusKey.FETCH_NEEDS));

  const isLoading = isLoadingFetchThemes || isLoadingFetchNeeds;

  useEffect(() => {
    const newNeeds: ItemType[] = [
      ...allNeeds
        .filter((need) => currentTheme && need.theme._id === currentTheme)
        .map((need) => ({ id: need._id.toString(), ...need }))
        .sort((a, b) => {
          if (a.position !== undefined && b.position !== undefined) {
            return a.position < b.position ? -1 : 1;
          }
          return 0;
        })
    ];
    setDisplayedNeeds(newNeeds);
  }, [currentTheme, allNeeds]);

  const updatePositions = () => setPositionsToSave(true);

  useEffect(() => {
    if (positionsToSave) {
      dispatch(orderNeedsActionCreator({ orderedNeedIds: displayedNeeds.map((n) => n._id.toString()) }));
      setPositionsToSave(false);
      NotificationManager.success("L'ordre des besoins a été enregistré", "Enregistré !", 5000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayedNeeds]);

  if (isLoading) {
    return <LoadingNeeds />;
  }

  const dispositifsIds = dispositifs
    .filter((disp) => currentNeed && disp.needs?.includes(currentNeed))
    .map((d) => d._id);
  const dispositifsToDisplay = getDispositifsWithAllInformationRequired(dispositifsIds || [], dispositifs, themes);

  return (
    <Container fluid>
      <StyledHeader>
        <StyledHeaderInner>
          <StyledTitle>Catégories</StyledTitle>
        </StyledHeaderInner>
        <StyledSort>
          <FButton type="dark" name="plus-circle-outline" onClick={addTheme} className="me-2">
            Ajouter un thème
          </FButton>
          <FButton type="dark" name="plus-circle-outline" onClick={addNeed}>
            Ajouter un besoin
          </FButton>
        </StyledSort>
      </StyledHeader>
      <Row className="mt-4 mb-5">
        <Col md="auto">
          <h3 className={styles.subtitle}>
            Thèmes
            <span className={styles.badge}>{themes.length}</span>
          </h3>
          <div className={cls(styles.column, styles.scroll_column, styles.themes)}>
            {themes.map((theme, i) => (
              <div key={i} className="mb-2">
                <AdminThemeButton
                  theme={theme}
                  onPress={() => {
                    setCurrentTheme(theme._id);
                    setCurrentNeed(null);
                  }}
                  onSelectTheme={() => {}}
                  opened={currentTheme === theme._id}
                  selected={false}
                  editButton={true}
                  onClickEdit={() => editTheme(theme)}
                />
              </div>
            ))}
          </div>
        </Col>
        <Col>
          <h3 className={styles.subtitle}>
            Besoins
            {displayedNeeds.length > 0 && <span className={styles.badge}>{displayedNeeds.length}</span>}
          </h3>
          <div className={cls(styles.column, styles.scroll_column)}>
            {displayedNeeds.length > 0 ? (
              <>
                <ReactSortable list={displayedNeeds} setList={setDisplayedNeeds} onUpdate={updatePositions}>
                  {displayedNeeds.map((need, i) => (
                    <div key={i} className={cls("mb-2", i === 0 && "mt-1")}>
                      <AdminNeedButton
                        need={need}
                        onPress={() => {
                          setCurrentNeed(need._id);
                        }}
                        selected={false}
                        editButton={true}
                        opened={currentNeed === need._id}
                        onClickEdit={() => editNeed(need)}
                        draggable={true}
                      />
                    </div>
                  ))}
                </ReactSortable>
              </>
            ) : (
              <p className={styles.empty}>
                Sélectionne un thème
                <br /> pour voir les besoins associés
              </p>
            )}
          </div>
        </Col>
        <Col>
          <h3 className={styles.subtitle}>
            Fiches associées
            {dispositifsToDisplay.length > 0 && <span className={styles.badge}>{dispositifsToDisplay.length}</span>}
          </h3>
          <div className={cls(styles.column, styles.scroll_column)}>
            {dispositifsToDisplay.length > 0 ? (
              dispositifsToDisplay.map((disp, i) => (
                <div key={i} className={cls("mb-2", i === 0 && "mt-1")}>
                  <SmallDispositif
                    dispositif={disp}
                    onClick={() => setSelectedDispositifModal(disp._id)}
                    bgColor={true}
                  />
                </div>
              ))
            ) : (
              <p className={styles.empty}>
                Sélectionne un besoin
                <br /> pour voir les fiches associées
              </p>
            )}
          </div>
        </Col>
      </Row>

      <NeedFormModal
        show={showNeedFormModal}
        selectedNeed={selectedNeed}
        toggleModal={() => {
          setSelectedNeed(null);
          setShowNeedFormModal(!showNeedFormModal);
        }}
      />
      <ThemeFormModal
        show={showThemeFormModal}
        selectedTheme={selectedTheme}
        toggleModal={() => {
          setSelectedTheme(null);
          setShowThemeFormModal(!showThemeFormModal);
        }}
      />
      <NeedsChoiceModal
        show={!!selectedDispositifModal}
        toggleModal={() => setSelectedDispositifModal(null)}
        dispositifId={selectedDispositifModal}
      />

      {isInBrowser() && NotificationContainer !== null && <NotificationContainer />}
    </Container>
  );
};
