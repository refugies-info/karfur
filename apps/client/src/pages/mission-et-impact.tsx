import { NextPage } from "next";
import { useTranslation } from "next-i18next";
import SEO from "~/components/Seo";
import { defaultStaticProps } from "~/lib/getDefaultStaticProps";

const MissionImpact: NextPage = () => {
  const { t } = useTranslation();
  return (
    <div>
      <SEO title="Qui sommes nous ?" />
    </div>
  );
};

export const getStaticProps = defaultStaticProps;

export default MissionImpact;
