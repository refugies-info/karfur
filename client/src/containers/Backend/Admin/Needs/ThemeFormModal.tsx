import React, { useEffect, useMemo, useState } from "react";
import { Picture, Theme } from "types/interface";
import FInput from "components/UI/FInput/FInput";
import FButton from "components/UI/FButton/FButton";
import { useDispatch, useSelector } from "react-redux";
import { DetailsModal } from "../sharedComponents/DetailsModal";
import { Label } from "../sharedComponents/SubComponents";
import styles from "./ThemeFormModal.module.scss";
import { Col, Input, Row } from "reactstrap";
import ImageInput from "components/UI/ImageInput";
import Swal from "sweetalert2";
import { colors as themeColors } from "colors";
import { createThemeActionCreator, deleteThemeActionCreator, saveThemeActionCreator } from "services/Themes/themes.actions";
import { needsSelector } from "services/Needs/needs.selectors";
import { cls } from "lib/classname";
import { LangueDetail } from "../AdminUsers/ components/AdminUsersComponents";
import { allLanguesSelector } from "services/Langue/langue.selectors";

interface Props {
  show: boolean;
  toggleModal: () => void;
  selectedTheme: Theme | null; // if null, creation. Else, edition
}

const EMPTY_COLORS: Theme["colors"] = {
  color100: "#000000",
  color80: "#000000",
  color60: "#000000",
  color40: "#000000",
  color30: "#000000",
}

type colorKey = "color100" | "color80" | "color60" | "color40" | "color30";
const COLOR_KEYS: colorKey[] = ["color100", "color80", "color60", "color40", "color30"];

