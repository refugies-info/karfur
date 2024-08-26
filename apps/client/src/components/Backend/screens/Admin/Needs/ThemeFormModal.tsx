import FButton from "@/components/UI/FButton/FButton";
import FInput from "@/components/UI/FInput/FInput";
import ImageInput from "@/components/UI/ImageInput";
import { cls } from "@/lib/classname";
import { allLanguesSelector } from "@/services/Langue/langue.selectors";
import { needsSelector } from "@/services/Needs/needs.selectors";
import {
  createThemeActionCreator,
  deleteThemeActionCreator,
  saveThemeActionCreator,
} from "@/services/Themes/themes.actions";
import { colors as themeColors } from "@/utils/colors";
import { Picture } from "@refugies-info/api-types";
import toArray from "lodash/toArray";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Col, Input, Row } from "reactstrap";
import Swal from "sweetalert2";
import { LangueButton } from "../AdminUsers/components/AdminUsersComponents";
import { DetailsModal } from "../sharedComponents/DetailsModal";
import { Label } from "../sharedComponents/SubComponents";
import styles from "./ThemeFormModal.module.scss";
// import { isThemeTitleOk } from "./lib";
import { allThemesSelector } from "@/services/Themes/themes.selectors";
import { GetLanguagesResponse, GetThemeResponse, ThemeRequest } from "@refugies-info/api-types";

interface Props {
  show: boolean;
  toggleModal: () => void;
  selectedTheme: GetThemeResponse | null; // if null, creation. Else, edition
}

const EMPTY_COLORS: GetThemeResponse["colors"] = {
  color100: "#000000",
  color80: "#000000",
  color60: "#000000",
  color40: "#000000",
  color30: "#000000",
};

type colorKey = "color100" | "color80" | "color60" | "color40" | "color30";
const COLOR_KEYS: colorKey[] = ["color100", "color80", "color60", "color40", "color30"];

