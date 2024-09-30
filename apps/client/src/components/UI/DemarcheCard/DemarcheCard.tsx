import Badge from "@codegouvfr/react-dsfr/Badge";
import { ContentType, GetDispositifsResponse } from "@refugies-info/api-types";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { memo } from "react";
import { useSelector } from "react-redux";
import demarcheIcon from "~/assets/recherche/illu-demarche.svg";
import FavoriteButton from "~/components/UI/FavoriteButton";
import { useSanitizedContent, useUtmz } from "~/hooks";
import { useCardImageUrl } from "~/hooks/useCardImage";
import { cls } from "~/lib/classname";
import { getReadableText } from "~/lib/getReadableText";
import { getRelativeTimeString } from "~/lib/getRelativeDate";
import { getTheme } from "~/lib/getTheme";
import { getPath } from "~/routes";
import styles from "~/scss/components/contentCard.module.scss";
import { themesSelector } from "~/services/Themes/themes.selectors";
import { NewThemeBadge } from "../NewThemeBadge";

interface Props {
  demarche: GetDispositifsResponse;
  targetBlank?: boolean;
  demoCard?: boolean;
  className?: string;
}

const DemarcheCard = (props: Props) => {
  const { t } = useTranslation();
  const router = useRouter();
  const themes = useSelector(themesSelector);
  const theme = getTheme(props.demarche.theme, themes);
  const { params: utmParams } = useUtmz();

  const safeSponsorName = useSanitizedContent(props.demarche?.sponsor?.nom);
  const safeTitreInformatif = useSanitizedContent(props.demarche.titreInformatif);
  const safeAbstract = useSanitizedContent(props.demarche.abstract);
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
                  title={getReadableText(props.demarche.titreInformatif || "")}
                  href={
                    props.demoCard
                      ? "#"
                      : {
                          pathname: getPath(`/${props.demarche.typeContenu}/[id]`, router.locale),
                          query: { id: props.demarche._id.toString(), ...utmParams },
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
                  src={props.demarche?.sponsor?.picture?.secure_url || demarcheIcon}
                  alt={props.demarche?.sponsor?.nom || ""}
                  width={48}
                  height={48}
                  style={{ objectFit: "contain" }}
                />
              </div>
              <div className="d-flex gap-2 mb-2">
                <NewThemeBadge theme={theme} />
                {(props.demarche.secondaryThemes?.length || 0) > 0 && (
                  <NewThemeBadge theme={props.demarche.secondaryThemes?.length || 0} />
                )}
              </div>
              <div className={styles.info}>
                <span>
                  <i className="fr-icon-building-line me-2" />
                  <span dangerouslySetInnerHTML={{ __html: safeSponsorName }} />
                </span>
              </div>

              {props.demarche?.sponsor?.nom && (
                <div className={styles.info}>
                  <i className="fr-icon-building-line me-2" />
                  <span dangerouslySetInnerHTML={{ __html: safeSponsorName }} />
                </div>
              )}
            </div>

            <div className={styles.end}>
              {props.demarche.lastModificationDate && (
                <div className={styles.info}>
                  <span className="flex-shrink-1">
                    <i className="fr-icon-time-line me-2" />
                    <span>
                      Mise à jour{" "}
                      {getRelativeTimeString(new Date(props.demarche.lastModificationDate), router.locale || "fr")}
                    </span>
                  </span>
                </div>
              )}
            </div>
            <i className="fr-icon-arrow-right-line" />
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
              <Badge small className={styles.badge_demarche}>
                <span>Démarche</span>
              </Badge>
            </li>
          </ul>
        </div>
      </div>

      <FavoriteButton contentId={props.demarche._id} className={styles.favorite} />
    </div>
  );
};

const propsAreEqual = (prevProps: Props, nextProps: Props): boolean => {
  const prevDemarche = prevProps.demarche;
  const nextDemarche = nextProps.demarche;

  const sameDisp = prevDemarche._id === nextDemarche._id;
  const sameText = prevDemarche.titreInformatif === nextDemarche.titreInformatif;

  return !!sameDisp && !!sameText;
};

export default memo(DemarcheCard, propsAreEqual);
