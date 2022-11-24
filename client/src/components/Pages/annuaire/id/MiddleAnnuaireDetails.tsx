import React from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import Skeleton from "react-loading-skeleton";

import { userSelector } from "services/User/user.selectors";

import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import { ActivityCard } from "components/Pages/annuaire-create/ActivityCard";
import FButton from "components/UI/FButton/FButton";
import { DayHoursPrecisions } from "./DayHoursPrecisions";
import { NoActivity } from "./NoActivity";

import { activities } from "data/activities";
import { Structure, Theme } from "types/interface";
import { getPath } from "routes";

import styles from "./MiddleAnnuaireDetails.module.scss";
import { themesSelector } from "services/Themes/themes.selectors";

interface Props {
  structure: Structure | null;
  isLoading: boolean;
  isMember: boolean;
}

const weekDays = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

const PhoneNumber = (props: { phone: string }) => (
  <div className={styles.white_container}>
    <EVAIcon name="phone-call-outline" fill="#212121" className="mr-8" />
    {props.phone}
  </div>
);

const Mail = (props: { mail: string }) => (
  <div className={styles.white_container}>
    <EVAIcon name="email-outline" fill="#212121" className="mr-8" />
    {props.mail}
  </div>
);

const Adress = (props: { adress: string | undefined }) => (
  <div className={styles.white_container}>
    <EVAIcon name="pin-outline" fill="#212121" className="mr-8" />
    {props.adress}
  </div>
);

const HoursPrecisions = (props: { text: string }) => (
  <div className={styles.blue_container}>
    <EVAIcon name="info" fill="#2D9CDB" className="mr-8" />
    {props.text}
  </div>
);

const Departement = (props: { departement: string }) => {
  const { t } = useTranslation();

  return (
    <div className={styles.white_container}>
      <EVAIcon name="pin-outline" fill="#212121" className="mr-8" />
      {props.departement === "All" ? t("Dispositif.France entière", "France entière") : props.departement}
    </div>
  );
};

const Placeholder = (props: { iconName: string; text: string; i18nKey: string }) => {
  const { t } = useTranslation();

  return (
    <div className={styles.red_container}>
      <EVAIcon name={props.iconName} fill="#212121" className="mr-8" />
      {/* @ts-ignore */}
      <>{t("Annuaire." + props.i18nKey, props.text)}</>
    </div>
  );
};

const getActivityDetails = (activity: string, themes: Theme[]) => {
  const correspondingActivity = activities.filter((activityData) => activityData.activity === activity);

  if (!correspondingActivity) return { theme: null };
  const themeShort = correspondingActivity[0].theme;

  const correspondingTheme = themes.filter((theme) => theme.short.fr === themeShort);
  return { theme: correspondingTheme[0], image: correspondingActivity[0].image };
};

const sortStructureActivities = (structure: Structure | null, themes: Theme[]) => {
  let structureActivities: { title: string; themeName: string }[] = [];
  if (structure && structure.activities) {
    structure.activities.forEach((element) => {
      let detail = getActivityDetails(element, themes);
      let el = { title: element, themeName: detail.theme ? detail.theme.name.fr : "" };
      structureActivities.push(el);
    });
  }
  structureActivities.sort(function (a, b) {
    if (a.themeName > b.themeName) {
      return -1;
    }
    if (b.themeName > a.themeName) {
      return 1;
    }
    return 0;
  });
  let activitiesSortedByTheme: string[] = [];
  structureActivities.forEach((el) => activitiesSortedByTheme.push(el.title));
  return activitiesSortedByTheme;
};

