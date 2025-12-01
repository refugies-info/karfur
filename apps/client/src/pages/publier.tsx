import Button from "@codegouvfr/react-dsfr/Button";
import { RoleName } from "@refugies-info/api-types";
import { useWindowSize } from "@refugies-info/ui";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useCallback, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import HelpIcon3 from "~/assets/staticPages/common/card-icon-bubble.svg";
import CardIconCalendar from "~/assets/staticPages/common/card-icon-calendar.svg";
import HelpIcon2 from "~/assets/staticPages/common/card-icon-check.svg";
import RequiredIcon3 from "~/assets/staticPages/publier/icon-hands.svg";
import RequiredIcon2 from "~/assets/staticPages/publier/icon-money.svg";
import MockupsRI from "~/assets/staticPages/publier/mockups-ri.png";
import StepImage1 from "~/assets/staticPages/publier/step-image-1.png";
import StepImage2 from "~/assets/staticPages/publier/step-image-2.png";
import StepImage3 from "~/assets/staticPages/publier/step-image-3.png";
import StepImage4 from "~/assets/staticPages/publier/step-image-4.png";
import StepImage5 from "~/assets/staticPages/publier/step-image-5.png";
import StepImage6 from "~/assets/staticPages/publier/step-image-6.png";
import WhyImage1 from "~/assets/staticPages/publier/why-image-1.png";
import WhyImage2 from "~/assets/staticPages/publier/why-image-2.png";
import WhyImage3 from "~/assets/staticPages/publier/why-image-3.png";
import WhyImage4 from "~/assets/staticPages/publier/why-image-4.png";
import WriteContentModal from "~/components/Modals/WriteContentModal/WriteContentModal";
import { HelpNotice } from "~/components/Pages/recherche/HelpNotice";
import {
  Accordion,
  Anchor,
  Card,
  CountUpFigure,
  Hero,
  Register,
  RowCards,
  SecondaryNavbar,
  Section,
  SectionHead,
  StepContent,
  Title2,
  TranslationNotice,
} from "~/components/Pages/staticPages/common";
import { CardExample, TestimonySlider } from "~/components/Pages/staticPages/publier";
import SEO from "~/components/Seo";
import { getLanguageFromLocale } from "~/lib/getLanguageFromLocale";
import { wrapper } from "~/services/configureStore";
import API from "~/utils/API";

export type View = "why" | "required" | "steps" | "faq" | "register";

interface Props {
  nbVues: number;
  nbFiches: number;
  nbStructures: number;
}

