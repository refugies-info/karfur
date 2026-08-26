import Button from "@codegouvfr/react-dsfr/Button";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import FreeResourcesImg from "~/assets/homepage/free-resources.png";
import Image from "~/components/UI/Image";

const FreeResources = () => {
  const { t } = useTranslation();

  return (
    <section className="bg-alt-blue-france w-full py-10 md:py-20" id="free-ressources">
      {/* grid-cols-2 n'avait aucune variante : la section n'etant rendue qu'au-dessus
          de 768 px, le cas ne se posait pas. A 320 px cela donnait deux colonnes de
          124 px (RGAA 10.11). */}
      <div className="container grid grid-cols-1 items-center gap-10 md:grid-cols-2">
        <div>
          <h2>{t("Homepage.resourcesTitle", "Des ressources gratuites à votre disposition")}</h2>
          <p>
            {t(
              "Homepage.resourcesText",
              "Nous vous fournissons un ensemble d’outils numériques et physiques pour découvrir le projet et en parler autour de vous : vidéos animées, flyers multilangues, brochures de présentation, visuels, etc.",
            )}
          </p>
          <div className="flex flex-col gap-4">
            <Button
              linkProps={{
                href: "https://kit.refugies.info/formation/",
                target: "_blank",
                rel: "noopener noreferrer",
              }}
              iconId="fr-icon-arrow-right-line"
              iconPosition="right"
            >
              {t("Homepage.webinaireCTA", "Participer à un webinaire")}
            </Button>
            <Button
              linkProps={{
                href: "https://kit.refugies.info/",
                target: "_blank",
                rel: "noopener noreferrer",
              }}
              iconId="fr-icon-arrow-right-line"
              iconPosition="right"
              priority="tertiary"
            >
              {t("Homepage.resourcesCTA", "Voir les outils")}
            </Button>
          </div>
        </div>
        <Link href="https://kit.refugies.info/" target="_blank" rel="noopener noreferrer">
          <Image
            src={FreeResourcesImg}
            alt={t("Homepage.ressourcesImgAlt", "Kit de communication de Réfugiés.info")}
            width={576}
            height={362}
          />
        </Link>
      </div>
    </section>
  );
};

export default FreeResources;
