import Button from "@codegouvfr/react-dsfr/Button";
import { useTranslation } from "next-i18next";
import IconAdministration from "~/assets/staticPages/mission-et-impact/icon-administration.svg";
import IconAgir from "~/assets/staticPages/mission-et-impact/icon-agir.png";
import IconOperators from "~/assets/staticPages/mission-et-impact/icon-operators.png";
import IconStructure from "~/assets/staticPages/mission-et-impact/icon-structure.svg";
import IconTranslator from "~/assets/staticPages/mission-et-impact/icon-translator.svg";
import IconTs from "~/assets/staticPages/mission-et-impact/icon-ts.svg";
import { Card, Section, Title2 } from "~/components/Pages/staticPages/common";

export const SectionCommunity = () => {
  const { t } = useTranslation();
  return (
    <Section>
      <div className="fr-container">
        <Title2 className="!text-center">{t("MissionImpact.join_title")}</Title2>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
          <Card
            image={IconTs}
            title={t("MissionImpact.join_ts_title")}
            footer={
              <Button
                priority="tertiary"
                iconId="fr-icon-arrow-right-line"
                iconPosition="right"
                className="fr-default"
                linkProps={{
                  href: "https://airtable.com/shrrkFuyeG0BpKKT7",
                  rel: "noopener noreferrer",
                  target: "_blank",
                }}
              >
                {t("MissionImpact.join_ts_cta")}
              </Button>
            }
            footerBottom
          >
            <p>{t("MissionImpact.join_ts_subtitle")}</p>
          </Card>
          <Card
            image={IconAgir}
            title={t("MissionImpact.join_agir_title")}
            footer={
              <Button
                priority="tertiary"
                iconId="fr-icon-calendar-event-line"
                iconPosition="right"
                className="fr-default"
                linkProps={{
                  href: "https://calendly.com/nour-refugies-info/rdv-ambassadeur-de-refugies-info",
                  rel: "noopener noreferrer",
                  target: "_blank",
                }}
              >
                {t("MissionImpact.join_meeting_cta")}
              </Button>
            }
            footerBottom
          >
            <p>{t("MissionImpact.join_agir_subtitle")}</p>
          </Card>
          <Card
            image={IconOperators}
            imageWidth={240}
            title={t("MissionImpact.join_etat_title")}
            footer={
              <Button
                priority="tertiary"
                iconId="fr-icon-calendar-event-line"
                iconPosition="right"
                className="fr-default"
                linkProps={{
                  href: "https://calendly.com/nour-refugies-info/rdv-ambassadeur-de-refugies-info",
                  rel: "noopener noreferrer",
                  target: "_blank",
                }}
              >
                {t("MissionImpact.join_meeting_cta")}
              </Button>
            }
            footerBottom
          >
            <p>{t("MissionImpact.join_etat_subtitle")}</p>
          </Card>
          <Card
            image={IconAdministration}
            title={t("MissionImpact.join_administration_title")}
            footer={
              <Button
                priority="tertiary"
                iconId="fr-icon-calendar-event-line"
                iconPosition="right"
                className="fr-default"
                linkProps={{
                  href: "https://calendly.com/nour-refugies-info/rdv-ambassadeur-de-refugies-info",
                  rel: "noopener noreferrer",
                  target: "_blank",
                }}
              >
                {t("MissionImpact.join_meeting_cta")}
              </Button>
            }
            footerBottom
          >
            <p>{t("MissionImpact.join_administration_subtitle")}</p>
          </Card>
          <Card
            image={IconStructure}
            title={t("MissionImpact.join_structure_title")}
            footer={
              <Button
                priority="tertiary"
                iconId="fr-icon-arrow-right-line"
                iconPosition="right"
                className="fr-default"
                linkProps={{
                  href: "https://refugies.info/fr/publier",
                  rel: "noopener noreferrer",
                  target: "_blank",
                }}
              >
                {t("MissionImpact.join_structure_cta")}
              </Button>
            }
            footerBottom
          >
            <p>{t("MissionImpact.join_structure_subtitle")}</p>
          </Card>
          <Card
            image={IconTranslator}
            title={t("MissionImpact.join_traducteur_title")}
            footer={
              <Button
                priority="tertiary"
                iconId="fr-icon-arrow-right-line"
                iconPosition="right"
                className="fr-default"
                linkProps={{
                  href: "https://refugies.info/fr/traduire",
                  rel: "noopener noreferrer",
                  target: "_blank",
                }}
              >
                {t("MissionImpact.join_traducteur_cta")}
              </Button>
            }
            footerBottom
          >
            <p>{t("MissionImpact.join_traducteur_subtitle")}</p>
          </Card>
        </div>
      </div>
    </Section>
  );
};