const RecensezVotreAction = (props: Props) => {
  const { isTablet } = useWindowSize();

  // write modal
  const [showWriteModal, setShowWriteModal] = useState(false);
  const toggleWriteModal = useCallback(() => {
    setShowWriteModal((o) => !o);
  }, [setShowWriteModal]);

  // active links
  const [activeView, setActiveView] = useState<View | null>(null);
  const [refHero, inViewHero] = useInView({ threshold: 0 });
  const [refWhy, inViewWhy] = useInView({ threshold: 0.2 });
  const [refRequired, inViewRequired] = useInView({ threshold: 0.9 });
  const [refSteps, inViewSteps] = useInView({ threshold: 0.1 });
  const [refFaq, inViewFaq] = useInView({ threshold: 0.4 });
  const [refRegister, inViewRegister] = useInView({ threshold: 0.7 });

  useEffect(() => {
    const views: { inView: boolean; id: View }[] = [
      { inView: inViewWhy, id: "why" },
      { inView: inViewRequired, id: "required" },
      { inView: inViewSteps, id: "steps" },
      { inView: inViewFaq, id: "faq" },
      { inView: inViewRegister, id: "register" },
    ];
    for (const view of views.reverse()) {
      if (view.inView) {
        setActiveView(view.id);
        return;
      }
    }
    setActiveView(null);
  }, [inViewWhy, inViewRequired, inViewSteps, inViewFaq, inViewRegister]);

  return (
    <div className="w-full">
      <SEO title="Recensez votre action !" />
      <HelpNotice />
      <TranslationNotice />

      {/* HERO */}
      <Hero
        ref={refHero}
        title="Recensez votre action !"
        subtitle="Participez à la création d’un outil de référence pour les professionnels de l’accompagnement social et partagez des informations utiles aux personnes réfugiées en France."
        buttonTitle="Rédiger une fiche"
        image={MockupsRI}
        imageWidth={540}
      />

      <SecondaryNavbar
        leftLinks={[
          { id: "why", text: "Pourquoi ?" },
          { id: "required", text: "Quels critères ?" },
          { id: "steps", text: "Comment faire ?" },
          { id: "faq", text: "Foire aux questions" },
        ]}
        rightLink={{
          id: "register",
          text: "Rédiger une fiche",
        }}
        activeView={activeView}
      />

      <div ref={refWhy} className="relative">
        <Anchor id="why" />
        {/* WHY */}
        <Section>
          <div className="fr-container">
            <Title2 className="!text-left">Pourquoi recenser mon action sur Réfugiés.info ?</Title2>
            <Accordion
              items={[
                {
                  title: "Bénéficiez d'un outil gratuit et traduit",
                  text: "Une fois rédigée, la fiche de votre action sera relue et simplifiée, traduite gratuitement en 7 langues, vocalisée et facilement partageable. Elle sera visible dans une application adaptée aux usages numériques des personnes réfugiées.",
                  image: WhyImage1,
                  mediaWidth: 400,
                  mediaHeight: 320,
                },
                {
                  title: "Donnez de la visibilité à votre action",
                  text: "Réfugiés.info est utilisé comme une source d'information de référence par des milliers de bénévoles, professionnels et personnes réfugiées. En 2024, Réfugiés.info a été consulté par 1,2 million d'internautes.",
                  image: WhyImage2,
                  mediaWidth: 400,
                  mediaHeight: 320,
                },
                {
                  title: "Recevez des candidatures adaptées",
                  text: "Les fiches sont standardisées pour faciliter la compréhension : à qui s'adresse l’action, en quoi consiste-t-elle, quels sont les critères d’accès et comment s’inscrire ou candidater. Ainsi, les utilisateurs choisissent plus facilement et consciemment quelle organisation solliciter.",
                  image: WhyImage3,
                  mediaWidth: 400,
                  mediaHeight: 320,
                },
                {
                  title: "Participez à un service public ouvert",
                  text: "Rejoignez un réseau d’acteurs engagés pour l’accès aux droits et à l’information des personnes réfugiées. Contribuez à la création d’une source commune d’information utile à toutes et tous.",
                  image: WhyImage4,
                  mediaWidth: 400,
                  mediaHeight: 320,
                },
              ]}
              withImages
              initOpen
              multiOpen={!!isTablet}
              mediaAlign="center"
              className="min-h-[480px]"
            />
          </div>
        </Section>

        {/* TESTIMONY */}
        <Section className="bg-action-low-blue-france">
          <div className="fr-container">
            <Title2>La parole aux porteurs de dispositifs</Title2>
            <TestimonySlider
              testimonies={[
                {
                  text: "« J’ai eu le plaisir de découvrir Réfugiés.info en 2021 et d’en constater toute l’étendue et l’utilité pour les personnes que nous accompagnons dans le cadre de notre dispositif sur le département de Loire-Atlantique. Le résultat final est impressionnant ! »",
                  name: "Vincent Le Lann",
                  position: "Compagnons du Tour de France à Nantes",
                },
                {
                  text: "« Réfugiés.info est un très bon site ressource, très complet, qui balaye de nombreuses thématiques, facile d’accès et intuitif. Un bon complément à mes connaissances actuelles. Les acteurs sont bien accompagnés dans la construction de fiches. »",
                  name: "Rémi Crouzel",
                  position: "Mission Locale de Dijon & Conseiller IPeRACTIFS21",
                },
                {
                  text: "« UniR partage toutes ses actions sur la plateforme Réfugiés.info. C'est très intuitif à utiliser et ça permet de mettre en avant les informations clés sur chaque programme. À chaque nouvelle session, nous mettons à jour seulement les cases concernées et cela maintient nos informations accessibles à toutes et tous ! »",
                  name: "Paola Salazar",
                  position: "Directrice adjointe UniR",
                },
              ]}
            />
          </div>
        </Section>
      </div>

      {/* REQUIRED */}
      <Section ref={refRequired} className="relative">
        <Anchor id="required" />
        <div className="fr-container">
          <Title2>Mon action peut-elle être recensée ?</Title2>
          <RowCards>
            <Card
              image={CardIconCalendar}
              title="Pérenne"
              footer={
                <CardExample exampleKo="Une journée porte ouverte" exampleOk="Des sessions annuelles de formation" />
              }
            >
              <p>
                Votre action doit être accessible tout le temps ou de façon récurrente. Elle ne doit pas avoir lieu une
                seule et unique fois.
              </p>
            </Card>

            <Card
              image={RequiredIcon2}
              title="À but non lucratif"
              footer={
                <CardExample exampleKo="Un service qui génère des bénéfices" exampleOk="Une formation certifiante" />
              }
            >
              <p>
                L’action peut être payante à l’inscription, mais ne doit pas vendre des services ou des objets à but
                lucratif.
              </p>
            </Card>

            <Card
              image={RequiredIcon3}
              title="Adaptée au public"
              footer={
                <CardExample exampleKo="Une formation généraliste" exampleOk="Une formation avec cours de français" />
              }
            >
              <p>
                L’action doit prendre en compte les spécificités du public : la langue, la situation administrative
                personnelle, la disponibilité...
              </p>
            </Card>
          </RowCards>
          <div className="mt-10 text-center lg:mt-20">
            <Button
              priority="tertiary no outline"
              linkProps={{
                href: "https://help.refugies.info/fr/article/charte-editoriale-comment-bien-rediger-une-fiche-1twbzhu/",
              }}
              iconId="fr-icon-arrow-right-line"
              iconPosition="right"
              size="large"
            >
              Lire la charte éditoriale complète
            </Button>
          </div>
        </div>
      </Section>

      <div ref={refSteps} className={"relative"}>
        <Anchor id="steps" />
        {/* STEPS */}
        <Section className="bg-alt-beige-gris-galet">
          <div className="fr-container">
            <Title2>Quelles sont les étapes pour publier une fiche ?</Title2>
            <StepContent
              step={1}
              title="Créez votre compte Réfugiés.info"
              texts={[
                "Chaque compte est personnel. Vos collègues pourront aussi créer leur propre compte pour modifier les fiches de votre structure.",
              ]}
              cta={{ text: "Créer mon compte", link: "#register" }}
              image={StepImage1}
              width={440}
            />
            <StepContent
              step={2}
              title="Rédigez votre fiche"
              texts={[
                "Vous vous adressez à des personnes réfugiées ou des personnes les aidant dans leur recherche.",
                "Le niveau de langue étant très variable, le contenu de votre fiche doit donc être synthétique et vulgarisé.",
              ]}
              cta={{
                text: "Voir les bonnes pratiques",
                link: "https://help.refugies.info/fr/category/charte-editoriale-2fq3x7/",
              }}
              image={StepImage2}
              width={440}
            />
            <StepContent
              step={3}
              title="Ajoutez la structure responsable"
              texts={[
                "À la fin de votre rédaction, précisez la structure responsable de cette action : la vôtre ou une organisation amie que vous souhaitez recenser vous-même.",
              ]}
              image={StepImage3}
              width={440}
            />
            <StepContent
              step={4}
              title="L’équipe éditoriale de Réfugiés.info relit et publie votre fiche"
              texts={[
                "Notre équipe éditoriale relit votre fiche et vous contacte s’il manque des informations essentielles.",
                "Vous êtes informé par email lorsque la fiche est visible par les utilisateurs.",
              ]}
              image={StepImage4}
              buttonStep="Votre fiche est publiée ! 🎉"
              width={440}
            />
            <StepContent
              step={5}
              title="Traduction en 7 langues de votre fiche"
              texts={[
                "Votre fiche est traduite par de vrais humains. Nous nous appuyons sur un réseau de bénévoles et d’experts linguistes pour traduire et vulgariser l’information dans un langage adapté aux personnes réfugiées.",
                "Vos actions sont ainsi traduites gratuitement en 7 langues : anglais, arabe, pachto, persan/dari, tigrinya, ukrainien et russe.",
              ]}
              image={StepImage5}
              width={440}
            />
            <StepContent
              step={6}
              title="Mettez à jour votre action régulièrement"
              texts={[
                "Votre action peut rapidement évoluer (dates des sessions de formation, formulaires de candidature, fréquence des cours de français, etc.), vous êtes garant de la mise à jour des informations.",
                "Attention, une action obsolète sera supprimée par l’équipe éditoriale.",
              ]}
              image={StepImage6}
              dottedLine
              width={336}
            />
          </div>
        </Section>
      </div>

      <div ref={refFaq} className="relative">
        {/* HELP */}
        <Section>
          <div className="fr-container">
            <SectionHead
              title="Vous n’êtes pas seul !"
              subtitle="Nous sommes là pour vous accompagner dans la rédaction et la mise à jour de votre fiche."
            />
            <RowCards>
              <Card image={CardIconCalendar} title="Séances découverte" link="https://kit.refugies.info/formation">
                <p className="mb-0">Profitez d’un webinaire de présentation de la plateforme.</p>
              </Card>

              <Card image={HelpIcon2} title="Tutoriels et centre d’aide" link="https://help.refugies.info/fr/">
                <p className="mb-0">
                  L’interface propose des tutoriels explicatifs et le centre d’aide contient de nombreux articles pour
                  vous accompagner pendant la rédaction de votre fiche.
                </p>
              </Card>

              <Card image={HelpIcon3} title="Live chat" onClick={() => window.$crisp.push(["do", "chat:open"])}>
                <p className="mb-0">
                  Le live chat est accessible en bas à droite de votre écran (deux jours par semaine). Posez toutes vos
                  questions : nous sommes réactifs et c’est un vrai humain qui traite vos demandes !
                </p>
              </Card>
            </RowCards>
          </div>
        </Section>

        {/* FIGURES */}
        <Section className="bg-action-low-blue-france">
          <div className="fr-container">
            <Title2 className="text-center">Rejoignez un projet collaboratif de grande envergure</Title2>
            <div className="flex flex-col justify-center gap-10 lg:flex-row lg:gap-20">
              <CountUpFigure number={props.nbFiches} text="fiches publiées" />
              <CountUpFigure number={props.nbStructures} text="structures inscrites" />
              <CountUpFigure number={props.nbVues} text="vues sur les fiches" />
            </div>
          </div>
        </Section>

        {/* FAQ */}
        <Section className="relative">
          <Anchor id="faq" />
          <div className="fr-container">
            <Title2 className="text-center">Il vous reste des questions ?</Title2>
            <div className="mx-auto max-w-[720px]">
              <Accordion
                items={[
                  {
                    title: "Pourquoi je dois écrire moi-même la fiche ?",
                    text: "Réfugiés.info est un outil collaboratif. Ce modèle est essentiel pour assurer la pérennité des informations proposées. En effet, en tant que membre d'une structure qui propose une action, vous êtes le mieux placé pour décrire et mettre à jour le programme, les dates, les critères d'éligibilité... Ainsi, les personnes concernées ont un accès immédiat et durable aux informations importantes.",
                  },
                  {
                    title: "Je ne suis pas à l'aise avec le numérique, est-ce facile ?",
                    text: "Nous avons conçu cet outil avec des utilisateurs afin d’assurer l’expérience la plus fluide et intuitive possible. Des tutoriels sont là pour vous guider tout au long de l’expérience. Et si vous avez une question ou une remarque, n'hésitez pas à nous contacter directement via le live chat en bas à droite de l'écran (disponible 2 jours par semaine). Nous nous ferons une joie de vous aider !",
                  },
                  {
                    title: "En combien de temps ma fiche sera publiée ?",
                    text: "Dès que notre équipe éditoriale est informée de la création d'une nouvelle fiche, elle se charge de la relire afin de vérifier la cohérence avec la charte éditoriale. Vous serez contacté s'il manque des informations essentielles ou si une simplification est nécessaire. Votre fiche sera ensuite publiée et vous recevrez un mail de confirmation. Quelques semaines plus tard, celle-ci sera traduite en 7 autres langues par nos bénévoles avant d’être validée par nos experts traducteurs.",
                  },
                  {
                    title: "Est-ce que je peux écrire une fiche pour une structure dont je ne fais pas partie ?",
                    text: "Vous avez la possibilité de rédiger une fiche sans faire partie de la structure citée. Après avoir rédigé la fiche, il suffira de nous transmettre les coordonnées de l'interlocuteur. Nous nous chargerons de le contacter afin qu'il ou elle reprenne la main sur la fiche.",
                  },
                  {
                    title: "Pourquoi est-il nécessaire de simplifier le contenu de ma fiche ?",
                    text: "La grande majorité des utilisateurs de la plateforme est allophone (leur langue maternelle n'est pas le français), et rencontre donc souvent des difficultés pour lire des contenus. À cela s'ajoutent une faible disponibilité cognitive et une méconnaissance du système français. Il apparaît ainsi essentiel de proposer des contenus synthétiques, structurés, actualisés et faciles à comprendre, dans une démarche d'autonomisation des personnes réfugiées dans leurs parcours d'intégration.",
                  },
                ]}
                multiOpen
              />
            </div>
            <div className="mt-10 text-center lg:mt-20">
              <Button
                priority="tertiary no outline"
                linkProps={{
                  href: "https://help.refugies.info/fr/",
                }}
                iconId="fr-icon-arrow-right-line"
                iconPosition="right"
                size="large"
              >
                Voir le centre d’aide
              </Button>
            </div>
          </div>
        </Section>
      </div>

      {/* REGISTER */}
      <Section ref={refRegister} className="bg-alt-beige-gris-galet relative">
        <Anchor id="register" />
        <div className="fr-container">
          <Register
            onClickLoggedIn={toggleWriteModal}
            subtitleForm="Connectez-vous ou créez votre compte pour démarrer la rédaction de votre fiche."
            subtitleLoggedIn="Vous savez tout, vous pouvez rédiger votre première fiche."
            btnLoggedIn="Rédiger une fiche"
            subtitleMobile="La rédaction d’une fiche n’est possible que depuis un ordinateur. Nous pouvons vous envoyer un mail pour vous inscrire !"
            associatedRole={RoleName.CONTRIB}
          />
        </div>
      </Section>

      <WriteContentModal show={showWriteModal} close={() => setShowWriteModal(false)} />
    </div>
  );
};

export const getStaticProps = wrapper.getStaticProps((store) => async ({ locale }) => {
  const dispStatistics = await API.getDispositifsStatistics({
    facets: ["nbVues", "nbVuesMobile", "nbDispositifs", "nbDemarches"],
  });
  const structStatistics = await API.getStructuresStatistics({ facets: ["nbStructures"] });

  return {
    props: {
      ...(await serverSideTranslations(getLanguageFromLocale(locale), ["common"])),
      nbVues: (dispStatistics.nbVues || 0) + (dispStatistics.nbVuesMobile || 0),
      nbFiches: (dispStatistics.nbDispositifs || 0) + (dispStatistics.nbDemarches || 0),
      nbStructures: structStatistics.nbStructures,
    },
    revalidate: 60,
  };
});

export default RecensezVotreAction;
