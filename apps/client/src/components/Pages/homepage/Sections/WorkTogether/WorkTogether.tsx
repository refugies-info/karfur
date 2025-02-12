import { FrIconClassName, RiIconClassName } from "@codegouvfr/react-dsfr";
import Button from "@codegouvfr/react-dsfr/Button";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import AgirLogos from "~/assets/agir/agir-logos.png";
import Structures from "~/assets/homepage/structures.png";
import Avatar from "~/assets/pictogrammes/avatar.svg";
import CityHall from "~/assets/pictogrammes/city-hall.svg";
import Community from "~/assets/pictogrammes/community.svg";
import LocationFrance from "~/assets/pictogrammes/location-france.svg";

type cardContentItemType = {
  title: string;
  description: string;
  link: string;
  icon: FrIconClassName | RiIconClassName;
  cta: string;
  image: any;
};

const WorkTogether = () => {
  const { t } = useTranslation();

  const cardsContent: cardContentItemType[] = [
    {
      title: t("WorkTogether.cards.ts.title", "Travailleurs sociaux ou chefs de centre ?"),
      description: t(
        "WorkTogether.cards.ts.description",
        "Toutes les semaines, des séances de découverte du service sont organisées pour vous aider à autonomiser vos bénéficiaires et faciliter leur orientation vers des acteurs locaux.",
      ),
      link: " https://airtable.com/shrrkFuyeG0BpKKT7",
      cta: t("WorkTogether.bookAppointment", "Prendre rendez-vous"),
      icon: "fr-icon-arrow-right-line",
      image: <Image src={Avatar} alt="" />,
    },
    {
      title: t("WorkTogether.cards.agir.title", "Opérateurs du programme AGIR ?"),
      description: t(
        "WorkTogether.cards.agir.description",
        "Réfugiés.info est une solution pour animer et cartographier les acteurs locaux avec qui vous travaillez sur vos territoires. Rejoignez une trentaine d’équipes qui utilisent déjà Réfugiés.info au quotidien.",
      ),
      link: "https://calendly.com/nour-refugies-info/rdv-ambassadeur-de-refugies-info",
      cta: t("WorkTogether.participateWebinar", "Participez à un webinaire"),
      icon: "fr-icon-calendar-event-line",
      image: (
        <span className="flex h-20 w-20 items-center justify-center bg-black p-1">
          <Image src={AgirLogos} alt="" />{" "}
        </span>
      ),
    },
    {
      title: t("WorkTogether.cards.operators.title", "Opérateurs d’État ?"),
      description: t(
        "WorkTogether.cards.operators.description",
        "Réfugiés.info permet à vos équipes d’accéder à un centre de ressources à jour et local, mais aussi de faciliter l’intégration des nouvelles recrues. 14 opérateurs ont déjà signé un partenariat, rejoignez la prochaine promotion.",
      ),
      link: "https://calendly.com/nour-refugies-info/rdv-ambassadeur-de-refugies-info",
      cta: t("WorkTogether.bookAppointment", "Prendre rendez-vous"),
      icon: "fr-icon-calendar-event-line",
      image: <Image src={Structures} alt="" width={240} height={80} />,
    },
    {
      title: t("WorkTogether.cards.administration.title", "Administration ou institution publique ?"),
      description: t(
        "WorkTogether.cards.administration.description",
        "Vous souhaitez cartographier les acteurs de votre territoire tout en ayant de l’impact et en optimisant vos dépenses ? Réfugiés.info vous aide à vous adresser à vos usagers avec de l’information ciblée et accessible.",
      ),
      link: "https://calendly.com/nour-refugies-info/rdv-ambassadeur-de-refugies-info",
      cta: t("WorkTogether.bookAppointment", "Prendre rendez-vous"),
      icon: "fr-icon-calendar-event-line",
      image: <Image src={CityHall} alt="" />,
    },
    {
      title: t("WorkTogether.cards.structures.title", "Structures porteuses de dispositifs ?"),
      description: t(
        "WorkTogether.cards.structures.description",
        "Réfugiés.info donne la possibilité de rédiger une fiche explicative de votre action, avec les détails utiles aux bénéficiaires et les modalités d’inscription. Cette fiche sera ensuite publiée sur la plateforme puis traduite en 7 langues. Recensez votre action sur la plateforme.",
      ),
      link: "https://refugies.info/publier",
      cta: t("WorkTogether.translateContent", "Traduire une fiche"),
      icon: "fr-icon-arrow-right-line",
      image: <Image src={LocationFrance} alt="" />,
    },
    {
      title: t("WorkTogether.cards.polyglots.title", "Polyglottes bénévoles ?"),
      description: t(
        "WorkTogether.cards.polyglots.description",
        "L’information sur Réfugiés.info est traduite de manière collaborative. Vous maîtrisez une langue disponible sur la plateforme ? Vous pouvez aider à traduire le contenu à votre convenance. Votre travail sera lu par un de nos experts avant d’être publié. Rejoignez la communauté des traducteurs bénévoles.",
      ),
      link: "https://refugies.info/traduire",
      cta: t("WorkTogether.participateWebinar", "Participez à un webinaire"),
      icon: "fr-icon-arrow-right-line",
      image: <Image src={Community} alt="" />,
    },
  ];

  return (
    <section className="flex flex-col gap-20 py-20" id="work-together">
      <h2 className="mb-0 text-center">{t("WorkTogether.title", "Travaillons ensemble ! Vous êtes... ?")}</h2>
      <div className="container grid max-w-screen grid-cols-2 items-center gap-10 max-xl:w-[50.5rem] xl:w-full xl:grid-cols-3">
        {cardsContent.map(({ title, description, link, cta, icon, image }) => (
          <div key={title} className="border-gray h-full border p-8">
            <div className="flex h-full flex-col gap-4">
              {image}
              <h3 className="text-blue-france mb-0 text-lg" dangerouslySetInnerHTML={{ __html: title }} />
              <p className="mb-0">{description}</p>

              <Button
                linkProps={{
                  href: link,
                  target: link.startsWith("https://refugies.info/") ? undefined : "_blank",
                }}
                iconId={icon}
                iconPosition="right"
                priority="tertiary"
                className="mt-auto"
              >
                {cta}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WorkTogether;
