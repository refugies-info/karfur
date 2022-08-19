import moment from "moment";
import { Content } from "../../types/interface";

export const selectedContent: Content = {
  "_id": "608aa9c2cd085e0014cab9f5",
  "titreInformatif": "Être aidé pour trouver un logement et un travail",
  "titreMarque": "Insair 38 - ADOMA",
  "externalLink": "",
  "contenu": [
    {
      "title": "C'est quoi ?",
      "content": "<p><strong>Insair 38 aide les réfugiés statutaires à accéder à un logement et à un emploi en leur proposant un accompagnement social individualisé. </strong></p><p>Ce dispositif du groupe cdc habitat ADOMA est à destination des réfugiés <strong>non-hébergés durant leur demande d'asile et sans référents sociaux </strong>i<strong>dentifiés. </strong></p><div class='bloc-rouge'> <div class='icon-left-side'> <span>i</span> </div> <div class='right-side'> <div><b>Bon à savoir :</b></div>Pour bénéficier de ce dispositif, vous devez être <strong>domicilié</strong> dans l'agglomération grenobloise et être en besoin d'accès à un logement.</div> </div>",
      "editable": false,
      "type": "paragraphe"
    },
    {
      "title": "C'est pour qui ?",
      "content": "",
      "editable": false,
      "type": "cards",
      "children": [
        {
          "content": "",
          "type": "card",
          "isFakeContent": false,
          "title": "Zone d'action",
          "titleIcon": "pin-outline",
          "typeIcon": "eva",
          "departments": [
            "38 - Isère"
          ],
          "free": true,
          "contentTitle": "Sélectionner",
          "editable": false,
        },
        {
          "content": "",
          "type": "card",
          "isFakeContent": true,
          "title": "Public visé",
          "titleIcon": "papiers",
          "contentTitle": "réfugiés",
          "contentBody": "ou bénéficiaire de la protection subsidiaire",
          "footer": "En savoir plus",
          "footerIcon": "info-outline",
          "editable": false
        },
        {
          "content": "",
          "type": "card",
          "isFakeContent": true,
          "title": "Âge requis",
          "titleIcon": "calendar-outline",
          "typeIcon": "eva",
          "contentTitle": "Plus de ** ans",
          "bottomValue": 18,
          "topValue": 60,
          "editable": false
        },
        {
          "content": "",
          "type": "card",
          "isFakeContent": false,
          "title": "Durée",
          "titleIcon": "clock-outline",
          "typeIcon": "eva",
          "contentTitle": "12 mois",
          "editable": false
        },
        {
          "content": "",
          "type": "card",
          "isFakeContent": true,
          "title": "Niveau de français",
          "titleIcon": "frBubble",
          "contentTitle": "Tous les niveaux",
          "niveaux": [],
          "footer": "Évaluer mon niveau",
          "footerIcon": "bar-chart-outline",
          "editable": false
        },
        {
          "content": "",
          "type": "card",
          "isFakeContent": true,
          "title": "Combien ça coûte ?",
          "titleIcon": "pricetags-outline",
          "typeIcon": "eva",
          "free": true,
          "price": 0,
          "contentTitle": "une seule fois",
          "editable": false
        }
      ]
    },
    {
      "title": "Pourquoi c'est intéressant ?",
      "content": "",
      "editable": false,
      "type": "paragraphe",
      "children": [
        {
          "isFakeContent": false,
          "type": "accordion",
          "content": "<p>Ce dispositif vous permettra d'avoir un référent social qui vous accompagnera dans vos démarches administratives, ouverture des droits, inscription à Pôle Emploi...</p>",
          "editable": false,
          "title": "Avoir un référent social"
        },
        {
          "type": "accordion",
          "isFakeContent": false,
          "content": "<p>Ce dispositif permet l'ouverture des droits et l'accès aux soins.</p>",
          "title": "Être accompagné dans l'accès à la santé",
          "editable": false
        },
        {
          "type": "accordion",
          "isFakeContent": false,
          "content": "<p>L'accompagnement global qu'offre ce dispositif vous permettra de trouver une formation professionnel ou un emploi.</p>",
          "editable": false,
          "title": "Trouver un travail"
        },
        {
          "type": "accordion",
          "isFakeContent": false,
          "content": "<p>L'objectif de ce dispositif est de vous permettre d'avoir un logement ou de vous maintenir dans un logement.</p>",
          "title": "Trouver un logement durable",
          "editable": false
        }
      ]
    },
    {
      "title": "Comment je m'engage ?",
      "content": "",
      "editable": false,
      "type": "paragraphe",
      "children": [
        {
          "type": "accordion",
          "isFakeContent": false,
          "content": "<p>Pour avoir plus d'informations et pour accéder à un accompagnement, envoyer un mail : </p><p><strong>contratrefugies@grenoblealpesmetropole.fr </strong></p>",
          "editable": false,
          "title": "Contact"
        },
        {
          "type": "accordion",
          "isFakeContent": false,
          "content": "<p>Les places pour ce dispositif sont très limitées </p>",
          "title": "Bon à savoir",
          "editable": false
        },
        {
          "content": "",
          "title": "",
          "type": "map",
          "isFakeContent": false,
          "markers": [
            {
              "latitude": 45.1737353,
              "longitude": 5.7303066,
              "address": "11 Rue Emile Zola, 38100 Grenoble, France",
              "place_id": "ChIJl_g8EsD0ikcR4JZVzUvOBpQ",
              "nom": "Adoma - Insair38",
              "vicinity": ""
            }
          ],
          "editable": false
        }
      ]
    }
  ],
  "theme": {
    "_id": "1",
    "short": { "fr": "" },
    "name": { "fr": "" },
    "colors": {
      "color100": "#3D2884",
      "color80": "",
      "color60": "",
      "color40": "",
      "color30": "",
    },
    "position": 0,
    "icon":"",
    "banner":"",
    "appImage": "",
    "shareImage": "",
    "notificationEmoji": ""
 },
  "secondaryThemes": [],
  "avancement": {
    "fr": 1,
    "fa": 1,
    "ru": 1,
    "ar": 1
  },
  "typeContenu": "dispositif" as const,
  "mainSponsor": {
    "nom": "Adoma",
    "picture": {
      "secure_url": "https://res.cloudinary.com/dlmqnnhp6/image/upload/v1614699260/pictures/ikly5syqhjdnpb4noxvr.jpg",
    },
  },
  "lastModificationDate": moment("2021-07-16T13:03:00.368Z")
}
