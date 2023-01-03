import React, { useState, useEffect } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
import { colors } from "colors";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import FSearchBtn from "components/UI/FSearchBtn/FSearchBtn";
import FButton from "components/UI/FButton/FButton";
import API from "utils/API";
import { cls } from "lib/classname";
import styles from "./TagsModal.module.scss";
import checkStyles from "scss/components/checkbox.module.scss";
import { Theme, User } from "types/interface";
import { ObjectId } from "mongodb";
import ThemeIcon from "components/UI/ThemeIcon";

const Step = ({ ...props }) => {
  return (
    <div className={styles.sphere} style={{ backgroundColor: props.done ? "#4caf50" : "#212121" }}>
      <p className={styles.title} style={{ color: "white" }}>
        {props.children}
      </p>
    </div>
  );
};

interface SubProps {
  title: string;
  subtitle: string;
  step: string;
  done: boolean;
}
const StyledSub = (props: SubProps) => {
  return (
    <div className={styles.sub}>
      <Step done={props.done}>{props.step}</Step>
      <div>
        <p className={styles.title}>{props.title}</p>
        <p className={styles.subtitle}>{props.subtitle}</p>
      </div>
    </div>
  );
};

interface Props {
  show: boolean;
  toggle: () => void;
  theme: Theme | undefined;
  secondaryThemes: Theme[];
  validate: (theme: Theme | null, secondaryThemes: Theme[]) => void;
  allThemes: Theme[];
  toggleTutorielModal: any;
  user: User | null;
  dispositifId: string;
}

