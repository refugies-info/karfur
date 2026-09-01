import { RoleName, type TranslationStatisticsResponse } from "@refugies-info/api-types";
import { logger } from "logger";
import Image from "next/image";
import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useInView } from "react-intersection-observer";
import WhoIcon1 from "~/assets/staticPages/common/card-icon-bubble.svg";
import CardIconCheck from "~/assets/staticPages/common/card-icon-check.svg";
import StepImage1 from "~/assets/staticPages/publier/step-image-1.png";
import StepImage4 from "~/assets/staticPages/publier/step-image-5.png";
import MockupRI from "~/assets/staticPages/traduire/mockup-ri.png";
import ShareImage from "~/assets/staticPages/traduire/share-image.svg";
import StepImage2 from "~/assets/staticPages/traduire/step-image-2.svg";
import StepImage3 from "~/assets/staticPages/traduire/step-image-3.png";
import WhoIcon3 from "~/assets/staticPages/traduire/who-icon-3.svg";
import { HelpNotice } from "~/components/Pages/recherche/HelpNotice";
import {
  Accordion,
  Anchor,
  Card,
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
import LanguageCard from "~/components/Pages/staticPages/traduire/LanguageCard";
import SEO from "~/components/Seo";
import { getLanguageFromLocale } from "~/lib/getLanguageFromLocale";
import { wrapper } from "~/services/configureStore";
import API from "~/utils/API";

export type View = "who" | "steps" | "next" | "faq" | "register";
export type NeedKey = "strong" | "medium" | "weak";
const NEED_ORDER: Record<NeedKey, number> = { strong: 0, medium: 1, weak: 2 };

interface Props {
  translationStatistics: TranslationStatisticsResponse;
}

const RecensezVotreAction = (props: Props) => {
  const router = useRouter();

  // active links
  const [activeView, setActiveView] = useState<View | null>(null);
  const [refHero, inViewHero] = useInView({ threshold: 0 });
  const [refWho, inViewWho] = useInView({ threshold: 0.1 });
  const [refSteps, inViewSteps] = useInView({ threshold: 0.05 });
  const [refNext, inViewNext] = useInView({ threshold: 0.1 });
  const [refFaq, inViewFaq] = useInView({ threshold: 0.1 });
  const [refRegister, inViewRegister] = useInView({ threshold: 0.5 });

  useEffect(() => {
    const views: { inView: boolean; id: View }[] = [
      { inView: inViewWho, id: "who" },
      { inView: inViewSteps, id: "steps" },
      { inView: inViewNext, id: "next" },
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
  }, [inViewWho, inViewNext, inViewSteps, inViewFaq, inViewRegister]);

  // stats
  const translationNeeds: { languageId: string; count: number; need: NeedKey }[] = useMemo(
    () =>
      (props.translationStatistics?.nbActiveTranslators || [])
        .map((stat) => {
          if (stat.count <= 2) return { ...stat, need: "strong" as NeedKey };
          if (stat.count > 2 && stat.count <= 5) return { ...stat, need: "medium" as NeedKey };
          return { ...stat, need: "weak" as NeedKey };
        })
        .sort((a, b) => NEED_ORDER[a.need] - NEED_ORDER[b.need]),
    [props],
  );

  const navigateToTranslations = useCallback(() => {
    router.push("/backend/user-translation");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full">
      <SEO title="Aidez-nous à traduire !" />
      <HelpNotice />
      <TranslationNotice />

      {/* HERO */}
      <Hero
        ref={refHero}
        title="Aidez-nous à traduire !"
        subtitle={`${props.translationStatistics?.nbTranslators || 0} bénévoles nous ont déjà aidé à traduire ${new Intl.NumberFormat("fr-FR").format(props.translationStatistics?.nbWordsTranslated || 0)} mots. Comme eux, devenez traducteur bénévole pour rendre l’information accessible au plus grand nombre.`}
        buttonTitle="Aider à traduire"
        image={MockupRI}
        imageWidth={448}
      />

      <SecondaryNavbar
        leftLinks={[
          { id: "who", text: "Qui peut traduire ?" },
          { id: "steps", text: "Comment faire ?" },
          { id: "next", text: "Et après ?" },
          { id: "faq", text: "Foire aux questions" },
        ]}
        rightLink={{
          id: "register",
          text: "Aider à traduire",
        }}
        activeView={activeView}
      />

      {/* WHO */}
      <div ref={refWho} className="relative">
        <Section>
          <Anchor id="who" />
          <div className="fr-container">
            <SectionHead
              title="Est-ce que je peux traduire ?"
              subtitle="Vous êtes réfugié, travailleur social, citoyen français, bénévole dans une association ? Vous pouvez nous aider à traduire ! Voici les conditions à remplir :"
            />
            <RowCards>
              <Card image={WhoIcon1} title="Maîtriser sa langue d’origine">
                <p className="!mb-0">
                  Aucun justificatif n’est demandé, mais il est préférable de très bien maîtriser
                  l'écrit de votre langue d'origine : ukrainien, persan/dari, arabe, anglais,
                  pachto, russe, tigrinya.
                </p>
              </Card>

              <Card image={CardIconCheck} title="Avoir le niveau B1 en français">
                <p className="!mb-0">
                  Il est nécessaire de bien savoir lire et écrire en français pour comprendre le
                  texte d'origine et ne pas déformer le message.
                </p>
              </Card>

              <Card image={WhoIcon3} title="Avoir accès à un ordinateur">
                <p className="!mb-0">
                  L’outil de traduction est disponible uniquement sur un ordinateur connecté à
                  internet, vous ne pouvez pas y accéder avec votre téléphone.
                </p>
              </Card>
            </RowCards>
          </div>
        </Section>

        {/* NEED */}
        <Section className="bg-action-low-blue-france">
          <div className="fr-container">
            <Title2>On cherche des traducteurs en :</Title2>
            {/* Énumération de liens : ul/li (RGAA 9.3), rôle explicite justifié sur la prop
                contentAs de MetaDataItem. Le flex reprend la disposition de l'ancien div. */}
            {translationNeeds.length > 0 && (
              <ul className="m-0 flex list-none flex-wrap gap-6 p-0 md:justify-center" role="list">
                {translationNeeds.map((item, i) => (
                  <li key={i} className="p-0">
                    <LanguageCard href="#register" languageId={item.languageId} need={item.need} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Section>
      </div>

      {/* STEPS */}
      <div ref={refSteps} className="relative">
        <Anchor id="steps" />
        <Section className="bg-alt-beige-gris-galet">
          <div className="fr-container">
            <Title2>Quelles sont les étapes pour traduire une fiche ?</Title2>
            <StepContent
              step={1}
              title="Créez <strong>votre compte</strong> Réfugiés.info"
              texts={[
                "Indiquez votre adresse mail et un mot de passe, vous êtes prêt à utiliser l'outil de traduction.",
              ]}
              cta={{ text: "Créer mon compte", link: "#register" }}
              image={StepImage1}
              width={440}
            />
            <StepContent
              step={2}
              title="Choisissez <strong>votre langue</strong> de traduction"
              texts={[
                "Une fois votre langue choisie, vous accédez à toutes les fiches à traduire. Cliquez sur une fiche pour commencer à la traduire.",
              ]}
              image={StepImage2}
              width={480}
            />
            <StepContent
              step={3}
              title="<strong>Traduisez la fiche</strong> à partir de la proposition automatique"
              texts={[
                "Quand vous arrivez sur une fiche, vous trouverez une première traduction. Attention, elle est automatique. Il faut la retravailler et la corriger !",
                [
                  "Faites des phrases simples et sans utiliser de dialecte.",
                  "Expliquez les idées spécifiques à la culture et à l'administration française (attestation, renouvellement...) mais gardez les mots importants s'il n'y a pas de traduction dans votre langue.",
                  "Évitez la traduction mot à mot, n’hésitez pas à corriger la traduction automatique.",
                ],
              ]}
              image={StepImage3}
              width={440}
            />
            <StepContent
              step={4}
              title="Un <strong>expert relit et valide</strong> votre traduction"
              texts={[
                "Un expert va relire votre traduction avant de publier la fiche.",
                "Vous allez recevoir un mail dès que la fiche que vous avez traduite sera visible sur le site Réfugiés.info et sur l'application mobile.",
              ]}
              image={StepImage4}
              width={440}
              buttonStep="La traduction est publiée 🎉"
              buttonStepEnd
            />
          </div>
        </Section>
      </div>

      {/* NEXT */}
      <div ref={refNext} className="relative">
        <Section className="bg-action-low-blue-france">
          <Anchor id="next" />
          <div className="fr-container">
            <div className="flex flex-col items-center gap-10 md:flex-row lg:gap-20">
              <div className="flex-1">
                <Title2 className="!text-left" smallMb>
                  Soyez fier de votre traduction et partagez la !
                </Title2>
                <p>
                  Votre nom et votre photo sont visibles en bas de votre fiche, avec les autres
                  contributeurs qui ont aidé à traduire.
                </p>
                <p className="!mb-0">
                  N’hésitez pas à les partager à vos amis et vos proches, ça peut leur être utile.
                </p>
              </div>
              <div className="flex-1">
                <Image
                  src={ShareImage}
                  alt=""
                  width={440}
                  height={287}
                  className="mx-auto object-contain"
                />
              </div>
            </div>
          </div>
        </Section>

        {/* HELP */}
        <Section>
          <div className="fr-container">
            <SectionHead
              title="Vous n’êtes pas seul !"
              subtitle="Nous sommes là pour vous accompagner dans la prise en main de Réfugiés.info et dans la traduction des fiches."
            />
            <RowCards>
              <Card
                image={CardIconCheck}
                title="Vidéos tutoriels"
                link="https://help.refugies.info/fr/category/traduire-1dvep4w/"
              >
                <p>
                  Dans le centre d’aide, vous trouverez des vidéos et articles pour vous accompagner
                  dans la traduction de votre fiche.
                </p>
              </Card>

              <Card
                image={CardIconCheck}
                title="Live chat"
                onClick={() => window.$crisp.push(["do", "chat:open"])}
              >
                <p>
                  Le live chat est accessible en bas à droite de votre écran (quatre jours par
                  semaine). Posez toutes vos questions : nous sommes réactifs et c’est un vrai
                  humain qui traite vos demandes !
                </p>
              </Card>
            </RowCards>
          </div>
        </Section>
      </div>

      {/* FAQ */}
      <Section ref={refFaq} className="relative">
        <Anchor id="faq" />
        <div className="fr-container">
          <Title2 className="text-center">Il vous reste des questions ?</Title2>
          <div className="mx-auto max-w-[720px]">
            <Accordion
              items={[
                {
                  title: "Quel niveau je dois avoir pour devenir traducteur ?",
                  text: "Aucun justificatif n’est demandé pour devenir traducteur mais il est préférable de maîtriser la langue dans laquelle vous traduisez. Si ce n'est pas votre langue maternelle, il est conseillé d'être étudiant en langue ou d'avoir déjà des expériences en traduction.<br/>Il est nécessaire de bien savoir lire et écrire en français pour comprendre le texte d'origine et ne pas déformer le message.",
                },
                {
                  title: "Combien de fiches je dois traduire ?",
                  text: "Vous traduisez à votre rythme, on ne vous demande pas de faire un nombre de fiches précis. Si vous faites plus de 10 000 mots (entre 20 et 30 fiches), nous pouvons valoriser votre engagement en vous donnant un certificat de traduction solidaire.",
                },
                {
                  title: "Combien de temps est nécessaire pour traduire une fiche ?",
                  text: "En moyenne, une fiche fait 300 mots. Nous estimons qu'il faut entre 15 et 30 minutes pour améliorer la traduction automatique proposée. Faites attention aux points suivants : <ul><li>Faites des phrases simples et sans utiliser de dialecte.</li> <li>Expliquez les idées spécifiques à la culture et à l'administration française (attestation, renouvellement...) mais gardez les mots importants s'il n'y a pas de traduction dans votre langue.</li><li>Évitez la traduction mot à mot, n’hésitez pas à corriger la traduction automatique.</li></ul>Vous pouvez vous arrêter à tout moment dans la traduction d'une fiche. Votre niveau d'avancement est enregistré, et c'est déjà d'une grande aide !",
                },
                {
                  title: "Quels sont les avantages de traduire des fiches sur Réfugiés.info ?",
                  text: "Grâce à votre aide précieuse, les personnes qui utilisent le site et l'application peuvent trouver les informations dans leur langue. De votre côté, c'est aussi une expérience enrichissante pour apprendre à utiliser un nouvel outil, progresser en français, contribuer à un projet national.",
                },
                {
                  title: "Est-ce que de nouvelles langues seront bientôt disponibles ?",
                  text: "Traduire Réfugiés.info dans une nouvelle langue est possible. La décision dépend de l’actualité et du volume de personnes que cette nouvelle langue pourrait intéresser. Si vous parlez une autre langue et souhaitez traduire du contenu pour le rendre accessible à votre communauté, remplissez ce formulaire.",
                  cta: {
                    text: "Remplir le formulaire",
                    link: "https://airtable.com/shrQxPHedgZ5PuXot",
                  },
                },
              ]}
              multiOpen
            />
          </div>
        </div>
      </Section>

      {/* REGISTER */}
      <Section ref={refRegister} className="bg-alt-beige-gris-galet relative">
        <Anchor id="register" />
        <div className="fr-container">
          <Register
            onClickLoggedIn={navigateToTranslations}
            subtitleForm="Connectez-vous ou créez votre compte pour commencer à traduire les fiches."
            subtitleLoggedIn="Vous savez tout, vous pouvez traduire votre première fiche."
            btnLoggedIn="Traduire une fiche"
            subtitleMobile="La traduction d’une fiche n’est possible que depuis un ordinateur. Nous pouvons vous envoyer un mail pour vous inscrire !"
            associatedRole={RoleName.TRAD}
          />
        </div>
      </Section>
    </div>
  );
};

export const getStaticProps = wrapper.getStaticProps((store) => async ({ locale }) => {
  let translationStatistics: TranslationStatisticsResponse = {};

  try {
    translationStatistics = await API.getTranslationStatistics({
      facets: ["nbTranslators", "nbWordsTranslated", "nbActiveTranslators"],
    });
  } catch (e) {
    logger.error("[traduire] error while generating page", e);
  }

  return {
    props: {
      ...(await serverSideTranslations(getLanguageFromLocale(locale), ["common"])),
      translationStatistics,
    },
    revalidate: 60 * 60, // 1 hour — this data changes infrequently
  };
});

export default RecensezVotreAction;
