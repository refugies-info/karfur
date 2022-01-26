import React, { useState, useEffect } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
import Streamline from "assets/streamline";
import { colors } from "colors";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import FSearchBtn from "components/FigmaUI/FSearchBtn/FSearchBtn";
import FButton from "components/FigmaUI/FButton/FButton";
import API from "utils/API";
import styles from "./TagsModal.module.scss";

const Step = ({ ...props }) => {
  return (
    <div
      className={styles.sphere}
      style={{ backgroundColor: props.done ? "#4caf50" : "#212121" }}
    >
      <p
        className={styles.title}
        style={{color: "white"}}
      >
        {props.children}
      </p>
    </div>
  );
};

const StyledSub = ({ ...props }) => {
  return (
    <div
      className={styles.sub}
      {...props}
    >
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
  toggle: any;
  tags: any[];
  validate: any;
  categories: any[];
  toggleTutorielModal: any;
  user: any;
  dispositifId: string;
}

const DispositifValidateModal = (props: Props) => {
  const [tag1, setTag1] = useState<any>(null);
  const [tag2, setTag2] = useState<any>(null);
  const [tag3, setTag3] = useState<any>(null);
  const [noTag, setNoTag] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (props.tags.length > 0) {
      if (props.tags[0]) setTag1(props.tags[0]);
      if (props.tags[1]) setTag2(props.tags[1]);
      if (props.tags[2]) setTag3(props.tags[2]);
      if (!props.tags[1] && !props.tags[2]) setNoTag(true);
    }
  }, [props.tags]);

  const selectTag1 = (subi: any) => {
    if (tag1 && tag1.short === subi.short) {
      setTag1(null);
    } else {
      setTag1(subi);
    }

    if (tag2 && subi.short === tag2.short) setTag2(null);
    if (tag3 && subi.short === tag3.short) setTag3(null);
    //props.selectParam(props.keyValue, subi);
    //this.toggle();
  };

  const tagCheck = () => {
    if (!noTag) {
      setTag2(null);
      setTag3(null);
    }
    setNoTag(!noTag);
  };

  const selectTag2 = (subi: any) => {
    if (tag2 && subi.short === tag2.short) {
      setTag2(null);
    } else if (tag3 && subi.short === tag3.short) {
      setTag3(null);
    } else if ((tag2 && tag3) || (tag2 && !tag3)) {
      setTag3(subi);
      setNoTag(false);
    } else if (!tag2 && !tag3) {
      setTag2(subi);
      setNoTag(false);
    } else if (!tag2 && tag3) {
      setTag2(subi);
      setNoTag(false);
    }
    //this.props.selectParam(this.props.keyValue, subi);
    //this.toggle();
  };

  const handleCheckboxChange = () => {
    setNoTag(!noTag);
    setTag2(null);
    setTag3(null);
  };

  const validateAndClose = () => {
    props.validate([tag1, tag2, tag3]);
    props.toggle();
  };

  const validateThemes = () => {
    API.updateDispositifTagsOrNeeds({
      query: {
        dispositifId: props.dispositifId,
        tags: [tag1, tag2, tag3],
      },
    });
    validateAndClose();

    Swal.fire({
      title: "Attention!",
      text: "Les nouveaux thèmes sont enregistrés. Attention à ne pas valider la fiche sinon toutes les traductions vont tomber !",
      type: "warning",
      preConfirm: () => {
        router.push("/backend/admin");
      },
    });
  };

  const isAdmin = props.user
    ? props.user.roles.find((element: any) => element.nom === "Admin")
      ? true
      : false
    : false;

  return (
    <Modal
      isOpen={props.show}
      toggle={props.toggle}
      className={styles.modal}
      contentClassName={styles.modal_content}
    >
      <ModalHeader
        toggle={props.toggle}
        className={styles.modal_header}
      >
        Choix des thèmes
      </ModalHeader>
      <ModalBody className={styles.modal_body}>
        <StyledSub
          title={"Choisissez le thème principal de votre fiche"}
          subtitle={
            "Ce thème catégorise votre fiche pour le moteur de recherche"
          }
          step={"1"}
          done={tag1 ? true : false}
        />
        {props.categories.map((subi, idx) => {
          return (
            <FSearchBtn
              key={idx}
              onClick={() => selectTag1(subi)}
              className={
                !tag1
                  ? "mr-10 mt-10"
                  : tag1.short === subi.short
                  ? "mr-10 mt-10"
                  : "mr-10 mt-10 bg-dark-gris"
              }
              color={
                tag1 && tag1.short === subi.short
                  ? (subi.short || "").replace(/ /g, "-")
                  : "dark-gris"
              }
              withMargins
              smallFont
            >
              <span className={styles.inner_btn}>
                {subi.icon ? (
                  <div className={styles.icon}>
                    <Streamline
                      name={subi.icon}
                      stroke={"white"}
                      width={22}
                      height={22}
                    />
                  </div>
                ) : null}
                {subi.short}
                {tag1 && tag1.short === subi.short ? (
                  <EVAIcon
                    onClick={() => {}}
                    name="close-outline"
                    fill={"white"}
                    className="sort-btn ml-2"
                  />
                ) : null}
              </span>
            </FSearchBtn>
          );
        })}
        <StyledSub
          title={"Choisissez jusqu’à deux thèmes supplémentaires"}
          subtitle={
            "Ces thèmes secondaires permettent de compléter le référencement"
          }
          step={"2"}
          done={tag2 || tag3 || noTag ? true : false}
        />
        {props.categories.map((subi, idx) => {
          return (
            <FSearchBtn
              key={idx}
              onClick={() =>
                tag1 && subi.short === tag1.short ? null : selectTag2(subi)
              }
              color={
                tag1 && subi.short === tag1.short
                  ? "dark-gris"
                  : (tag2 && tag2.short === subi.short) ||
                    (tag3 && tag3.short === subi.short) ||
                    (!tag2 && tag3) ||
                    (tag2 && !tag3) ||
                    (!tag2 && !tag3 && !noTag)
                  ? (subi.short || "").replace(/ /g, "-")
                  : "dark-gris"
              }
              lighter={
                tag1 && subi.short === tag1.short
                  ? false
                  : (!noTag && !tag3 && !tag2) ||
                    (!tag3 && tag2 && tag2.short !== subi.short) ||
                    (tag3 && !tag2 && tag3.short !== subi.short)
                  ? true
                  : false
              }
              withMargins
              smallFont
            >
              <span className={styles.inner_btn}>
                {subi.icon ? (
                  <div className={styles.icon}>
                    <Streamline
                      name={subi.icon}
                      stroke={"white"}
                      width={22}
                      height={22}
                    />
                  </div>
                ) : null}
                {subi.short}
                {(tag2 && tag2.short === subi.short) ||
                (tag3 && tag3.short === subi.short) ? (
                  <EVAIcon
                    onClick={() => {}}
                    name="close-outline"
                    fill={"white"}
                    className="sort-btn ml-2"
                  />
                ) : null}
              </span>
            </FSearchBtn>
          );
        })}
        <div
          style={{
            backgroundColor: noTag ? "#def6c2" : "#f2f2f2",
            borderRadius: 10,
            padding: 2,
            paddingTop: 18,
            marginTop: 30,
            paddingLeft: 14,
            cursor: "pointer",
          }}
          onClick={handleCheckboxChange}
        >
          <label className={styles.checkbox}>
            <input
              onChange={handleCheckboxChange}
              type="checkbox"
              checked={noTag}
            />
            <span className={styles.checkmark}></span>
          </label>
          <p style={{ marginLeft: 30, fontSize: 14 }}>
            Je ne souhaite pas ajouter de thèmes supplémentaires
          </p>
        </div>
      </ModalBody>
      <ModalFooter className={styles.modal_footer}>
        <div style={{ justifyContent: "flex-start", display: "flex" }}>
          {isAdmin ? (
            <FButton
              className="footer-btn"
              type="dark"
              name="shield-outline"
              disabled={!tag1 || (tag1 && !tag2 && !tag3 && !noTag)}
              fill={colors.noir}
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
                fill={colors.noir}
              >
                {"Centre d'aide"}
              </FButton>
              <FButton
                type="tuto"
                name={"play-circle-outline"}
                className="ml-10"
                onClick={() => props.toggleTutorielModal("Tags")}
              >
                Tutoriel
              </FButton>
            </>
          )}
        </div>

        <div style={{ justifyContent: "flex-end", display: "flex" }}>
          <FButton
            type="outline-black"
            name="arrow-back"
            fill={colors.noir}
            className="mr-10"
            onClick={props.toggle}
          >
            Retour
          </FButton>
          <FButton
            name="checkmark"
            type="validate"
            onClick={validateAndClose}
            disabled={!tag1 || (tag1 && !tag2 && !tag3 && !noTag)}
          >
            Valider
          </FButton>
        </div>
      </ModalFooter>
    </Modal>
  );
};

export default DispositifValidateModal;