const DispositifValidateModal = (props: Props) => {
  const [theme1, setTheme1] = useState<Theme | null>(null);
  const [theme2, setTheme2] = useState<Theme | null>(null);
  const [theme3, setTheme3] = useState<Theme | null>(null);
  const [noTheme, setNoTheme] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (props.theme) setTheme1(props.theme);
    if (props.secondaryThemes.length > 0) {
      if (props.secondaryThemes[0]) setTheme2(props.secondaryThemes[0]);
      if (props.secondaryThemes[1]) setTheme3(props.secondaryThemes[1]);
      if (!props.secondaryThemes[0] && !props.secondaryThemes[1]) setNoTheme(true);
    }
    return () => {
      setTheme1(null);
      setTheme2(null);
      setTheme3(null);
      setNoTheme(false);
    };
  }, [props.theme, props.secondaryThemes]);

  const selectTheme1 = (theme: Theme) => {
    if (theme1 && theme1._id === theme._id) {
      setTheme1(null);
    } else {
      setTheme1(theme);
    }

    if (theme2 && theme._id === theme2._id) setTheme2(null);
    if (theme3 && theme._id === theme3._id) setTheme3(null);
    //props.selectParam(props.keyValue, subi);
    //this.toggle();
  };

  const selectTheme2 = (theme: Theme) => {
    if (theme2 && theme._id === theme2._id) {
      setTheme2(null);
    } else if (theme3 && theme._id === theme3._id) {
      setTheme3(null);
    } else if ((theme2 && theme3) || (theme2 && !theme3)) {
      setTheme3(theme);
      setNoTheme(false);
    } else if (!theme2 && !theme3) {
      setTheme2(theme);
      setNoTheme(false);
    } else if (!theme2 && theme3) {
      setTheme2(theme);
      setNoTheme(false);
    }
    //this.props.selectParam(this.props.keyValue, subi);
    //this.toggle();
  };

  const handleCheckboxChange = (e: any) => {
    e.stopPropagation();
    setNoTheme(!noTheme);
    setTheme2(null);
    setTheme3(null);
  };

  const validateAndClose = () => {
    const secondaryThemes = [];
    if (theme2) secondaryThemes.push(theme2);
    if (theme3) secondaryThemes.push(theme3);
    props.validate(theme1, secondaryThemes);
    props.toggle();
  };

  const validateThemes = () => {
    const secondaryThemes: ObjectId[] = [];
    if (theme2) secondaryThemes.push(theme2._id);
    if (theme3) secondaryThemes.push(theme3._id);

    API.updateDispositifTagsOrNeeds({
      query: {
        dispositifId: props.dispositifId,
        ...(theme1 ? { theme: theme1._id } : {}),
        secondaryThemes
      }
    });
    validateAndClose();

    Swal.fire({
      title: "Attention!",
      text: "Les nouveaux thèmes sont enregistrés. Attention à ne pas valider la fiche sinon toutes les traductions vont tomber !",
      icon: "warning",
      preConfirm: () => {
        router.push("/backend/admin");
      }
    });
  };

  const isAdmin = props.user
    ? (props.user?.roles || []).find((element: any) => element.nom === "Admin")
      ? true
      : false
    : false;

  return (
    <Modal isOpen={props.show} toggle={props.toggle} className={styles.modal} contentClassName={styles.modal_content}>
      <ModalHeader toggle={props.toggle} className={styles.modal_header}>
        Choix des thèmes
      </ModalHeader>
      <ModalBody className={styles.modal_body}>
        <StyledSub
          title={"Choisissez le thème principal de votre fiche"}
          subtitle={"Ce thème catégorise votre fiche pour le moteur de recherche"}
          step={"1"}
          done={theme1 ? true : false}
        />
        {props.allThemes.map((theme, idx) => {
          return (
            <FSearchBtn
              key={idx}
              onClick={() => selectTheme1(theme)}
              className={
                !theme1
                  ? "d-inline-block me-2 mt-2"
                  : theme1._id === theme._id
                  ? "d-inline-block me-2 mt-2"
                  : "d-inline-block me-2 mt-2"
              }
              color={theme1 && theme1._id === theme._id ? theme.colors.color100 : "gray"}
              withMargins
              smallFont
            >
              <span className={styles.inner_btn}>
                {theme.icon ? (
                  <div className={styles.icon}>
                    <ThemeIcon theme={theme} />
                  </div>
                ) : null}
                {theme.short.fr}
                {theme1 && theme1._id === theme._id ? (
                  <EVAIcon onClick={() => {}} name="close-outline" fill={"white"} className="sort-btn ms-2" />
                ) : null}
              </span>
            </FSearchBtn>
          );
        })}
        <StyledSub
          title={"Choisissez jusqu’à deux thèmes supplémentaires"}
          subtitle={"Ces thèmes secondaires permettent de compléter le référencement"}
          step={"2"}
          done={theme2 || theme3 || noTheme ? true : false}
        />
        {props.allThemes.map((theme, idx) => {
          return (
            <FSearchBtn
              key={idx}
              onClick={() => (theme1 && theme._id === theme1._id ? null : selectTheme2(theme))}
              color={
                theme1 && theme._id === theme1._id
                  ? "gray"
                  : (theme2 && theme2._id === theme._id) ||
                    (theme3 && theme3._id === theme._id) ||
                    (!theme2 && theme3) ||
                    (theme2 && !theme3) ||
                    (!theme2 && !theme3 && !noTheme)
                  ? theme.colors.color100
                  : "gray"
              }
              lighter={
                theme1 && theme._id === theme1._id
                  ? false
                  : (!noTheme && !theme3 && !theme2) ||
                    (!theme3 && theme2 && theme2._id !== theme._id) ||
                    (theme3 && !theme2 && theme3._id !== theme._id)
                  ? true
                  : false
              }
              className="d-inline-block"
              withMargins
              smallFont
            >
              <span className={styles.inner_btn}>
                {theme.icon ? (
                  <div className={styles.icon}>
                    <ThemeIcon theme={theme} />
                  </div>
                ) : null}
                {theme.short.fr}
                {(theme2 && theme2._id === theme._id) || (theme3 && theme3._id === theme._id) ? (
                  <EVAIcon onClick={() => {}} name="close-outline" fill={"white"} className="sort-btn ms-2" />
                ) : null}
              </span>
            </FSearchBtn>
          );
        })}
        <div className={cls(styles.no_tag, noTheme && styles.enabled)}>
          <label className={checkStyles.checkbox}>
            <input onChange={handleCheckboxChange} type="checkbox" checked={noTheme} />
            <span className={cls(checkStyles.checkmark, styles.checkmark)}></span>
            <p className={styles.label}>Je ne souhaite pas ajouter de thèmes supplémentaires</p>
          </label>
        </div>
      </ModalBody>
      <ModalFooter className={styles.modal_footer}>
        <div style={{ justifyContent: "flex-start", display: "flex" }}>
          {isAdmin ? (
            <FButton
              className="footer-btn"
              type="dark"
              name="shield-outline"
              disabled={!theme1 || (theme1 && !theme2 && !theme3 && !noTheme)}
              fill={colors.gray90}
              onClick={validateThemes}
            >
              {"Valider seulement les thèmes"}
            </FButton>
          ) : (
            <>
              <FButton
                tag={"a"}
                href="https://help.refugies.info/fr/"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-btn"
                type="help"
                name="question-mark-circle-outline"
                fill={colors.gray90}
              >
                {"Centre d'aide"}
              </FButton>
              <FButton
                type="tuto"
                name={"play-circle-outline"}
                className="ms-2"
                onClick={() => props.toggleTutorielModal("Tags")}
              >
                Tutoriel
              </FButton>
            </>
          )}
        </div>

        <div style={{ justifyContent: "flex-end", display: "flex" }}>
          <FButton type="outline-black" name="arrow-back" fill={colors.gray90} className="me-2" onClick={props.toggle}>
            Retour
          </FButton>
          <FButton
            name="checkmark"
            type="validate"
            onClick={validateAndClose}
            disabled={!theme1 || (theme1 && !theme2 && !theme3 && !noTheme)}
          >
            Valider
          </FButton>
        </div>
      </ModalFooter>
    </Modal>
  );
};

export default DispositifValidateModal;
