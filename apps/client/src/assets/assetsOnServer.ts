const bucketUrl = "https://storage.googleapis.com/refugies-info-assets/";
const bucketUrlPublier = bucketUrl + "comment-contribuer/";
const bucketUrlAnnuaireActivites = bucketUrl + "annuaire/activit%C3%A9s/";
const bucketUrlMiddleOffice = bucketUrl + "middle-office/";
const bucketUrlStoreBadges = bucketUrl + "store-badges/";

export const assetsOnServer = {
  publier: {
    demarche: bucketUrlPublier + "demarche.svg",
    dispositif: bucketUrlPublier + "dispositif.svg",
  },
  annuaire: {
    activites: {
      francais: {
        certificationFLE: bucketUrlAnnuaireActivites + "Fran%C3%A7ais/CertificationFLE.svg",
        coursFrancais: bucketUrlAnnuaireActivites + "Fran%C3%A7ais/CoursFrançais.svg",
        supportAutoApprentissage:
          bucketUrlAnnuaireActivites + "Fran%C3%A7ais/SupportAutoApprentissage.svg",
        ateliersSocioLinguistique:
          bucketUrlAnnuaireActivites + "Fran%C3%A7ais/AteliersSocio-linguistique.svg",
      },
      administratif: {
        accompagnementGlobal: bucketUrlAnnuaireActivites + "Administratif/AccompagnementGlobal.svg",
        accompagnementJuridique:
          bucketUrlAnnuaireActivites + "Administratif/AccompagnementJuridique.svg",
        accueilMineurs: bucketUrlAnnuaireActivites + "Administratif/AccueilMineurs.svg",
        domiciliationPostale: bucketUrlAnnuaireActivites + "Administratif/DomiciliationPostale.svg",
        interprétariat: bucketUrlAnnuaireActivites + "Administratif/Interpretariat.svg",
      },
      logement: {
        accompagnementVersLogement:
          bucketUrlAnnuaireActivites + "Logement/AccompagnementVersLogement.svg",
        centreHébergement: bucketUrlAnnuaireActivites + "Logement/CentreHebergement.svg",
        colocationSolidaire: bucketUrlAnnuaireActivites + "Logement/ColocationSolidaire.svg",
        hébergementCitoyen: bucketUrlAnnuaireActivites + "Logement/HebergementCitoyen.svg",
        hébergementLongueDurée: bucketUrlAnnuaireActivites + "Logement/HebergementLongueDuree.svg",
        intermédiationLocative: bucketUrlAnnuaireActivites + "Logement/IntermediationLocative.svg",
        résidenceSociale: bucketUrlAnnuaireActivites + "Logement/ResidenceSociale.svg",
      },
      insertionPro: {
        accompagnementVersLemploi:
          bucketUrlAnnuaireActivites + "InsertionPro/AccompagnementVersLemploi.svg",
        bilanDéfinitionProjet:
          bucketUrlAnnuaireActivites + "InsertionPro/BilanDefinitionProjet.svg",
        coaching: bucketUrlAnnuaireActivites + "InsertionPro/Coaching.svg",
        miseEnRelation: bucketUrlAnnuaireActivites + "InsertionPro/MiseEnRelation.svg",
      },
      mobilite: {
        aidesFinancières: bucketUrlAnnuaireActivites + "Mobilité/AidesFinancieres.svg",
        coursConduite: bucketUrlAnnuaireActivites + "Mobilité/CoursConduite.svg",
        formationCode: bucketUrlAnnuaireActivites + "Mobilité/FormationCode.svg",
      },
      formationPro: {
        alternance: bucketUrlAnnuaireActivites + "FormationPro/Alternance.svg",
        apprentissage: bucketUrlAnnuaireActivites + "FormationPro/Apprentissage.svg",
        formationsCertifiantes:
          bucketUrlAnnuaireActivites + "FormationPro/FormationsCertifiantes.svg",
        formationsNonCertifiantes:
          bucketUrlAnnuaireActivites + "FormationPro/FormationsNonCertifiantes.svg",
      },
      etudes: {
        autoApprentissage: bucketUrlAnnuaireActivites + "Etudes/AutoApprentissage.svg",
        diplômeUniversitairePasserelle:
          bucketUrlAnnuaireActivites + "Etudes/DiplomeUniversitairePasserelle.svg",
        formationContinue: bucketUrlAnnuaireActivites + "Etudes/FormationContinue.svg",
        formationInitiale: bucketUrlAnnuaireActivites + "Etudes/FormationInitiale.svg",
        formationsCiviques: bucketUrlAnnuaireActivites + "Etudes/FormationsCiviques.svg",
      },
      sante: {
        accompagnementPsy: bucketUrlAnnuaireActivites + "Sante/AccompagnementPsy.svg",
        bilanSanté: bucketUrlAnnuaireActivites + "Sante/BilanSante.svg",
        parcoursDeSoin: bucketUrlAnnuaireActivites + "Sante/ParcoursDeSoin.svg",
      },
      loisirs: {
        activitésManuelles: bucketUrlAnnuaireActivites + "Loisirs/ActivitesManuelles.svg",
        tournoiSportifs: bucketUrlAnnuaireActivites + "Loisirs/TournoiSportifs.svg",
      },
      culture: {
        histoireFrance: bucketUrlAnnuaireActivites + "Culture/HistoireFrance.svg",
        visiteVille: bucketUrlAnnuaireActivites + "Culture/VisiteVille.svg",
      },
      benevolat: {
        missionsPonctuelles:
          bucketUrlAnnuaireActivites + "B%C3%A9n%C3%A9volat/MissionsPonctuelles.svg",
        serviceCiviqueFrançais:
          bucketUrlAnnuaireActivites + "B%C3%A9n%C3%A9volat/ServiceCiviqueFrançais.svg",
        serviceCiviqueRéfugiés:
          bucketUrlAnnuaireActivites + "B%C3%A9n%C3%A9volat/ServiceCiviqueRefugies.svg",
      },
      rencontre: {
        parrainage: bucketUrlAnnuaireActivites + "Rencontre/Parrainage.svg",
      },
    },
  },
  middleOffice: {
    noNotification: bucketUrlMiddleOffice + "aucune_notification.svg",
  },
  storeBadges: {
    appStore: {
      fr: bucketUrlStoreBadges + "app-store-fr.svg",
      ru: bucketUrlStoreBadges + "app-store-ru.svg",
      ar: bucketUrlStoreBadges + "app-store-ar.svg",
      en: bucketUrlStoreBadges + "app-store-en.svg",
      uk: null,
      ps: null,
      ti: null,
      fa: null,
    },
    playStore: {
      fr: bucketUrlStoreBadges + "google-play-fr.svg",
      ru: bucketUrlStoreBadges + "google-play-ru.svg",
      ar: bucketUrlStoreBadges + "google-play-ar.svg",
      en: bucketUrlStoreBadges + "google-play-en.svg",
      uk: bucketUrlStoreBadges + "google-play-uk.svg",
      ps: null,
      ti: null,
      fa: null,
    },
  },
};
