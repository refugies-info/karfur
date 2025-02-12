import { Card } from "@codegouvfr/react-dsfr/Card";
import { useTranslation } from "next-i18next";

const WorkTogether = () => {
  const { t } = useTranslation();

  // "bookAppointment": "Prendre rendez-vous",
  // "participateWebinar": "Participez à un webinaire",
  // "translateContent": "Traduire une fiche",
  // "cards": {
  //   "ts": {
  //     "title": "Travailleurs sociaux ou chefs de centre ?",
  //     "description": "Toutes les semaines, des séances de découverte du service sont organisées pour vous aider à autonomiser vos bénéficiaires et faciliter leur orientation vers des acteurs locaux."
  //   },
  //   "agir": {
  //     "title": "Opérateurs du programme AGIR ?",
  //     "description": "Réfugiés.info est une solution pour animer et cartographier les acteurs locaux avec qui vous travaillez sur vos territoires. Rejoignez une trentaine d’équipes qui utilisent déjà Réfugiés.info au quotidien."
  //   },
  //   "operators": {
  //     "title": "Opérateurs d’État ?",
  //     "description": "Réfugiés.info permet à vos équipes d’accéder à un centre de ressources à jour et local, mais aussi de faciliter l’intégration des nouvelles recrues. 14 opérateurs ont déjà signé un partenariat, rejoignez la prochaine promotion."
  //   },
  //   "administration": {
  //     "title": "Administration ou institution publique ?",
  //     "description": "Vous souhaitez cartographier les acteurs de votre territoire tout en ayant de l’impact et en optimisant vos dépenses ? Réfugiés.info vous aide à vous adresser à vos usagers avec de l’information ciblée et accessible."
  //   },
  //   "structures": {
  //     "title": "Structures porteuses de dispositifs ?",
  //     "description": "Réfugiés.info donne la possibilité de rédiger une fiche explicative de votre action, avec les détails utiles aux bénéficiaires et les modalités d’inscription. Cette fiche sera ensuite publiée sur la plateforme puis traduite en 7 langues. Recensez votre action sur la plateforme."
  //   },
  //   "polyglots": {
  //     "title": "Polyglottes bénévoles ?",
  //     "description": "L’information sur Réfugiés.info est traduite de manière collaborative. Vous maîtrisez une langue disponible sur la plateforme ? Vous pouvez aider à traduire le contenu à votre convenance. Votre travail sera lu par un de nos experts avant d’être publié. Rejoignez la communauté des traducteurs bénévoles."
  //   }
  // }

  const cardsContent = [
    {
      title: t("WorkTogether.cards.ts.title", "Travailleurs sociaux ou chefs de centre ?"),
      description: t(
        "WorkTogether.cards.ts.description",
        "Toutes les semaines, des séances de découverte du service sont organisées pour vous aider à autonomiser vos bénéficiaires et faciliter leur orientation vers des acteurs locaux.",
      ),
      link: "#",
      cta: "lol",
      icon: "lol",
      image: "image",
    },
  ];

  return (
    <section className="py-20" id="work-together">
      <h2 className="text-center">{t("WorkTogether.title", "Travaillons ensemble ! Vous êtes... ?")}</h2>
      <div className="container grid w-full grid-cols-3 items-center gap-10">
        {cardsContent.map((card) => (
          <Card
            key={card.title}
            background
            border
            desc={card.description}
            imageComponent={card.image}
            linkProps={{
              href: card.link,
            }}
            title={card.title}
            titleAs="h3"
          />
        ))}
      </div>
    </section>
  );
};

export default WorkTogether;
