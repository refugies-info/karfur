//@ts-nocheck TODO: delete
import React from "react";
import { Button } from "reactstrap";
import FSearchBtn from "components/UI/FSearchBtn/FSearchBtn";
import FButton from "components/UI/FButton/FButton";
import Streamline from "assets/streamline";
import styles from "./Tags.module.scss";
import { useTranslation } from "next-i18next";
import { cls } from "lib/classname";
import { Theme } from "types/interface";
import { useRouter } from "next/router";
import { getThemeName } from "lib/getThemeName";
import ThemeIcon from "components/UI/ThemeIcon";

interface Props {
  theme: Theme | undefined;
  secondaryThemes: Theme[];
  disableEdit: boolean;
  openTag: () => void;
  toggleTutorielModal: (arg: string) => void;
  displayTuto: boolean;
  updateUIArray: (arg: number) => void;
  isRTL: boolean;
  typeContenu: "dispositif" | "demarche";
}

const Tags = (props: Props) => {
  const { t } = useTranslation();
  const router = useRouter();
  const allThemes: Theme[] = [];
  if (props.theme) allThemes.push(props.theme);
  if (props.secondaryThemes.length) allThemes.push(...props.secondaryThemes);

  return (
    <div className={styles.tags}>
      {allThemes.map((theme: Theme, key: number) => {
        if (theme) {
          return (
            <div key={key}>
              <FSearchBtn
                className="me-2 color"
                color={theme.colors.color100}
                noHover
                onMouseEnter={() => props.updateUIArray(-6)}
              >
                <div className={styles.btn_container}>
                  <div className={cls(styles.icon_container, props.isRTL && styles.rtl)}>
                    <ThemeIcon theme={theme} size={20} />
                  </div>
                  {getThemeName(theme, router.locale, "short")}
                </div>
              </FSearchBtn>
            </div>
          );
        }
        return null;
      })}

      {/* Edition mode */}
      {!props.disableEdit && allThemes.length > 0 ? (
        <Button
          className={cls(styles.plus_btn, styles.icon, "ms-2")}
          onClick={props.openTag}
          onMouseEnter={() => props.updateUIArray(-6)}
        >
          <Streamline name={"tag"} width={26} height={26} />
        </Button>
      ) : !props.disableEdit && allThemes.length < 1 ? (
        <Button
          className={styles.plus_btn + " ms-2"}
          onClick={props.openTag}
          onMouseEnter={() => props.updateUIArray(-6)}
        >
          <Streamline name={"tag"} width={22} height={22} />
          {"Choisir les thèmes"}
        </Button>
      ) : null}
      {!props.disableEdit && props.displayTuto && props.typeContenu === "dispositif" && (
        <div style={{ marginLeft: 8 }} onMouseEnter={() => props.updateUIArray(-6)}>
          <FButton type="tuto" name={"play-circle-outline"} onClick={() => props.toggleTutorielModal("Tags")} />
        </div>
      )}
    </div>
  );
};

export default Tags;
