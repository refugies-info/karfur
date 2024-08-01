import Button from "@codegouvfr/react-dsfr/Button";
import { Card } from "@codegouvfr/react-dsfr/Card";
import { SegmentedControl } from "@codegouvfr/react-dsfr/SegmentedControl";
import ActeursIlluDemarche from "assets/agir/acteurs-illu-demarche.png";
import ActeursIlluDispositif from "assets/agir/acteurs-illu-dispositifs.png";
import ActeursIlluRecenser from "assets/agir/acteurs-illu-recenser.png";
import ActeursIlluWebinaire from "assets/agir/acteurs-illu-webinaire.png";
import AgirLogos from "assets/agir/agir-logos.png";
import IlluAccompagnement from "assets/agir/illu-accompagnement-social.svg";
import IlluEmploi from "assets/agir/illu-emploi.svg";
import IlluLogement from "assets/agir/illu-logement.svg";
import SEO from "components/Seo";
import MapFrance from "components/UI/MapFrance";
import { operatorsPerDepartment } from "data/agirOperators";
import { cls } from "lib/classname";
import { getDepartmentFromNumber } from "lib/departments";
import { defaultStaticProps } from "lib/getDefaultStaticProps";
import { buildUrlQuery } from "lib/recherche/buildUrlQuery";
import { isValidEmail } from "lib/validateFields";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useInView } from "react-intersection-observer";
import { Col, Container, Row } from "reactstrap";
import { getPath } from "routes";
import styles from "scss/pages/agir.module.scss";

type Section = "program" | "operators" | "next";
const MAP_COLORS = {
  "#313278": Object.keys(operatorsPerDepartment),
};

