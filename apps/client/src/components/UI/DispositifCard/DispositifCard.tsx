import Badge from "@codegouvfr/react-dsfr/Badge";
import { ContentType, type SimpleDispositif } from "@refugies-info/api-types";
import { cn } from "@refugies-info/ui";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import { forwardRef, memo, useMemo } from "react";
import { useSelector } from "react-redux";
import defaultStructureImage from "~/assets/recherche/default-structure-image.svg";
import demarcheIcon from "~/assets/recherche/illu-demarche.svg";
import Image from "~/components/UI/Image";
import { useLocale, useSanitizedContent, useUtmz } from "~/hooks";
import { useCardImageUrl } from "~/hooks/useCardImage";
import { jsLcfirst, jsUcfirst } from "~/lib";
import { getCommitmentText, getPriceText } from "~/lib/dispositif";
import { getRelativeTimeString } from "~/lib/getRelativeDate";
import { getTheme } from "~/lib/getTheme";
import { getPath } from "~/routes";
import styles from "~/scss/components/contentCard.module.scss";
import { allThemesSelector } from "~/services/Themes/themes.selectors";
import { NewThemeBadge } from "../NewThemeBadge";

interface Props {
  dispositif: SimpleDispositif;
  selectedDepartment?: string;
  targetBlank?: boolean;
  demoCard?: boolean;
  className?: string;
}

