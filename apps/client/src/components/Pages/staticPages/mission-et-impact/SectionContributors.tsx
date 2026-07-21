import Badge from "@codegouvfr/react-dsfr/Badge";
import Image from "next/image";
import { useTranslation } from "next-i18next";
import CommunityIlluAmbassadeurs from "~/assets/staticPages/mission-et-impact/community-ambassadeurs.png";
import CommunityIlluCda from "~/assets/staticPages/mission-et-impact/community-cda.png";
import CommunityIlluDinum from "~/assets/staticPages/mission-et-impact/community-dinum.png";
import CommunityIlluDispositifs from "~/assets/staticPages/mission-et-impact/community-dispositifs.png";
import CommunityIlluExperts from "~/assets/staticPages/mission-et-impact/community-experts.png";
import CommunityIlluInfluenceurs from "~/assets/staticPages/mission-et-impact/community-influenceurs.png";
import CommunityIlluPartenaires from "~/assets/staticPages/mission-et-impact/community-partenaires.png";
import CommunityIlluTesteurs from "~/assets/staticPages/mission-et-impact/community-testeurs.png";
import CommunityIlluTraducteurs from "~/assets/staticPages/mission-et-impact/community-traducteurs.png";
import { Card, Section, Title2 } from "~/components/Pages/staticPages/common";
import { ImageCustomFigure } from "~/components/Pages/staticPages/mission-et-impact/ImageCustomFigure";

interface Props {
  nbDispositifPorteurs: number;
  nbCDA: number;
  nbTranslators: number;
}

export const SectionContributors = (props: Props) => {
  const { t } = useTranslation();
  return (
    <Section className="bg-alt-blue-france">
      <div className="container">
        <Title2 className="text-center">{t("MissionImpact.community_title")}</Title2>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
          <Card
            imageComponent={
              <div className="relative inline-block">
                <Image
                  src={CommunityIlluDispositifs}
                  alt=""
                  width={240}
                  height={80}
                  style={{ objectFit: "contain" }}
                />
                <ImageCustomFigure>{props.nbDispositifPorteurs}</ImageCustomFigure>
              </div>
            }
            title={t("MissionImpact.community_dispositifs_title")}
            footer={
              <Badge severity="new" noIcon>
                {t("MissionImpact.community_tag_redaction")}
              </Badge>
            }
            footerBottom
          >
            <p>{t("MissionImpact.community_dispositifs_subtitle")}</p>
          </Card>
          <Card
            imageComponent={
              <div className="relative inline-block">
                <Image
                  src={CommunityIlluCda}
                  alt=""
                  width={240}
                  height={80}
                  style={{ objectFit: "contain" }}
                />
                <ImageCustomFigure>{props.nbCDA}</ImageCustomFigure>
              </div>
            }
            title={t("MissionImpact.community_cda_title")}
            footer={
              <Badge severity="new" noIcon>
                {t("MissionImpact.community_tag_redaction")}
              </Badge>
            }
            footerBottom
          >
            <p>{t("MissionImpact.community_cda_subtitle")}</p>
          </Card>
          <Card
            imageComponent={
              <div className="relative inline-block">
                <Image
                  src={CommunityIlluTraducteurs}
                  alt=""
                  width={232}
                  height={80}
                  style={{ objectFit: "contain" }}
                />
                <ImageCustomFigure>{props.nbTranslators}</ImageCustomFigure>
              </div>
            }
            title={t("MissionImpact.community_traducteurs_title")}
            footer={
              <Badge severity="info" noIcon>
                {t("MissionImpact.community_tag_traduction")}
              </Badge>
            }
            footerBottom
          >
            <p>{t("MissionImpact.community_traducteurs_subtitle")}</p>
          </Card>
          <Card
            image={CommunityIlluExperts}
            imageWidth={240}
            title={t("MissionImpact.community_experts_title")}
            footer={
              <Badge severity="info" noIcon>
                {t("MissionImpact.community_tag_traduction")}
              </Badge>
            }
            footerBottom
          >
            <p>{t("MissionImpact.community_experts_subtitle")}</p>
          </Card>
          <Card
            image={CommunityIlluAmbassadeurs}
            imageWidth={232}
            title={t("MissionImpact.community_ambassadeurs_title")}
            footer={
              <Badge
                noIcon
                className="bg-artwork-minor-purple-glycine/10 text-action-high-purple-glycine"
              >
                {t("MissionImpact.community_tag_deploiement")}
              </Badge>
            }
            footerBottom
          >
            <p>{t("MissionImpact.community_ambassadeurs_subtitle")}</p>
          </Card>
          <Card
            image={CommunityIlluInfluenceurs}
            imageWidth={232}
            title={t("MissionImpact.community_influenceurs_title")}
            footer={
              <Badge
                noIcon
                className="bg-artwork-minor-purple-glycine/10 text-action-high-purple-glycine"
              >
                {t("MissionImpact.community_tag_deploiement")}
              </Badge>
            }
            footerBottom
          >
            <p>{t("MissionImpact.community_influenceurs_subtitle")}</p>
          </Card>
          <Card
            image={CommunityIlluPartenaires}
            imageWidth={240}
            title={t("MissionImpact.community_partenaires_title")}
            footer={
              <Badge
                noIcon
                className="bg-artwork-minor-purple-glycine/10 text-action-high-purple-glycine"
              >
                {t("MissionImpact.community_tag_deploiement")}
              </Badge>
            }
            footerBottom
          >
            <p>{t("MissionImpact.community_partenaires_subtitle")}</p>
          </Card>
          <Card
            image={CommunityIlluTesteurs}
            imageWidth={232}
            title={t("MissionImpact.community_testeurs_title")}
            footer={
              <Badge severity="success" noIcon>
                {t("MissionImpact.community_tag_produit")}
              </Badge>
            }
            footerBottom
          >
            <p>{t("MissionImpact.community_testeurs_subtitle")}</p>
          </Card>
          <Card
            image={CommunityIlluDinum}
            title={t("MissionImpact.community_dinum_title")}
            footer={
              <Badge severity="warning" noIcon>
                {t("MissionImpact.community_tag_pilotage")}
              </Badge>
            }
            footerBottom
          >
            <p>{t("MissionImpact.community_dinum_subtitle")}</p>
          </Card>
        </div>
      </div>
    </Section>
  );
};