const Agir = () => {
  const [activeDep, setActiveDep] = useState("");
  const operatorData = useMemo(() => operatorsPerDepartment[activeDep], [activeDep]);

  const [activeView, setActiveView] = useState<Section | null>(null);
  const [refProgram, inViewProgram] = useInView({ threshold: 0 });
  const [refOperators, inViewOperators] = useInView({ threshold: 0.6 });
  const [refNext, inViewNext] = useInView({ threshold: 0.6 });

  useEffect(() => {
    const views: { inView: boolean; id: Section }[] = [
      { inView: inViewProgram, id: "program" },
      { inView: inViewOperators, id: "operators" },
      { inView: inViewNext, id: "next" },
    ];
    for (const view of views.reverse()) {
      if (view.inView) {
        setActiveView(view.id);
        return;
      }
    }
    setActiveView(null);
  }, [inViewProgram, inViewOperators, inViewNext]);

  const scrollTo = useCallback((id: Section) => {
    document.querySelector(`#${id}`)?.scrollIntoView({
      behavior: "smooth",
    });
  }, []);

  return (
    <div className="w-100">
      <SEO
        title="AGIR pour le logement et l’emploi des personnes réfugiées"
        description="AGIR (Accompagnement global et individualisé des réfugiés) est un programme d’accompagnement des réfugiés vers l’emploi, le logement et l’accès aux droits"
      />
      <div className={styles.hero}>
        <Container>
          <Row className={styles.row}>
            <Col>
              <h1 className={styles.title}>Le programme AGIR en bref</h1>
              <p className={cls(styles.subtitle, "mb-10")}>
                Ce programme interministériel est piloté par la Direction générale des étrangers en France (DGEF) en
                partenariat avec la DIHAL, la DIAIR, l’OFII et la DGEFP.
              </p>
              <Button
                iconId="fr-icon-arrow-right-line"
                iconPosition="right"
                className={cls(styles.colored, "mb-4")}
                size="large"
                linkProps={{
                  href: "#program",
                }}
              >
                Découvrir le programme
              </Button>
              <Button
                iconId="fr-icon-arrow-right-line"
                iconPosition="right"
                size="large"
                priority="secondary"
                className={styles.colored}
                linkProps={{
                  href: "#map",
                }}
              >
                Trouver mon opérateur
              </Button>
            </Col>
            <Col className="d-flex justify-content-center justify-lg-content-end">
              <Image src={AgirLogos} width={400} height={280} alt="" />
            </Col>
          </Row>
        </Container>
      </div>

      <div className={styles.nav}>
        <Container>
          <SegmentedControl
            hideLegend
            segments={[
              {
                label: "Le programme",
                nativeInputProps: {
                  checked: activeView === "program",
                  onClick: () => scrollTo("program"),
                  readOnly: true,
                },
              },
              {
                label: "Les opérateurs",
                nativeInputProps: {
                  checked: activeView === "operators",
                  onClick: () => scrollTo("operators"),
                  readOnly: true,
                },
              },
              {
                label: "Aller plus loin",
                nativeInputProps: {
                  checked: activeView === "next",
                  onClick: () => scrollTo("next"),
                  readOnly: true,
                },
              },
            ]}
          />
        </Container>
      </div>

      <Container>
        <span id="program" className={styles.anchor} />
        <div className="py-10 py-lg-20" ref={refProgram}>
          <span className={styles.step}>1</span>
          <Row className="gx-20">
            <Col lg="6">
              <h2 className={cls(styles.blue, "fr-display--xs")}>Accompagner les bénéficiaires</h2>
              <p className={cls(styles.subtitle, styles.blue)}>
                Le programme AGIR vise à systématiser l’accompagnement global des bénéficiaires de la protection
                internationale (BPI) vers l’emploi, le logement et l’accès aux droits.
              </p>
            </Col>
            <Col lg="6">
              <ul className={styles.list}>
                <li>
                  <i className="fr-icon-arrow-right-line" />
                  L’accompagnement est réalisé auprès de BPI orientés par les directions territoriales de l’OFII (DT
                  OFII) et peut s’étendre jusqu’à 24 mois maximum.
                </li>
                <li>
                  <i className="fr-icon-arrow-right-line" />
                  Il concerne les bénéficiaires ayant obtenu la protection depuis moins de 24 mois.
                </li>
                <li>
                  <i className="fr-icon-arrow-right-line" />
                  L’accompagnement est assuré par un binôme de travailleurs sociaux et de conseillers en insertion
                  professionnelle.
                </li>
                <li>
                  <i className="fr-icon-arrow-right-line" />
                  Il démarre par la signature d’un contrat d’engagements réciproques entre le BPI et l’opérateur AGIR.
                </li>
                <li>
                  <i className="fr-icon-arrow-right-line" />
                  Un bilan complet en matière d’accès aux droits, au logement, à l’emploi ou la formation est réalisé en
                  début de prise en charge.
                </li>
                <li>
                  <i className="fr-icon-arrow-right-line" />
                  Un entretien de suivi tous les deux mois est obligatoire.
                </li>
              </ul>
            </Col>
          </Row>

          <Row className="mt-10 mt-lg-20">
            <Col lg="4" className="mb-10 mb-lg-0">
              <div className={styles.card}>
                <Image src={IlluAccompagnement} width={80} height={80} alt="" className="mb-8" />
                <h3 className="mb-4">L’accompagnement social</h3>

                <p>
                  Droit au séjour, obtention de documents de voyage, reconstitution de l’état civil auprès de l’OFPRA,
                  accès à la réunification familiale
                </p>
                <p>
                  <strong>Accès aux prestations sociales</strong> : RSA, prestations familiales
                </p>
                <p>
                  <strong>Appui à l’ouverture d’un compte bancaire</strong>
                </p>
                <p>
                  <strong>Appui à la mobilité</strong> : échange de permis de conduire ou orientation vers un dispositif
                  préparant à la présentation à l’examen du permis français
                </p>
                <p>
                  <strong>Accès à l’assurance maladie</strong> : PUMA et CMU-C
                </p>
              </div>
            </Col>
            <Col lg="4" className="mb-10 mb-lg-0">
              <div className={styles.card}>
                <Image src={IlluLogement} width={80} height={80} alt="" className="mb-8" />
                <h3 className="mb-4">Le logement</h3>
                <p>
                  L’accompagnement vise à favoriser les sorties réussies des structures d’hébergement et de logement
                  temporaire et à garantir l’accès et le maintien durable des ménages dans leur lieu de vie ainsi que
                  dans leur environnement.
                </p>
              </div>
            </Col>
            <Col lg="4" className="mb-10 mb-lg-0">
              <div className={styles.card}>
                <Image src={IlluEmploi} width={80} height={80} alt="" className="mb-8" />
                <h3 className="mb-4">L’emploi</h3>
                <p>
                  <strong>Réaliser un pré-diagnostic</strong> sur tous les aspects de la situation professionnelle en
                  lien avec le bilan de la situation globale
                </p>
                <p>
                  <strong>Assurer l’inscription à France Travail ou le suivi par la Mission locale</strong> ainsi que
                  leur maintien dans le temps
                </p>
                <p>
                  <strong>Orienter vers les acteurs du Service public de l’emploi (SPE)</strong> si niveau de langue
                  requis (A2) avec mobilisation de l’offre de service SPE
                </p>
              </div>
            </Col>
          </Row>
        </div>

        <span id="operators" className={styles.anchor} />
        <div className="py-10 py-lg-20" ref={refOperators}>
          <span className={styles.step}>2</span>

          <Row className="gx-20">
            <Col lg="6">
              <h2 className={cls(styles.blue, "fr-display--xs")}>Coordonner les acteurs de l’intégration</h2>
              <p className={cls(styles.subtitle, styles.blue)}>
                L’objectif du programme AGIR est de proposer un guichet unique par département pour favoriser
                l’intégration des BPI, pour des parcours adaptés et sans ruptures.
              </p>
            </Col>
            <Col lg="6">
              <ul className={styles.list}>
                <li>
                  <i className="fr-icon-arrow-right-line" />
                  L’opérateur AGIR appuie le préfet dans l’animation du réseau des acteurs de droit commun et
                  spécialisés.
                </li>
                <li>
                  <i className="fr-icon-arrow-right-line" />
                  L’opérateur AGIR noue les partenariats nécessaires à l’accompagnement pour faciliter la prise en
                  charge des BPI et répondre à tous les besoins d’intégration identifiés.
                </li>
                <li>
                  <i className="fr-icon-arrow-right-line" />
                  Pour identifier puis coordonner les acteurs sur le territoire, il incite au recensement des actions
                  sur Réfugiés.info.
                </li>
                <li>
                  <i className="fr-icon-arrow-right-line" />
                  Permettant ainsi la constitution d’une cartographie exhaustive et pratique pour l’ensemble de
                  l’écosystème.
                </li>
              </ul>
            </Col>
          </Row>

          <span id="map" className={styles.anchor} />
          <div className="mt-10 mt-lg-20">
            <h3 className={styles.h3}>Trouver l’opérateur de mon territoire</h3>
            <p className="w-lg-50 fst-italic">
              Sélectionner votre département sur la carte pour obtenir les coordonnées de l’opérateur sur votre
              territoire.
            </p>
            <Row>
              <Col lg="8">
                <MapFrance
                  onSelectDep={(dep) => setActiveDep(dep)}
                  colors={MAP_COLORS}
                  selectable={Object.keys(operatorsPerDepartment)}
                />
              </Col>
              <Col lg="4" className="d-flex align-items-center">
                {activeDep && (
                  <div className={styles.operator}>
                    <div className={styles.head}>
                      <span>{activeDep}</span>
                      {getDepartmentFromNumber(activeDep).split(" - ")[1]}
                    </div>
                    {operatorData && (
                      <div className={styles.content}>
                        <div>
                          <i className="ri-building-line me-2"></i> {operatorData.operator}
                        </div>
                        {operatorData.email && isValidEmail(operatorData.email) && (
                          <div className="mt-4">
                            <i className="ri-mail-line me-2"></i> {operatorData.email}
                          </div>
                        )}
                        {operatorData.phone && (
                          <div className="mt-4">
                            <i className="ri-phone-line me-2"></i> {operatorData.phone}
                          </div>
                        )}
                        {operatorData.dispositifId && (
                          <Button
                            size="small"
                            priority="tertiary"
                            iconId="fr-icon-arrow-right-line"
                            iconPosition="right"
                            className="mt-6"
                            linkProps={{
                              href: {
                                pathname: getPath("/dispositif/[id]", "fr"),
                                query: { id: operatorData.dispositifId },
                              },
                              target: "_blank",
                              rel: "noopener noreferrer",
                            }}
                          >
                            Découvrir la fiche
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </Col>
            </Row>
          </div>
        </div>
      </Container>
      <span id="next" className={styles.anchor} />
      <div className={cls(styles.next, "py-10 py-lg-20")} ref={refNext}>
        <Container>
          <h3 className={styles.h2}>Vous êtes acteur de l’intégration ?</h3>
          <p className={styles.subtitle}>
            Découvrez Réfugiés.info et comment l’utiliser au quotidien avec vos bénéficiaires.
          </p>

          <div className={cls("mt-10 mt-lg-20", styles.cards)}>
            <Row className="gx-6">
              <Col lg="3" className="mb-4 mb-lg-0">
                <Card
                  background
                  border
                  title="Je découvre +100 fiches pratiques"
                  desc="Sur la CAF, le RSA, France Travail, l’ANEF, la carte Vitale, le permis de conduire..."
                  enlargeLink
                  imageAlt=""
                  imageUrl={ActeursIlluDemarche.src}
                  linkProps={{
                    href: getPath("/recherche", "fr", `?${buildUrlQuery({ type: "demarche", sort: "date" })}`),
                  }}
                  size="small"
                  titleAs="h4"
                  className="h-100"
                />
              </Col>
              <Col lg="3" className="mb-4 mb-lg-0">
                <Card
                  background
                  border
                  title="Je découvre les acteurs de mon département"
                  desc="Les cours de français, les formations professionnelles, les loisirs..."
                  enlargeLink
                  imageAlt=""
                  imageUrl={ActeursIlluDispositif.src}
                  linkProps={{
                    href: getPath("/recherche", "fr"),
                  }}
                  size="small"
                  titleAs="h4"
                  className="h-100"
                />
              </Col>
              <Col lg="3" className="mb-4 mb-lg-0">
                <Card
                  background
                  border
                  title="Je recense mon action sur Réfugiés.info"
                  desc="Vous êtes porteur d’un dispositif ? Recensez-le sur Réfugiés.info."
                  enlargeLink
                  imageAlt=""
                  imageUrl={ActeursIlluRecenser.src}
                  linkProps={{
                    href: getPath("/publier", "fr"),
                  }}
                  size="small"
                  titleAs="h4"
                  className="h-100"
                />
              </Col>
              <Col lg="3" className="mb-4 mb-lg-0">
                <Card
                  background
                  border
                  title="Je participe à un webinaire gratuit"
                  desc="Découvrez comment utiliser Réfugiés.info avec vos bénéficiaires au quotidien."
                  enlargeLink
                  imageAlt=""
                  imageUrl={ActeursIlluWebinaire.src}
                  linkProps={{
                    href: "https://kit.refugies.info/formation/",
                    target: "_blank",
                  }}
                  size="small"
                  titleAs="h4"
                  className="h-100"
                />
              </Col>
            </Row>
          </div>
        </Container>
      </div>
    </div>
  );
};

export const getStaticProps = defaultStaticProps;

export default Agir;
