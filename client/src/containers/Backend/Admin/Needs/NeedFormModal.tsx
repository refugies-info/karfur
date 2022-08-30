import React, { useEffect, useMemo, useState } from "react";
import { Need, Picture } from "types/interface";
import FInput from "components/UI/FInput/FInput";
import FButton from "components/UI/FButton/FButton";
import { useDispatch, useSelector } from "react-redux";
import { createNeedActionCreator, deleteNeedActionCreator, saveNeedActionCreator } from "services/Needs/needs.actions";
import { DetailsModal } from "../sharedComponents/DetailsModal";
import { Label } from "../sharedComponents/SubComponents";
import { ObjectId } from "mongodb";
import styles from "./NeedFormModal.module.scss";
import { Col, Row } from "reactstrap";
import { themesSelector } from "services/Themes/themes.selectors";
import ImageInput from "components/UI/ImageInput";
import TagName from "components/UI/TagName";
import FilterButton from "components/UI/FilterButton";
import Swal from "sweetalert2";
import { colors } from "colors";
import { allDispositifsSelector } from "services/AllDispositifs/allDispositifs.selector";

interface Props {
  show: boolean;
  toggleModal: () => void;
  selectedNeed: Need | null; // if null, creation. Else, edition
}

const TITLE_MAX_CHAR = 100;

export const NeedFormModal = (props: Props) => {
  const [name, setName] = useState(props.selectedNeed?.fr.text || "");
  const [subtitle, setSubtitle] = useState("");
  const [notes, setNotes] = useState("");
  const [themeSelected, setThemeSelected] = useState<ObjectId | null>(null);
  const [image, setImage] = useState<Picture|undefined>(undefined);

  const themes = useSelector(themesSelector);
  const dispositifs = useSelector(allDispositifsSelector);
  const dispatch = useDispatch();

  const hasDispositifs = useMemo(() => {
    if (!props.selectedNeed) return false;
    return dispositifs.filter(disp =>
      props.selectedNeed ? (disp.needs || []).includes(props.selectedNeed._id) : false
    ).length > 0
  }, [props.selectedNeed, dispositifs]);

  useEffect(() => {
    if (props.selectedNeed) {
      setName(props.selectedNeed.fr.text);
      setSubtitle(props.selectedNeed.fr.subtitle || "");
      setNotes(props.selectedNeed.adminComments);
      setThemeSelected(props.selectedNeed.theme._id);
      setImage(props.selectedNeed.image || undefined);
    } else {
      setName("");
      setSubtitle("");
      setNotes("");
      setThemeSelected(null);
      setImage(undefined);
    }
  }, [props.selectedNeed]);

  const onSave = () => {
    const need: Partial<Need> = {
      fr: {
        text: name,
        subtitle: subtitle
      },
      //@ts-ignore
      theme: themeSelected || undefined,
      image: image || undefined
    }
    if (props.selectedNeed) { // edition
      dispatch(
        saveNeedActionCreator({
          _id: props.selectedNeed._id,
          ...need,
          adminComments: notes
        })
      );
    } else { // creation
      dispatch(createNeedActionCreator(need));
    }
    props.toggleModal();
  };

  const onDelete = () => {
    if (props.selectedNeed) {
      Swal.fire({
        title: "Êtes-vous sûr ?",
        text: "Voulez-vous supprimer ce besoin ?",
        type: "question",
        showCancelButton: true,
        confirmButtonColor: colors.rouge,
        cancelButtonColor: colors.vert,
        confirmButtonText: "Oui, le supprimer",
        cancelButtonText: "Annuler",
      }).then(res => {
        if (res.value && props.selectedNeed) {
          dispatch(deleteNeedActionCreator(props.selectedNeed._id));
        }
      })
    }
    props.toggleModal();
  };


  const totalChar = name.length + subtitle.length;
  return (
    <DetailsModal
      show={props.show}
      toggleModal={props.toggleModal}
      isLoading={false}
      leftHead={
        <>
          <h2>{props.selectedNeed ? "Modifier le besoin" : "Ajouter un nouveau besoin"}</h2>
        </>
      }
      rightHead={
        <>
          {props.selectedNeed &&
            <FButton
              className="mr-2"
              type="error"
              name="trash-2-outline"
              onClick={onDelete}
              disabled={hasDispositifs}
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
            disabled={totalChar > TITLE_MAX_CHAR || !image || !name || !themeSelected}
          >
            Valider
          </FButton>
        </>
      }
    >
      <Row className="mt-4">
        <Col>
          <div>
              <Label htmlFor="name">
                Intitulé du besoin
                <span className={styles.label_details}>{totalChar}/{TITLE_MAX_CHAR} caractères restants</span>
              </Label>
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
            <Label htmlFor="subtitle">
              Sous-titre du besoin (facultatif)
              <span className={styles.label_details}>{totalChar}/{TITLE_MAX_CHAR} caractères restants</span>
            </Label>
            <FInput
              id="subtitle"
              value={subtitle}
              onChange={(e: any) => setSubtitle(e.target.value)}
              newSize={true}
              autoFocus={false}
              placeholder="Écrire ici..."
            />
          </div>
          <div>
            <Label htmlFor="theme">Thème associé</Label>
            <div>
              {themes.map((theme, i) => (
                <FilterButton
                  key={theme.short.fr}
                  active={theme._id === themeSelected}
                  color={theme.colors.color100}
                  onClick={() => {
                    if (theme._id === themeSelected) setThemeSelected(null);
                    else setThemeSelected(theme._id);
                  }}
                  className="mr-2 mb-2"
                >
                  <TagName theme={theme} />
                </FilterButton>
              ))}
            </div>
          </div>
        </Col>

        <Col>
          <div className="mb-2">
            <Label>Image du besoin</Label>
            <ImageInput
              image={image}
              onImageUploaded={(e) => {
                setImage(e);
              }}
              minHeight={220}
            />
          </div>
          {props.selectedNeed && (
            <>
              <div className="mb-2">
                <Label htmlFor="notes">Notes internes</Label>
                <FInput
                  id="notes"
                  type="textarea"
                  value={notes}
                  onChange={(e: any) => setNotes(e.target.value)}
                  newSize={true}
                  autoFocus={false}
                  placeholder="Notes..."
                />
              </div>

              <div>
                <Label>Nombre de clics</Label>
                <p>Total : {props.selectedNeed.nbVues || 0}</p>
              </div>
            </>
          )}
        </Col>
      </Row>
    </DetailsModal>
  );
};