export const ThemeFormModal = (props: Props) => {
  const [short, setShort] = useState(props.selectedTheme?.short || { fr: "" });
  const [name, setName] = useState(props.selectedTheme?.name || { fr: "" });
  const [emoji, setEmoji] = useState(props.selectedTheme?.notificationEmoji || "");
  const [mainColor, setMainColor] = useState(props.selectedTheme?.mainColor || "#FFFFFF");
  const [colors, setColors] = useState<GetThemeResponse["colors"]>(props.selectedTheme?.colors || EMPTY_COLORS);
  const [notes, setNotes] = useState("");
  const [banner, setBanner] = useState<Picture | undefined>(props.selectedTheme?.banner || undefined);
  const [appBanner, setAppBanner] = useState<Picture | undefined>(props.selectedTheme?.appBanner || undefined);
  const [appImage, setAppImage] = useState<Picture | undefined>(props.selectedTheme?.appImage || undefined);
  const [shareImage, setShareImage] = useState<Picture | undefined>(props.selectedTheme?.shareImage || undefined);
  const [icon, setIcon] = useState<Picture | undefined>(props.selectedTheme?.icon || undefined);

  const [selectedLanguageModal, setSelectedLanguageModal] = useState<GetLanguagesResponse | null>(null);

  const needs = useSelector(needsSelector);
  const languages = useSelector(allLanguesSelector);
  const dispatch = useDispatch();

  const hasNeeds = useMemo(() => {
    if (!props.selectedTheme) return false;
    return (
      needs.filter((need) => (props.selectedTheme ? need.theme._id === props.selectedTheme._id : false)).length > 0
    );
  }, [props.selectedTheme, needs]);

  useEffect(() => {
    if (props.selectedTheme) {
      setShort(props.selectedTheme.short);
      setName(props.selectedTheme.name);
      setEmoji(props.selectedTheme.notificationEmoji);
      setColors(props.selectedTheme.colors);
      setNotes(props.selectedTheme.adminComments || "");
      setBanner(props.selectedTheme.banner);
      setAppBanner(props.selectedTheme.appBanner);
      setAppImage(props.selectedTheme.appImage);
      setShareImage(props.selectedTheme.shareImage);
      setIcon(props.selectedTheme.icon);
    } else {
      setShort({ fr: "" });
      setName({ fr: "" });
      setEmoji("");
      setColors(EMPTY_COLORS);
      setNotes("");
      setBanner(undefined);
      setAppBanner(undefined);
      setAppImage(undefined);
      setShareImage(undefined);
      setIcon(undefined);
    }
  }, [props.selectedTheme]);

  const themes = useSelector(allThemesSelector);
  const onSave = () => {
    // edition
    if (props.selectedTheme) {
      const updatedTheme: Partial<ThemeRequest> = {
        short,
        name,
        notificationEmoji: emoji,
        mainColor,
        colors,
        banner,
        appBanner,
        appImage,
        shareImage,
        icon,
        adminComments: notes || "",
      };
      dispatch(saveThemeActionCreator(props.selectedTheme._id, updatedTheme));
    } else {
      // creation
      const newTheme: ThemeRequest = {
        short,
        name,
        notificationEmoji: emoji,
        mainColor,
        colors,
        banner,
        appBanner,
        appImage,
        shareImage,
        icon,
        adminComments: notes || "",
        position: themes.length + 1,
      };
      dispatch(createThemeActionCreator(newTheme));
    }
    props.toggleModal();
  };

  const onDelete = () => {
    if (props.selectedTheme) {
      Swal.fire({
        title: "Êtes-vous sûr ?",
        text: "Voulez-vous supprimer ce thème ?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: themeColors.rouge,
        cancelButtonColor: themeColors.vert,
        confirmButtonText: "Oui, le supprimer",
        cancelButtonText: "Annuler",
      }).then((res) => {
        if (res.value && props.selectedTheme) {
          dispatch(deleteThemeActionCreator(props.selectedTheme._id));
        }
      });
    }
    props.toggleModal();
  };

  const isInvalid =
    toArray(emoji).length !== 1 ||
    !short /* isThemeTitleOk(short, languages) || */ ||
    !name; /* || isThemeTitleOk(name, languages) || */
  /* !banner || !banner.secure_url
    !appImage || !appImage.secure_url
    !shareImage || !shareImage.secure_url
    !icon || !icon.secure_url; */

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
          {props.selectedTheme && (
            <FButton className="me-2" type="error" name="trash-2-outline" onClick={onDelete} disabled={hasNeeds}>
              Supprimer
            </FButton>
          )}
          <FButton className="me-2" type="white" name="close-outline" onClick={props.toggleModal}>
            Annuler
          </FButton>
          <FButton type="validate" name="save-outline" onClick={onSave} disabled={isInvalid}>
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
              value={short?.fr}
              onChange={(e: any) => setShort((short) => ({ ...short, fr: e.target.value }))}
              newSize={true}
              autoFocus={false}
              placeholder="Écrire ici..."
              maxlength={25}
            />
          </div>
          <div>
            <Label htmlFor="name">Intitulé long du thème</Label>
            <FInput
              id="name"
              value={name?.fr}
              onChange={(e: any) => setName((name) => ({ ...name, fr: e.target.value }))}
              newSize={true}
              autoFocus={false}
              placeholder="Écrire ici..."
              maxlength={100}
            />
          </div>
          <div>
            <Label htmlFor="theme">Traduire les intitulés</Label>
            <div>
              {languages
                .filter((ln) => ln.i18nCode !== "fr")
                .map((langue) => (
                  <LangueButton
                    key={langue.langueCode}
                    onClick={() => {
                      setSelectedLanguageModal(langue);
                    }}
                    langue={langue}
                    valid={!!short?.[langue.i18nCode] && !!name?.[langue.i18nCode]}
                  />
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
                    style={{ backgroundColor: colors[i] }}
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
              maxlength={3000}
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
            <Label>Bannière mobile du thème</Label>
            <ImageInput
              image={appBanner}
              onImageUploaded={(e) => {
                setAppBanner(e);
              }}
              minHeight={90}
              imageSize={80}
              labelNoBackground={true}
              dimensionsHelp="720x560px"
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
              dimensionsHelp="248x320px"
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
              darkBackground={true}
            />
          </div>
        </Col>
      </Row>

      <DetailsModal
        show={!!selectedLanguageModal}
        toggleModal={() => setSelectedLanguageModal(null)}
        isLoading={false}
        size="lg"
        leftHead={<h2>Traduction du thème en : {selectedLanguageModal?.langueFr || ""}</h2>}
        rightHead={
          <>
            <FButton className="me-2" type="white" name="close-outline" onClick={() => setSelectedLanguageModal(null)}>
              Annuler
            </FButton>
            <FButton type="validate" name="save-outline" onClick={() => setSelectedLanguageModal(null)}>
              Valider
            </FButton>
          </>
        }
      >
        {selectedLanguageModal && (
          <>
            <div>
              <Label htmlFor="shortFr">Intitulé court du thème en français</Label>
              <FInput id="shortFr" value={short?.fr} disabled={true} newSize={true} autoFocus={false} />
            </div>
            <div>
              <Label htmlFor="shortLn">Intitulé court du thème en {selectedLanguageModal.langueFr}</Label>
              <FInput
                id="shortLn"
                value={short?.[selectedLanguageModal.i18nCode]}
                newSize={true}
                onChange={(e: any) =>
                  setShort((short) => ({
                    ...short,
                    fr: short?.fr || "", // for typescript validation
                    [selectedLanguageModal.i18nCode]: e.target.value,
                  }))
                }
                autoFocus={false}
              />
            </div>
            <div>
              <Label htmlFor="nameFr">Intitulé long du thème en français</Label>
              <FInput id="nameFr" value={name?.fr} disabled={true} newSize={true} autoFocus={false} />
            </div>
            <div>
              <Label htmlFor="nameLn">Intitulé long du thème en {selectedLanguageModal.langueFr}</Label>
              <FInput
                id="nameLn"
                value={name?.[selectedLanguageModal.i18nCode]}
                newSize={true}
                onChange={(e: any) =>
                  setName((name) => ({
                    ...name,
                    fr: name?.fr || "", // for typescript validation
                    [selectedLanguageModal.i18nCode]: e.target.value,
                  }))
                }
                autoFocus={false}
              />
            </div>
          </>
        )}
      </DetailsModal>
    </DetailsModal>
  );
};
