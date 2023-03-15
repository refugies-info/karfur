import React, { useCallback, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useFormContext } from "react-hook-form";
import { GetDispositifResponse, Id } from "api-types";
import { themesSelector } from "services/Themes/themes.selectors";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import BaseModal from "../BaseModal";
import { SimpleFooter } from "../components";
import ThemeSelectButton from "./ThemeSelectButton";
import styles from "./ModalThemes.module.scss";

interface Props {
  show: boolean;
  toggle: () => void;
}

const help = {
  title: "À quoi servent les thèmes ?",
  content: (
    <>
      <p>Votre fiche sera « rangée » dans les thèmes que vous choisissez.</p>
      <p>Un usager pourra ainsi facilement trouver votre fiche lorsqu’il explorera ces thèmes.</p>
    </>
  ),
};

const MAX_SECONDARY_THEMES = 2;

const ModalThemes = (props: Props) => {
  const formContext = useFormContext();
  const themes = useSelector(themesSelector);
  const [mainTheme, setMainTheme] = useState<Id | null>(null);
  const [secondaryThemes, setSecondaryThemes] = useState<Id[]>([]);

  const selectTheme = useCallback(
    (id: Id) => {
      // remove main theme = unselect all
      if (id === mainTheme) {
        setMainTheme(null);
        setSecondaryThemes([]);
        return;
      }
      // remove secondary theme
      if (secondaryThemes.includes(id)) {
        setSecondaryThemes((themes) => themes.filter((t) => t !== id));
        return;
      }
      // no main theme, select it
      if (!mainTheme) {
        setMainTheme(id);
        return;
      }
      // add to secondary theme if possible
      if (secondaryThemes.length < MAX_SECONDARY_THEMES) {
        setSecondaryThemes((themes) => [...themes, id]);
        return;
      }
    },
    [mainTheme, secondaryThemes],
  );

  const maxSelected = useMemo(
    () => !!mainTheme && secondaryThemes.length === MAX_SECONDARY_THEMES,
    [mainTheme, secondaryThemes],
  );

  const validate = () => {
    const newTheme: GetDispositifResponse["theme"] = mainTheme || undefined;
    const newSecondaryThemes: GetDispositifResponse["secondaryThemes"] = secondaryThemes;
    if (newTheme) {
      formContext.setValue("theme", newTheme);
      formContext.setValue("secondaryThemes", newSecondaryThemes);
    }
    props.toggle();
  };

  return (
    <BaseModal
      show={props.show}
      toggle={props.toggle}
      help={help}
      title={
        <>
          <EVAIcon name="color-palette-outline" size={32} fill="dark" className="me-2" />
          Choix des thèmes de votre action
        </>
      }
    >
      <div>
        <p className="mb-6">Choisissez un thème principal et jusqu’à deux thèmes secondaires :</p>
        {themes.map((theme, i) => {
          const isSelectedPrimary = mainTheme === theme._id;
          const isSelected = secondaryThemes.includes(theme._id);
          return (
            <ThemeSelectButton
              key={i}
              theme={theme}
              selectedPrimary={isSelectedPrimary}
              selected={isSelected}
              disabled={!isSelectedPrimary && !isSelected && maxSelected}
              onClick={() => selectTheme(theme._id)}
            />
          );
        })}
        <SimpleFooter onValidate={validate} />
      </div>
    </BaseModal>
  );
};

export default ModalThemes;
