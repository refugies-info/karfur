import React, { useCallback, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useFormContext } from "react-hook-form";
import { CreateDispositifRequest } from "api-types";
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
  const { setValue, getValues } = useFormContext<CreateDispositifRequest>();
  const themes = useSelector(themesSelector);
  const [mainTheme, setMainTheme] = useState<string | undefined>(getValues("theme") || undefined);
  const [secondaryThemes, setSecondaryThemes] = useState<string[]>(getValues("secondaryThemes") || []);

  const selectTheme = useCallback(
    (id: string) => {
      // remove main theme = unselect all
      if (id === mainTheme) {
        setMainTheme(undefined);
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

  const remainingSelect = useMemo(
    () => 3 - (!!mainTheme ? 1 : 0) - secondaryThemes.length,
    [mainTheme, secondaryThemes],
  );

  const validate = () => {
    setValue("theme", mainTheme);
    setValue("secondaryThemes", secondaryThemes);
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
          const isSelected = secondaryThemes.includes(theme._id.toString());
          return (
            <ThemeSelectButton
              key={i}
              theme={theme}
              selectedPrimary={isSelectedPrimary}
              selected={isSelected}
              disabled={!isSelectedPrimary && !isSelected && maxSelected}
              onClick={() => selectTheme(theme._id.toString())}
            />
          );
        })}

        {remainingSelect > 0 && (
          <p className={styles.help}>
            <EVAIcon name="info" size={16} fill={styles.lightBorderPlainInfo} className="me-2" />
            {remainingSelect} thèmes restants maximum
          </p>
        )}
        <SimpleFooter onValidate={validate} />
      </div>
    </BaseModal>
  );
};

export default ModalThemes;
