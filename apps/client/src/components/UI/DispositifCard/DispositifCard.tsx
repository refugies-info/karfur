import Badge from "@codegouvfr/react-dsfr/Badge";
import { ContentType, GetDispositifsResponse } from "@refugies-info/api-types";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { memo } from "react";
import { useSelector } from "react-redux";
import defaultStructureImage from "~/assets/recherche/default-structure-image.svg";
import FavoriteButton from "~/components/UI/FavoriteButton";
import { useSanitizedContent, useUtmz } from "~/hooks";
import { useCardImageUrl } from "~/hooks/useCardImage";
import { jsLcfirst, jsUcfirst } from "~/lib";
import { cls } from "~/lib/classname";
import { getCommitmentText, getPriceText } from "~/lib/dispositif";
import { getReadableText } from "~/lib/getReadableText";
import { getTheme } from "~/lib/getTheme";
import { getPath } from "~/routes";
import styles from "~/scss/components/contentCard.module.scss";
import { themesSelector } from "~/services/Themes/themes.selectors";
import { NewThemeBadge } from "../NewThemeBadge";

interface Props {
  dispositif: GetDispositifsResponse;
  selectedDepartment?: string;
  targetBlank?: boolean;
  demoCard?: boolean;
  className?: string;
}

const DispositifCard = (props: Props) => {
  const { t } = useTranslation();
  const router = useRouter();
  const themes = useSelector(themesSelector);
  const theme = getTheme(props.dispositif.theme, themes);
  const { params: utmParams } = useUtmz();

  const commitment = props.dispositif.metadatas?.commitment;
  const price = props.dispositif.metadatas?.price;
  const isOnline = props.dispositif.metadatas?.location === "online";

  const getDepartement = () => {
    const location = props.dispositif.metadatas?.location;
    if (!location) return null;
    if (!Array.isArray(location)) {
      if (location === "france") return jsUcfirst(t("Recherche.france", "toute la France"));
      if (location === "online") return jsUcfirst(t("Recherche.online"));
    }
    if (props.selectedDepartment) return props.selectedDepartment;
    if (Array.isArray(location) && location.length > 1)
      return `${location.length} ${jsLcfirst(t("Dispositif.Départements", "Départements"))}`;

    const splittedLocation = location[0].split(" - ");
    return `${splittedLocation[1]} ${splittedLocation[0]}`;
  };

  const safeSponsorName = useSanitizedContent(props.dispositif?.sponsor?.nom);
  const safeTitreMarque = useSanitizedContent(props.dispositif?.titreMarque);
  const safeTitreInformatif = useSanitizedContent(props.dispositif.titreInformatif);
  const safeAbstract = useSanitizedContent(props.dispositif.abstract);
  const cardImageUrl = useCardImageUrl(theme, ContentType.DISPOSITIF);

  return (
    <div className={cls(styles.wrapper, props.className)}>
      <div className={cls("fr-card fr-enlarge-link", styles.container)}>
        <div className={cls("fr-card__body", styles.body)}>
          <div className={cls("fr-card__content", styles.content)}>
            <div className={styles.text}>
              <h3 className="fr-card__title">
                <Link
                  target={props.targetBlank ? "_blank" : undefined}
                  rel={props.targetBlank ? "noopener noreferrer" : undefined}
                  title={getReadableText(props.dispositif.titreInformatif || "")}
                  href={
                    props.demoCard
                      ? "#"
                      : {
                          pathname: getPath(`/${props.dispositif.typeContenu}/[id]`, router.locale),
                          query: { id: props.dispositif._id.toString(), ...utmParams },
                        }
                  }
                >
                  <span
                    className={cls(styles.title, styles.three_lines)}
                    dangerouslySetInnerHTML={{ __html: safeTitreInformatif }}
                  ></span>
                </Link>
              </h3>
              <p
                className={cls("fr-card__desc", styles.desc, props.demoCard && styles.demo)}
                dangerouslySetInnerHTML={{ __html: safeAbstract }}
              />
            </div>

            <div className="fr-card__start mb-3 position-relative">
              <div className={styles.sponsor}>
                <Image
                  src={props.dispositif?.sponsor?.picture?.secure_url || defaultStructureImage}
                  alt={props.dispositif?.sponsor?.nom || ""}
                  width={48}
                  height={48}
                  style={{ objectFit: "contain" }}
                />
              </div>
              <div className="d-flex gap-2 mb-2">
                <NewThemeBadge theme={theme} />
                {(props.dispositif.secondaryThemes?.length || 0) > 0 && (
                  <NewThemeBadge theme={props.dispositif.secondaryThemes?.length || 0} />
                )}
              </div>
              <div className={styles.info}>
                <span>
                  <i className="fr-icon-building-line me-2" />
                  <span dangerouslySetInnerHTML={{ __html: safeSponsorName }} />
                </span>
              </div>
            </div>

            <div className={styles.end}>
              <div className={cls(styles.info, "d-flex gap-2")}>
                {price !== undefined && (
                  <span className="flex-shrink-0">
                    <i className="fr-icon-money-euro-circle-line me-2" />
                    <span>{getPriceText(price, t)}</span>
                  </span>
                )}
                {commitment && (
                  <span className="flex-shrink-1">
                    <i className="fr-icon-time-line me-2" />
                    <span>{getCommitmentText(commitment, t, true)}</span>
                  </span>
                )}
              </div>
              <i className="fr-icon-arrow-right-line" />
            </div>
          </div>
        </div>
        <div className="fr-card__header">
          <div className="fr-card__img">
            <Image
              className="fr-responsive-img"
              width={280}
              height={158}
              src={cardImageUrl}
              alt=""
              data-fr-js-ratio="true"
            />
          </div>
          <ul className="fr-badges-group">
            <li>
              <Badge small className={isOnline ? styles.badge_online : styles.badge_department}>
                {isOnline && <i className="ri-at-line me-1"></i>}
                {getDepartement()}
              </Badge>
            </li>
          </ul>
        </div>
      </div>

      <FavoriteButton contentId={props.dispositif._id} className={styles.favorite} />
    </div>
  );
};

const propsAreEqual = (prevProps: Props, nextProps: Props): boolean => {
  const prevDisp = prevProps.dispositif;
  const nextDisp = nextProps.dispositif;

  const sameDisp = prevDisp._id === nextDisp._id;
  const sameText =
    prevDisp.titreInformatif === nextDisp.titreInformatif ||
    prevDisp.abstract === nextDisp.abstract ||
    (prevDisp?.titreMarque ? prevDisp.titreMarque === nextDisp?.titreMarque : true);
  const sameDep = prevProps.selectedDepartment && prevProps.selectedDepartment === nextProps.selectedDepartment;

  return !!sameDisp && !!sameText && !!sameDep;
};

export default memo(DispositifCard, propsAreEqual);
