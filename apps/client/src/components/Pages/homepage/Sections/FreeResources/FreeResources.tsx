import Button from "@codegouvfr/react-dsfr/Button";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import FreeResourcesImg from "~/assets/homepage/free-resources.png";
import Image from "~/components/UI/Image";

const FreeResources = () => {
  const { t } = useTranslation();

  return (
    <section className="bg-light-alt-blue w-full py-20" id="free-ressources">
      <div className="container grid grid-cols-2 items-center gap-10">
        <div>
          <h2>{t("Homepage.resourcesTitle")}</h2>
          <p>{t("Homepage.resourcesText")}</p>
          <div>
            <Button
              onClick={() => window.open("https://kit.refugies.info/", "_blank")}
              iconId="fr-icon-arrow-right-line"
              iconPosition="right"
              priority="tertiary"
            >
              {t("Homepage.resourcesCTA")}
            </Button>
          </div>
        </div>
        <div>
          <Link href="https://kit.refugies.info/" target="_blank" rel="noopener noreferrer">
            <Image src={FreeResourcesImg} alt={t("Homepage.resourcesTitle")} width={576} height={362} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FreeResources;
