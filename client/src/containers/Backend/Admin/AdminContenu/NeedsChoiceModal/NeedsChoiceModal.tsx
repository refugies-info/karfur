import React, { useState, useEffect } from "react";
import { Col, Row } from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import { isLoadingSelector } from "services/LoadingStatus/loadingStatus.selectors";
import { LoadingStatusKey } from "services/LoadingStatus/loadingStatus.actions";
import FButton from "components/UI/FButton/FButton";
import { dispositifSelector } from "services/AllDispositifs/allDispositifs.selector";
import { needsSelector } from "services/Needs/needs.selectors";
import API from "utils/API";
import { fetchAllDispositifsActionsCreator } from "services/AllDispositifs/allDispositifs.actions";
import styles from "./NeedsChoiceModal.module.scss";
import { DetailsModal } from "../../sharedComponents/DetailsModal";
import { themesSelector } from "services/Themes/themes.selectors";
import AdminThemeButton from "components/UI/AdminThemeButton";
import AdminNeedButton from "components/UI/AdminNeedButton";
import { cls } from "lib/classname";
import { DispositifThemeNeedsRequest, GetAllDispositifsResponse, GetNeedResponse, Id } from "api-types";

interface Props {
  show: boolean;
  toggleModal: () => void;
  dispositifId: Id | null;
}

const getThemes = (dispositif: GetAllDispositifsResponse | null): Id[] => {
  if (!dispositif) return [];
  const res = [];
  if (dispositif.theme) res.push(dispositif.theme);
  if (dispositif.secondaryThemes) res.push(...dispositif.secondaryThemes);
  return res;
};

const getNeed = (needId: Id, allNeeds: GetNeedResponse[]) => {
  return allNeeds.find((n) => n._id === needId);
};

