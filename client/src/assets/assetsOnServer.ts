const bucketUrl = "https://storage.googleapis.com/refugies-info-assets/";
const bucketUrlQSN = bucketUrl + "qui-sommes-nous/";
const bucketUrlCC = bucketUrl + "comment-contribuer/";

export const assetsOnServer = {
  quiSommesNous: {
    codeOuvert: bucketUrlQSN + "code_ouvert.svg",
    microEngagement: bucketUrlQSN + "micro_engagement.svg",
    recenserDispositif: bucketUrlQSN + "QuiSommesNous_dispositif.svg",
    vulgariserDemarche: bucketUrlQSN + "demarche_light.svg",
    statutRefugie: bucketUrlQSN + "QuiSommesNous_refugies.svg",
    information: bucketUrlQSN + "plein_dinfos.svg",
    accompagnement: bucketUrlQSN + "QuiSommesNous_accompagnement.svg",
    header: bucketUrlQSN + "QuiSommesNous_header.svg",
    parcours: bucketUrlQSN + "QuiSommesNous_parcours.svg",
    terrain: bucketUrlQSN + "QuiSommesNous_terrain.svg",
  },
  commentContribuer: {
    traduction: bucketUrlCC + "CommentContribuer_imageTrad.svg",
  },
};
