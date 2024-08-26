import CommunityAmbassadeurs from "@/assets/homepage/community-ambassadeurs.png";
import CommunityCda from "@/assets/homepage/community-cda.png";
import CommunityEquipe from "@/assets/homepage/community-equipe.png";
import CommunityExperts from "@/assets/homepage/community-experts.png";
import CommunityInfluenceurs from "@/assets/homepage/community-influenceurs.png";
import CommunityRedacteurs from "@/assets/homepage/community-redacteurs.png";
import CommunityStructures from "@/assets/homepage/community-structures.png";
import CommunityTesteurs from "@/assets/homepage/community-testeurs.png";
import CommunityTraducteurs from "@/assets/homepage/community-traducteurs.png";
import { cls } from "@/lib/classname";
import commonStyles from "@/scss/components/staticPages.module.scss";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { Container } from "reactstrap";
import { getPath } from "routes";
import CommunityCard from "../../CommunityCard";
import styles from "./Community.module.scss";

interface Props {
  nbRedactors: number;
  nbStructureAdmins: number;
  nbCDA: number;
  nbTranslators: number;
}

const Community = (props: Props) => {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <div className={cls(commonStyles.section)}>
      <Container className={cls(commonStyles.container, "text-center")}>
        <h2 className={cls(commonStyles.title2, styles.title, commonStyles.center)}>{t("Homepage.communityTitle")}</h2>

        <div className={styles.row}>
          <CommunityCard
            title={t("Homepage.communityCardTitle1")}
            subtitle={t("Homepage.communityCardSubtitle1")}
            badge={t("Homepage.communityCardBadge1")}
            image={CommunityRedacteurs}
            color="red"
            countImage={props.nbRedactors - 3}
            cta={t("Homepage.communityCardCTA2")}
            link={getPath("/publier", router.locale)}
          />
          <CommunityCard
            title={t("Homepage.communityCardTitle2")}
            subtitle={t("Homepage.communityCardSubtitle2")}
            badge={t("Homepage.communityCardBadge1")}
            image={CommunityStructures}
            color="red"
            countImage={props.nbStructureAdmins - 3}
            cta={t("Homepage.communityCardCTA2")}
            link={getPath("/publier", router.locale)}
          />
          <CommunityCard
            title={t("Homepage.communityCardTitle3")}
            subtitle={t("Homepage.communityCardSubtitle3")}
            badge={t("Homepage.communityCardBadge3")}
            image={CommunityCda}
            color="red"
            countImage={props.nbCDA - 3}
          />
          <CommunityCard
            title={t("Homepage.communityCardTitle4")}
            subtitle={t("Homepage.communityCardSubtitle4")}
            badge={t("Homepage.communityCardBadge4")}
            image={CommunityTraducteurs}
            color="green"
            countImage={props.nbTranslators - 3}
            cta={t("Toolbar.Traduire")}
            link={getPath("/traduire", router.locale)}
          />
          <CommunityCard
            title={t("Homepage.communityCardTitle5")}
            subtitle={t("Homepage.communityCardSubtitle5")}
            badge={t("Homepage.communityCardBadge5")}
            image={CommunityExperts}
            color="green"
            countImage={4}
          />
          <CommunityCard
            title={t("Homepage.communityCardTitle6")}
            subtitle={t("Homepage.communityCardSubtitle6")}
            badge={t("Homepage.communityCardBadge6")}
            image={CommunityAmbassadeurs}
            color="purple"
            countImage={20}
          />
          <CommunityCard
            title={t("Homepage.communityCardTitle7")}
            subtitle={t("Homepage.communityCardSubtitle7")}
            badge={t("Homepage.communityCardBadge7")}
            image={CommunityInfluenceurs}
            color="purple"
            countImage={1}
          />
          <CommunityCard
            title={t("Homepage.communityCardTitle8")}
            subtitle={t("Homepage.communityCardSubtitle8")}
            badge={t("Homepage.communityCardBadge8")}
            image={CommunityTesteurs}
            color="brown"
            countImage={80}
          />
          <CommunityCard
            title={t("Homepage.communityCardTitle9")}
            subtitle={t("Homepage.communityCardSubtitle9")}
            badge={t("Homepage.communityCardBadge9")}
            image={CommunityEquipe}
            color="blue"
            countImage={9}
            cta={t("who_are_we")}
            link={getPath("/qui-sommes-nous", router.locale)}
          />
        </div>
      </Container>
    </div>
  );
};

export default Community;