export const NeedsChoiceModal = (props: Props) => {
  const dispatch = useDispatch();
  const isLoading = useSelector(isLoadingSelector(LoadingStatusKey.FETCH_ALL_DISPOSITIFS));
  const allNeeds = useSelector(needsSelector);
  const themes = useSelector(themesSelector);
  const dispositif = useSelector(dispositifSelector(props.dispositifId));

  const [selectedThemesByAuthor, setSelectedThemesByAuthor] = useState<Id[] | null>(
    dispositif?.themesSelectedByAuthor ? getThemes(dispositif) : null,
  );
  const [selectedNeeds, setSelectedNeeds] = useState<Id[]>(dispositif?.needs || []);
  const [selectedThemes, setSelectedThemes] = useState<Id[]>(getThemes(dispositif));
  const [primaryTheme, setPrimaryTheme] = useState<Id | undefined>(dispositif?.theme);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const [currentTheme, setCurrentTheme] = useState<Id | null>(null);

  useEffect(() => {
    // load initial data
    if (dispositif) {
      if (dispositif.needs && dispositif.needs.length > 0) {
        setSelectedNeeds(dispositif.needs);
      }
      setPrimaryTheme(dispositif.theme);
      setSelectedThemes(getThemes(dispositif));
    }
  }, [dispositif]);

  const addTheme = (needId: Id) => {
    // add theme based on need
    const needTheme = getNeed(needId, allNeeds)?.theme._id;
    if (needTheme) {
      setSelectedThemes((themes) => [...new Set([...themes, needTheme])]);
    }
  };
  const removeTheme = (needId: Id, newNeeds: Id[]) => {
    // remove theme based on need
    const needTheme = getNeed(needId, allNeeds)?.theme._id;
    const stillHasTheme = newNeeds.find((currentNeedId) => {
      const currentNeedTheme = getNeed(currentNeedId, allNeeds)?.theme._id;
      return currentNeedTheme === needTheme;
    });
    if (needTheme && !stillHasTheme) {
      setSelectedThemes((themes) => themes.filter((t) => t !== needTheme));
    }
  };

  const selectNeed = (needId: Id) => {
    if (selectedNeeds.includes(needId)) {
      // remove need
      setSelectedNeeds((s) => {
        const newNeeds = s.filter((need) => need !== needId);
        removeTheme(needId, newNeeds);
        return newNeeds;
      });
    } else {
      // add need
      setSelectedNeeds((s) => [...s, needId]);
      addTheme(needId);
    }
  };

  const selectTheme = (themeId: Id) => {
    if (selectedThemes.includes(themeId)) {
      // remove theme
      setSelectedThemes((t) => t.filter((theme) => theme !== themeId));

      // remove needs associated to this theme
      const newNeeds = selectedNeeds.filter((needId) => {
        const need = allNeeds.find((n) => n._id === needId);
        if (!need) return false;
        return need.theme._id !== themeId;
      });
      setSelectedNeeds(newNeeds);
    } else {
      // add theme: should not be possible
    }

    // also remove from author theme if needed
    if (selectedThemesByAuthor?.includes(themeId)) {
      setSelectedThemesByAuthor((t) => (t ? t.filter((theme) => theme !== themeId) : null));
    }
  };

  useEffect(() => {
    // if theme removed from selected, remove it from primary
    if (primaryTheme && !selectedThemes.includes(primaryTheme) && !selectedThemesByAuthor?.includes(primaryTheme)) {
      setPrimaryTheme(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedThemes]);

  useEffect(() => {
    // handle errors
    const hasThemeWithoutNeed = () => {
      const allSelectedThemes = [...selectedThemes, ...(selectedThemesByAuthor || [])];
      const allSelectedNeeds = selectedNeeds.map((needId) => allNeeds.find((n) => n._id === needId));
      return allSelectedThemes.find((themeId) => {
        return !allSelectedNeeds.find((need) => need?.theme._id === themeId);
      });
    };

    const allSelectedThemes = [...new Set([...selectedThemes, ...(selectedThemesByAuthor || [])])];
    if (!primaryTheme) {
      setErrorMessage("Choisissez un thème principal avec le bouton radio.");
    } else if (allSelectedThemes.length === 0) {
      setErrorMessage("Choisissez au moins un thème en sélectionnant un besoin dans la liste");
    } else if (allSelectedThemes.length > 3) {
      setErrorMessage("Choisissez un maximum de 3 thèmes.");
    } else if (selectedNeeds.length === 0) {
      setErrorMessage("Choisissez au moins un besoin.");
    } else if (hasThemeWithoutNeed()) {
      setErrorMessage("Au moins un thème n'a pas de besoin associé.");
    } else {
      setErrorMessage("");
    }
  }, [selectedThemes, selectedNeeds, primaryTheme, selectedThemesByAuthor, allNeeds]);

  const onValidate = async () => {
    const body: DispositifThemeNeedsRequest = {
      needs: selectedNeeds.map((n) => n.toString()),
    };
    if (primaryTheme) body.theme = primaryTheme.toString();
    if (selectedThemes) {
      body.secondaryThemes = [
        ...selectedThemes.filter((t) => t !== primaryTheme),
        ...(selectedThemesByAuthor?.filter((t) => t !== primaryTheme) || []),
      ].map((t) => t.toString());
    }

    if (props.dispositifId) {
      await API.updateDispositifThemesOrNeeds(props.dispositifId, body);
      dispatch(fetchAllDispositifsActionsCreator());
    }
    props.toggleModal();
  };

  const isThemeSelected = (themeId: Id) => {
    return (
      !!selectedThemesByAuthor?.includes(themeId) || // theme selected by author
      selectedThemes.includes(themeId) // or by admin
    );
  };

  const hasThemeWarning = (themeId: Id) => {
    return (
      !!selectedThemesByAuthor?.includes(themeId) && // theme selected by author
      !selectedThemes.includes(themeId) // but not yet by admin
    );
  };

  if (dispositif) {
    return (
      <DetailsModal
        show={props.show}
        toggleModal={props.toggleModal}
        isLoading={isLoading}
        leftHead={
          <h2>
            Attribuer des besoins à la fiche :&nbsp;
            <span className="fw-normal">{dispositif.titreInformatif}</span>
          </h2>
        }
        rightHead={
          <div>
            <FButton type="white" name="close-outline" className="me-2" onClick={props.toggleModal}>
              Annuler
            </FButton>
            <FButton type="validate" name="checkmark-outline" onClick={onValidate} disabled={!!errorMessage}>
              Valider
            </FButton>
          </div>
        }
      >
        <p className="text-end text-danger mb-0 mt-1">{errorMessage}</p>
        <Row className="mt-4">
          <Col>
            <h3 className={styles.subtitle}>Thèmes</h3>
            <div className={styles.column}>
              {themes.map((theme, i) => (
                <div key={i} className="d-flex mb-2">
                  <input
                    type="radio"
                    name="theme"
                    value={theme._id.toString()}
                    className="me-2"
                    disabled={!isThemeSelected(theme._id)}
                    checked={primaryTheme === theme._id}
                    onChange={() => setPrimaryTheme(theme._id)}
                  />
                  <AdminThemeButton
                    theme={theme}
                    onPress={() => {
                      setCurrentTheme(theme._id);
                    }}
                    onSelectTheme={selectTheme}
                    opened={currentTheme === theme._id}
                    selected={isThemeSelected(theme._id)}
                    hasWarning={hasThemeWarning(theme._id)}
                  />
                </div>
              ))}
            </div>
          </Col>
          <Col style={{}}>
            <h3 className={styles.subtitle}>Besoins</h3>
            <div className={styles.column}>
              {allNeeds
                .filter((need) => currentTheme && need.theme._id === currentTheme)
                .map((need, i) => (
                  <div key={i} className={cls("mb-2", i === 0 && "mt-1")}>
                    <AdminNeedButton
                      need={need}
                      onPress={() => selectNeed(need._id)}
                      selected={selectedNeeds.includes(need._id)}
                    />
                  </div>
                ))}
            </div>
          </Col>
          <Col style={{}}>
            <h3 className={styles.subtitle}>Besoins retenus</h3>
            <div className={styles.column}>
              {allNeeds
                .filter((need) => selectedNeeds.includes(need._id))
                .map((need, i) => (
                  <div key={i} className={cls("mb-2", i === 0 && "mt-1")}>
                    <AdminNeedButton
                      need={need}
                      onPress={() => selectNeed(need._id)}
                      selected={false}
                      showCross={true}
                    />
                  </div>
                ))}
            </div>
          </Col>
        </Row>
      </DetailsModal>
    );
  }
  return <div />;
};