export const MiddleAnnuaireDetail = (props: Props) => {
  const { t } = useTranslation();
  const router = useRouter();
  const structure = props.structure;
  const admin = useSelector(userSelector).admin;
  const themes = useSelector(themesSelector);
  const activitiesSortedByTheme = sortStructureActivities(structure, themes);
  const hasUpdatePermission = props.isMember || admin;

  if (!props.isLoading && structure) {
    return (
      <div className={styles.middle_container}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div className={styles.title_container}>
            {!structure.acronyme && <div className={styles.title}>{structure.nom}</div>}
            {structure.acronyme && (
              <div className={styles.title}>
                {structure.nom} <span style={{ color: "#828282" }}>{"- " + structure.acronyme}</span>{" "}
              </div>
            )}
          </div>
          {hasUpdatePermission && (
            <div style={{ height: "5Opx" }}>
              <Link legacyBehavior href={getPath("/annuaire-creation", router.locale)} passHref>
                <FButton tag="a" type="dark" name="edit-outline">
                  Modifier la fiche
                </FButton>
              </Link>
            </div>
          )}
        </div>
        {structure.description && <div className={styles.description}>{structure.description}</div>}
        {!structure.description && (
          <div className={styles.no_description}>
            {t("Annuaire.noDescription", "Aucune description de la structure disponible.")}
          </div>
        )}
        <div className={styles.info_container}>
          <div className={styles.info_column_container}>
            <div className={styles.subtitle}>{t("Annuaire.Adresse email", "Adresse email")}</div>
            <div className={styles.line_container}>
              {structure.mailsPublic && structure.mailsPublic.map((mail) => <Mail mail={mail} key={mail} />)}
              {(!structure.mailsPublic || structure.mailsPublic.length === 0) && (
                <Placeholder iconName="email-outline" text="Aucune adresse email renseignée" i18nKey="noemail" />
              )}
            </div>
            <div className={styles.subtitle}>{t("Annuaire.Numéro de téléphone", "Numéro de téléphone")}</div>
            <div className={styles.line_container}>
              {structure.phonesPublic &&
                structure.phonesPublic.map((phone) => <PhoneNumber phone={phone} key={phone} />)}
              {(!structure.phonesPublic || structure.phonesPublic.length === 0) && (
                <Placeholder
                  iconName="phone-call-outline"
                  text="Aucun numéro de téléphone renseigné"
                  i18nKey="noPhone"
                />
              )}
            </div>
            <div className={styles.subtitle}>{t("Annuaire.Adresse postale", "Adresse postale")}</div>
            {structure.adressPublic && <Adress adress={structure.adressPublic} />}
            {!structure.adressPublic && (
              <Placeholder iconName="pin-outline" text="Aucune adresse postale renseignée" i18nKey="noAdress" />
            )}
            <div className={styles.subtitle}>{t("Annuaire.Départements d'action", "Départements d'action")}</div>
            <div className={styles.line_container}>
              {structure.departments &&
                structure.departments.map((departement) => <Departement key={departement} departement={departement} />)}
              {(!structure.departments || structure.departments.length === 0) && (
                <Placeholder iconName="hash" text="Aucun département renseigné" i18nKey="noDepartement" />
              )}
            </div>
          </div>
          <div className={styles.info_column_container}>
            <div className={styles.subtitle}>{t("Annuaire.Horaires d'accueil", "Horaires d'accueil")}</div>
            {!structure.openingHours && (
              <Placeholder iconName="alert-circle-outline" text="Horaires non-renseignées" i18nKey="noOpeningHours" />
            )}
            {structure.openingHours && structure.openingHours.precisions && (
              <div style={{ marginBottom: "8px" }}>
                <HoursPrecisions text={structure.openingHours.precisions} />
              </div>
            )}
            {structure.openingHours && structure.openingHours.noPublic && (
              <HoursPrecisions
                text={t(
                  "Annuaire.Cette structure n'accueille pas de public.",
                  "Cette structure n'accueille pas de public."
                )}
              />
            )}
            {structure.onlyWithRdv && (
              <HoursPrecisions text={t("Annuaire.Uniquement sur rendez-vous", "Uniquement sur rendez-vous.")} />
            )}
            {structure.openingHours &&
              !structure.openingHours.noPublic &&
              weekDays.map((day) => <DayHoursPrecisions day={day} openingHours={structure.openingHours} key={day} />)}
          </div>
        </div>
        <div style={{ marginTop: "24px", marginBottom: "24px" }}>
          <div className={styles.title}>{t("Annuaire.Activités et services", "Activités et services")}</div>
        </div>
        <div className={styles.activity_container}>
          {activitiesSortedByTheme &&
            activitiesSortedByTheme.map((activity) => {
              const { theme, image } = getActivityDetails(activity, themes);
              if (!theme) return;
              return (
                <ActivityCard
                  // @ts-ignore
                  activity={t("Annuaire." + activity, activity)}
                  key={activity}
                  darkColor={theme.colors.color100}
                  lightColor={theme.colors.color30}
                  selectActivity={() => {}}
                  isSelected={true}
                  image={image}
                  isLectureMode={true}
                  theme={theme}
                />
              );
            })}
          {(!structure.activities || structure.activities.length === 0) && (
            <>
              <NoActivity />
              <NoActivity />
              <NoActivity />
            </>
          )}
        </div>
        <div className={styles.bottom_container}>{"s"}</div>
      </div>
    );
  }

  return (
    <div className={styles.middle_container}>
      <Skeleton width={600} height={40} />
      <div style={{ marginTop: "16px" }}>
        <Skeleton width={600} count={3} />
      </div>
      <div style={{ marginTop: "16px" }}>
        <Skeleton width={600} count={3} />
      </div>
    </div>
  );
};