const DispositifCard = forwardRef<HTMLElement, Props>((props, ref) => {
  const { t } = useTranslation();
  const locale = useLocale();
  const themes = useSelector(allThemesSelector);
  const isDispositif = useMemo(
    () => props.dispositif.typeContenu === ContentType.DISPOSITIF,
    [props.dispositif.typeContenu],
  );
  const theme = getTheme(props.dispositif.theme, themes);
  const { params: utmParams } = useUtmz();

  const commitment = props.dispositif.metadatas?.commitment;
  const price = props.dispositif.metadatas?.price;
  const isOnline = props.dispositif.metadatas?.location === "online";

  const badge = useMemo(() => {
    if (!isDispositif)
      return { text: t("Dispositif.demarche", "Démarche"), className: styles.badge_demarche };
    const location = props.dispositif.metadatas?.location;
    if (!location) return { text: "Lieu d'action", className: styles.badge_department };
    if (!Array.isArray(location)) {
      if (location === "france")
        return {
          text: jsUcfirst(t("Recherche.france", "toute la France")),
          className: styles.badge_department,
        };
      if (location === "online")
        return { text: jsUcfirst(t("Recherche.online")), className: styles.badge_online };
    }
    if (props.selectedDepartment)
      return { text: props.selectedDepartment, className: styles.badge_department };
    if (Array.isArray(location) && location.length > 1)
      return {
        text: `${location.length} ${jsLcfirst(t("Dispositif.departements", "Départements"))}`,
        className: styles.badge_department,
      };

    const splittedLocation = location[0].split(" - ");
    return {
      text: `${splittedLocation[1]} ${splittedLocation[0]}`,
      className: styles.badge_department,
    };
  }, [props.dispositif.metadatas, props.selectedDepartment, isDispositif, t]);

  const safeSponsorName = useSanitizedContent(props.dispositif?.sponsor?.nom);
  const safeTitreInformatif = useSanitizedContent(props.dispositif.titreInformatif);
  const safeAbstract = useSanitizedContent(props.dispositif.abstract);
  const cardImageUrl = useCardImageUrl(theme, props.dispositif.typeContenu);

  const defaultImage = isDispositif ? defaultStructureImage : demarcheIcon;

  return (
    <article
      ref={ref}
      tabIndex={-1}
      aria-labelledby={props.dispositif._id.toString()}
      className={cn(styles.wrapper, props.className, "fr-card fr-card--sm fr-enlarge-link")}
    >
      <Badge small className={cn(badge.className, "absolute top-2 left-2 z-10")}>
        {isOnline && <i className="ri-at-line me-1" aria-hidden="true"></i>}
        {badge.text}
      </Badge>
      <div className={cn("fr-card", styles.container)}>
        <div className={cn("fr-card__body", styles.body)}>
          <div className={cn("fr-card__content", styles.content)}>
            <div className={styles.text}>
              <h3 className="fr-card__title" id={props.dispositif._id.toString()}>
                <Link
                  target={props.targetBlank ? "_blank" : undefined}
                  rel={props.targetBlank ? "noopener noreferrer" : undefined}
                  href={
                    props.demoCard
                      ? "#"
                      : {
                          pathname: getPath(`/${props.dispositif.typeContenu}/[id]`, locale),
                          query: { id: props.dispositif._id.toString(), ...utmParams },
                        }
                  }
                >
                  <span
                    className={cn(styles.title, styles.three_lines)}
                    dangerouslySetInnerHTML={{ __html: safeTitreInformatif }}
                  ></span>
                </Link>
              </h3>
              <p
                className={cn("fr-card__desc", styles.desc)}
                dangerouslySetInnerHTML={{ __html: safeAbstract }}
              />
            </div>

            <div className="fr-card__start relative">
              <div className={styles.sponsor} aria-hidden="true">
                <Image
                  className="h-[3rem] object-contain"
                  src={props.dispositif?.sponsor?.picture?.secure_url || defaultImage}
                  alt=""
                  width={48}
                  height={48}
                />
              </div>
              <div className="mb-2 flex gap-2">
                <NewThemeBadge theme={theme} />
                {(props.dispositif.secondaryThemes?.length || 0) > 0 && (
                  <NewThemeBadge theme={props.dispositif.secondaryThemes?.length || 0} />
                )}
              </div>

              {props.dispositif?.sponsor?.nom && (
                <div className={styles.info}>
                  <span>
                    <i className="fr-icon-building-line me-2" aria-hidden="true" />
                    <span dangerouslySetInnerHTML={{ __html: safeSponsorName }} />
                  </span>
                </div>
              )}
            </div>

            <div className={styles.end}>
              {isDispositif ? (
                <>
                  <div className={cn(styles.info, "flex gap-2")}>
                    {price && (
                      <span className="shrink-0">
                        <i className="fr-icon-money-euro-circle-line me-2" aria-hidden="true" />
                        <span>{getPriceText(price, t)}</span>
                      </span>
                    )}
                    {commitment && (
                      <span className="shrink">
                        <i className="fr-icon-time-line me-2" aria-hidden="true" />
                        <span>{getCommitmentText(commitment, t, true)}</span>
                      </span>
                    )}
                  </div>
                </>
              ) : (
                <>
                  {props.dispositif.lastModificationDate && (
                    <div className={cn(styles.info)}>
                      <span className="shrink">
                        <i className="fr-icon-time-line me-2" aria-hidden="true" />
                        <span>
                          {getRelativeTimeString(
                            new Date(props.dispositif.lastModificationDate),
                            locale,
                            t,
                          )}
                        </span>
                      </span>
                    </div>
                  )}
                </>
              )}
              {!props.demoCard && <i className="fr-icon-arrow-right-line" aria-hidden="true" />}
            </div>
          </div>
        </div>
        <div className="fr-card__header" aria-hidden="true">
          <div className="fr-card__img">
            {cardImageUrl ? (
              <Image
                className="fr-responsive-img"
                width={280}
                height={158}
                src={cardImageUrl}
                alt=""
                data-fr-js-ratio="true"
              />
            ) : (
              <div className={styles.placeholder_img}></div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
});

DispositifCard.displayName = "DispositifCard";

const propsAreEqual = (prevProps: Props, nextProps: Props): boolean => {
  const prevDisp = prevProps.dispositif;
  const nextDisp = nextProps.dispositif;

  const sameDisp = prevDisp._id === nextDisp._id;
  const sameText =
    prevDisp.titreInformatif === nextDisp.titreInformatif ||
    prevDisp.abstract === nextDisp.abstract ||
    (prevDisp?.titreMarque ? prevDisp.titreMarque === nextDisp?.titreMarque : true);
  const sameDep =
    prevProps.selectedDepartment && prevProps.selectedDepartment === nextProps.selectedDepartment;

  return !!sameDisp && !!sameText && !!sameDep;
};

export default memo(DispositifCard, propsAreEqual);
