import { Button } from "@codegouvfr/react-dsfr/Button";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import { ReactElement } from "react";
import Page404Layout from "~/components/Layout/Page404Layout";
import SEO from "~/components/Seo";
import { defaultStaticProps } from "~/lib/getDefaultStaticProps";

const NotFound = () => {
  const { t } = useTranslation();

  return (
    <>
      <SEO title={t("404.title", "Erreur 404")} />
      <div className="flex flex-col items-center">
        <h1 className="text-center">{t("404.title", "Erreur 404")}</h1>
        <p className="mb-0 text-center">{t("404.text1", "Oups, un problème est survenu.")} </p>
        <p className="text-center">{t("404.text2", "Le lien est peut-être incorrect ou la page a été déplacée.")}</p>
        <Button className="m-auto" linkProps={{ href: "/" }} iconId="ri-home-4-line" iconPosition="right">
          {t("404.cta", "Retour à la page d’accueil")}
        </Button>
        <Image className="mt-10 md:mt-20" src="/images/404/illustration_404.svg" alt="" width={316} height={224} />
      </div>
    </>
  );
};

NotFound.getLayout = (page: ReactElement) => <Page404Layout>{page}</Page404Layout>;
export const getStaticProps = defaultStaticProps;

export default NotFound;
