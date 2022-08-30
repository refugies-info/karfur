import React, { useState } from "react";
import { ObjectId } from "mongodb";
import { Col, Row, Container } from "reactstrap";
import { useSelector } from "react-redux";
import { isLoadingSelector } from "services/LoadingStatus/loadingStatus.selectors";
import { LoadingStatusKey } from "services/LoadingStatus/loadingStatus.actions";
import { needsSelector } from "services/Needs/needs.selectors";
import { themesSelector } from "services/Themes/themes.selectors";
import { allDispositifsSelector } from "services/AllDispositifs/allDispositifs.selector";
import AdminThemeButton from "components/UI/AdminThemeButton";
import AdminNeedButton from "components/UI/AdminNeedButton";
import AdminDispositifButton from "components/UI/AdminDispositifButton";
import { Need, Theme } from "types/interface";
import { NeedFormModal } from "./NeedFormModal";
import { LoadingNeeds } from "./LoadingNeeds";
import styles from "./Needs.module.scss";
import { cls } from "lib/classname";
import FButton from "components/UI/FButton";
import { ThemeFormModal } from "./ThemeFormModal";

export const Needs = () => {
  const [selectedNeed, setSelectedNeed] = useState<null | Need>(null);
  const [showNeedFormModal, setShowNeedFormModal] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<null | Theme>(null);
  const [showThemeFormModal, setShowThemeFormModal] = useState(false);
  const allNeeds = useSelector(needsSelector);
  const themes = useSelector(themesSelector);
  const dispositifs = useSelector(allDispositifsSelector);

  const [currentTheme, setCurrentTheme] = useState<ObjectId | null>(null);
  const [currentNeed, setCurrentNeed] = useState<ObjectId | null>(null);

  const editNeed = (need: Need) => {
    setSelectedNeed(need);
    setShowNeedFormModal(true);
  };
  const addNeed = () => {
    setSelectedNeed(null);
    setShowNeedFormModal(true);
  };
  const editTheme = (theme: Theme) => {
    setSelectedTheme(theme);
    setShowThemeFormModal(true);
  };
  const addTheme = () => {
    setSelectedTheme(null);
    setShowThemeFormModal(true);
  };

  const isLoadingFetch = useSelector(isLoadingSelector(LoadingStatusKey.FETCH_NEEDS));
  const isLoadingSave = useSelector(isLoadingSelector(LoadingStatusKey.SAVE_NEED));

  const isLoading = isLoadingFetch || isLoadingSave;

  if (isLoading) {
    return <LoadingNeeds />;
  }

  const needsToDisplay = allNeeds.filter((need) => currentTheme && need.theme._id === currentTheme);
  const dispositifsToDisplay = dispositifs.filter((disp) => currentNeed && disp.needs?.includes(currentNeed));
  return (
    <Container fluid>
      <div>
        <FButton
          type="dark"
          name="plus-circle-outline"
          onClick={addTheme}
        >
          Ajouter un thème
        </FButton>
        <FButton
          type="dark"
          name="plus-circle-outline"
          onClick={addNeed}
        >
          Ajouter un besoin
        </FButton>
      </div>
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
            {needsToDisplay.length > 0 && <span className={styles.badge}>{needsToDisplay.length}</span>}
          </h3>
          <div className={cls(styles.column, styles.scroll_column)}>
            {needsToDisplay.length > 0 ? (
              needsToDisplay.map((need, i) => (
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
                  />
                </div>
              ))
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
                  <AdminDispositifButton dispositif={disp} onPress={() => {}} />
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
    </Container>
  );
};
