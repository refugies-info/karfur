import React from "react";
import { useSelector } from "react-redux";
import { ContentType } from "api-types";
import { selectedDispositifSelector } from "services/SelectedDispositif/selectedDispositif.selector";
import { secondaryThemesSelector, themeSelector } from "services/Themes/themes.selectors";
import SEO from "components/Seo";
import { Metadatas, Map, Header, Sponsors, Contributors } from "components/Pages/dispositif";
import styles from "./Dispositif.module.scss";
import Section from "components/Pages/dispositif/Section";
import Feedback from "components/Pages/dispositif/Feedback";
import LinkedThemes from "components/Pages/dispositif/LinkedThemes";
import { dispositifNeedsSelector } from "services/Needs/needs.selectors";
import Button from "components/UI/Button";
import ShareButtons from "components/Pages/dispositif/ShareButtons";
import SMSForm from "components/Pages/dispositif/SMSForm";
import { useFavorites } from "hooks";
import { readAudio } from "lib/readAudio";

interface Props {
  typeContenu?: ContentType;
}

const Dispositif = (props: Props) => {
  const dispositif = useSelector(selectedDispositifSelector);
  const theme = useSelector(themeSelector(dispositif?.theme));
  const secondaryThemes = useSelector(secondaryThemesSelector(dispositif?.secondaryThemes));
  const needs = useSelector(dispositifNeedsSelector(dispositif?.needs));

  const { isFavorite, addToFavorites, deleteFromFavorites } = useFavorites(dispositif._id);

  const typeContenu = props.typeContenu || dispositif?.typeContenu || ContentType.DISPOSITIF;
  const color100 = theme?.colors.color100 || "#000";
  const color30 = theme?.colors.color30 || "#ddd";

  return (
    <div className={styles.container}>
      <SEO
        title={dispositif?.titreMarque || dispositif?.titreInformatif || ""}
        description={dispositif?.abstract || ""}
        image={theme?.shareImage.secure_url}
      />
      <div className={styles.banner} style={{ backgroundImage: `url(${theme?.banner.secure_url})` }}></div>

      <div className={styles.content}>
        <div className={styles.left}>
          <Metadatas
            metadatas={dispositif?.metadatas}
            titreMarque={dispositif?.titreMarque}
            mainSponsor={dispositif?.mainSponsor}
            color={color100}
          />
        </div>
        <div className={styles.main}>
          <Header dispositif={dispositif} typeContenu={typeContenu} />
          <Section sectionKey="what" content={dispositif?.what} color100={color100} color30={color30} />
          {typeContenu === ContentType.DISPOSITIF ? (
            <div>
              <Section accordions={dispositif?.why} sectionKey="why" color100={color100} color30={color30} />
              <Section accordions={dispositif?.how} sectionKey="how" color100={color100} color30={color30} />
            </div>
          ) : (
            <div>
              <Section accordions={dispositif?.how} sectionKey="how" color100={color100} color30={color30} />
              <Section accordions={dispositif?.next} sectionKey="next" color100={color100} color30={color30} />
            </div>
          )}
          <Feedback nbMercis={dispositif.merci.length} />
          <LinkedThemes theme={theme} secondaryThemes={secondaryThemes} needs={needs} />
          <Sponsors sponsors={dispositif.sponsors} />
        </div>
        <div className={styles.right}>
          <Button onClick={() => readAudio(dispositif.titreInformatif, "fr")} icon="play-circle" className="mb-2">
            Écouter la fiche
          </Button>
          <Button
            secondary
            onClick={isFavorite ? deleteFromFavorites : addToFavorites}
            icon={isFavorite ? "star" : "star-outline"}
            className="mb-2"
          >
            {isFavorite ? "Ajouté aux favoris" : "Ajouter aux favoris"}
          </Button>

          <ShareButtons />
          <SMSForm />
        </div>
      </div>

      {dispositif && <Contributors contributors={dispositif.participants} />}
    </div>
  );
};

export default Dispositif;