export const ThemeFormModal = (props: Props) => {
  const [short, setShort] = useState(props.selectedTheme?.short.fr || "");
  const [name, setName] = useState(props.selectedTheme?.name.fr || "");
  const [emoji, setEmoji] = useState(props.selectedTheme?.notificationEmoji || "");
  const [colors, setColors] = useState<Theme["colors"]>(props.selectedTheme?.colors || EMPTY_COLORS);
  const [notes, setNotes] = useState("");
  const [banner, setBanner] = useState<Picture|undefined>(props.selectedTheme?.banner || undefined);
  const [appImage, setAppImage] = useState<Picture|undefined>(props.selectedTheme?.appImage || undefined);
  const [shareImage, setShareImage] = useState<Picture|undefined>(props.selectedTheme?.shareImage || undefined);
  const [icon, setIcon] = useState<Picture|undefined>(props.selectedTheme?.icon || undefined);

  const needs = useSelector(needsSelector);
  const languages = useSelector(allLanguesSelector);
  const dispatch = useDispatch();

  const hasNeeds = useMemo(() => {
    if (!props.selectedTheme) return false;
    return needs.filter(need =>
      props.selectedTheme ? need.theme._id === props.selectedTheme._id : false
    ).length > 0
  }, [props.selectedTheme, needs]);

  useEffect(() => {
    if (props.selectedTheme) {
      setShort(props.selectedTheme.short.fr);
      setName(props.selectedTheme.name.fr);
      setEmoji(props.selectedTheme.notificationEmoji);
      setColors(props.selectedTheme.colors);
      setNotes(props.selectedTheme.adminComments);
      setBanner(props.selectedTheme.banner);
      setAppImage(props.selectedTheme.appImage);
      setShareImage(props.selectedTheme.shareImage);
      setIcon(props.selectedTheme.icon);
    } else {
      setShort("");
      setName("");
      setEmoji("");
      setColors(EMPTY_COLORS);
      setNotes("");
      setBanner(undefined);
      setAppImage(undefined);
      setShareImage(undefined);
      setIcon(undefined);
    }
  }, [props.selectedTheme]);

  const onSave = () => {
    const theme: Partial<Theme> = {
      short: { fr: short },
      name: { fr: name },
      notificationEmoji: emoji,
      colors,
      banner,
      appImage,
      shareImage,
      icon,
    }
    if (props.selectedTheme) { // edition
      dispatch(
        saveThemeActionCreator({
          _id: props.selectedTheme._id,
          ...theme,
          adminComments: notes
        })
      );
    } else { // creation
      dispatch(createThemeActionCreator(theme));
    }
    props.toggleModal();
  };

  const onDelete = () => {
    if (props.selectedTheme) {
      Swal.fire({
        title: "Êtes-vous sûr ?",
        text: "Voulez-vous supprimer ce thème ?",
        type: "question",
        showCancelButton: true,
        confirmButtonColor: themeColors.rouge,
        cancelButtonColor: themeColors.vert,
        confirmButtonText: "Oui, le supprimer",
        cancelButtonText: "Annuler",
      }).then(res => {
        if (res.value && props.selectedTheme) {
          dispatch(deleteThemeActionCreator(props.selectedTheme._id));
        }
      })
    }
    props.toggleModal();
  };

  const isInvalid = false//[...emoji].length !== 1;

  return (
    <DetailsModal
      show={props.show}
      toggleModal={props.toggleModal}
      isLoading={false}
      leftHead={
        <>
          <h2>{props.selectedTheme ? "Modifier le thème" : "Ajouter un nouveau thème"}</h2>
        </>
      }
      rightHead={
        <>
          {props.selectedTheme &&
            <FButton
              className="mr-2"
              type="error"
              name="trash-2-outline"
              onClick={onDelete}
              disabled={hasNeeds}
            >
              Supprimer
            </FButton>
          }
          <FButton className="mr-2" type="white" name="close-outline" onClick={props.toggleModal}>
            Annuler
          </FButton>
          <FButton
            type="validate"
            name="save-outline"
            onClick={onSave}
            disabled={isInvalid}
          >
            Valider
          </FButton>
        </>
      }
    >
      <Row className="mt-4">
        <Col md="5">
          <div>
              <Label htmlFor="short">Intitulé court du thème</Label>
            <FInput
              id="short"
              value={short}
              onChange={(e: any) => setShort(e.target.value)}
              newSize={true}
              autoFocus={false}
              placeholder="Écrire ici..."
            />
          </div>
          <div>
            <Label htmlFor="name">Intitulé long du thème</Label>
            <FInput
              id="name"
              value={name}
              onChange={(e: any) => setName(e.target.value)}
              newSize={true}
              autoFocus={false}
              placeholder="Écrire ici..."
            />
          </div>
          <div>
            <Label htmlFor="theme">Traduire les intitulés</Label>
            <div>
            {languages.map((langue) => (
              <LangueDetail key={langue.langueCode} langue={langue} />
            ))}
            </div>
          </div>
          <div>
            <Label htmlFor="emoji">Emoji pour les notifications</Label>
            <FInput
              id="emoji"
              value={emoji}
              onChange={(e: any) => setEmoji(e.target.value)}
              newSize={true}
              autoFocus={false}
              placeholder="Ajouter ici l'émoji"
            />
          </div>
          <div>
            <Label htmlFor="colors">Couleurs principales du thème</Label>
            <div className={styles.colors}>
              {COLOR_KEYS.map((i: colorKey) => (
              <div key={i}>
                <Input
                    type="text"
                    className={styles.color_input}
                  value={colors[i]}
                    onChange={(e: any) => setColors({ ...colors, [i]: e.target.value as string })}
                    style={{backgroundColor:colors[i]}}
                />
              </div>
              ))}
            </div>
          </div>
        </Col>

        <Col>
          <div className={cls(styles.notes_col, "mb-2")}>
            <Label htmlFor="notes">Notes à propos du thème</Label>
            <FInput
              className={styles.notes_input_group}
              inputClassName={styles.notes_input}
              id="notes"
              type="textarea"
              value={notes}
              onChange={(e: any) => setNotes(e.target.value)}
              newSize={true}
              autoFocus={false}
              placeholder="Notes..."
            />
          </div>

        </Col>

        <Col md="4">
          <div className="mb-2">
            <Label>Bannière principale du thème</Label>
            <ImageInput
              image={banner}
              onImageUploaded={(e) => {
                setBanner(e);
              }}
              minHeight={90}
              imageSize={80}
              labelNoBackground={true}
              dimensionsHelp="1440x500px"
            />
          </div>
          <div className="mb-2">
            <Label>Illustration mobile du thème</Label>
            <ImageInput
              image={appImage}
              onImageUploaded={(e) => {
                setAppImage(e);
              }}
              minHeight={90}
              imageSize={80}
              labelNoBackground={true}
              dimensionsHelp="360x280px"
            />
          </div>
          <div className="mb-2">
            <Label>Gabarit pour le partage</Label>
            <ImageInput
              image={shareImage}
              onImageUploaded={(e) => {
                setShareImage(e);
              }}
              minHeight={90}
              imageSize={80}
              labelNoBackground={true}
              dimensionsHelp="1200x628px"
            />
          </div>
          <div className="mb-2">
            <Label>Icône du thème</Label>
            <ImageInput
              image={icon}
              onImageUploaded={(e) => {
                setIcon(e);
              }}
              minHeight={90}
              imageSize={80}
              labelNoBackground={true}
              dimensionsHelp="20x20px"
            />
          </div>

        </Col>
      </Row>
    </DetailsModal>
  );
};
