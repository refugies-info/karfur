// @ts-nocheck

export const fakeContenuWithZoneDAction = [
  {
    title: "C'est quoi ?",
    content: [
      {
        type: "element",
        tagName: "p",
        children: [
          {
            type: "text",
            content: "modification bis",
          },
        ],
      },
    ],
    editable: false,
    type: "paragraphe",
  },
  {
    title: "C'est pour qui ?",
    content: [
      {
        type: "text",
        content: "null",
      },
    ],
    editable: false,
    type: "cards",
    children: [
      {
        type: "card",
        isFakeContent: false,
        title: "Zone d'action",
        titleIcon: "pin-outline",
        typeIcon: "eva",
        departments: ["68 - Haut-Rhin"],
        free: true,
        contentTitle: "Sélectionner",
        editable: false,
      },
      {
        type: "card",
        isFakeContent: true,
        title: "Public visé",
        titleIcon: "papiers",
        contentTitle: "réfugié",
        contentBody: "A modifier",
        footer: "En savoir plus",
        footerIcon: "info-outline",
        editable: false,
        content: [
          {
            type: "text",
            content: "undefined",
          },
        ],
      },
      {
        type: "card",
        isFakeContent: true,
        title: "Niveau de français",
        titleIcon: "frBubble",
        contentTitle: "Débutant",
        niveaux: [],
        footer: "Évaluer mon niveau",
        footerIcon: "bar-chart-outline",
        footerHref:
          "https://savoirs.rfi.fr/fr/testez-votre-niveau-de-fran%C3%87ais",
        tooltipHeader: "Niveau de français requis",
        tooltipContent:
          "Indiquez un niveau généraliste et précisez si besoin le niveau CECR demandé (A1,A2, etc.).",
        tooltipFooter: "En savoir plus",
        editable: false,
        content: [
          {
            type: "text",
            content: "undefined",
          },
        ],
      },
      {
        type: "card",
        isFakeContent: true,
        title: "Combien ça coûte ?",
        titleIcon: "pricetags-outline",
        typeIcon: "eva",
        free: true,
        price: 0,
        contentTitle: "une seule fois",
        footer: "Ajouter un message complémentaire",
        footerType: "text",
        tooltipHeader: "Combien ça coûte ?",
        tooltipContent:
          "Précisez si l’accès à votre dispositif est gratuit ou s’il existe des frais d’inscription, ou des coûts récurrent.\nPensez à expliquer la raison du coût en message complémentaire.",
        editable: false,
        content: [
          {
            type: "text",
            content: "undefined",
          },
        ],
      },
      {
        type: "card",
        isFakeContent: true,
        title: "Âge requis",
        titleIcon: "calendar-outline",
        typeIcon: "eva",
        contentTitle: "Plus de ** ans",
        bottomValue: 18,
        topValue: 56,
        contentBody: "30 ans pour les personnes en situations de handicap",
        footer: "Ajouter un message complémentaire",
        footerType: "text",
        editable: false,
        content: [
          {
            type: "text",
            content: "undefined",
          },
        ],
      },
    ],
  },
  {
    title: "Pourquoi c'est intéressant ?",
    content: [
      {
        type: "text",
        content: "null",
      },
    ],
    editable: false,
    type: "paragraphe",
    children: [
      {
        type: "accordion",
        placeholder:
          "Précisez votre pensée ! N'hésitez pas créer des listes, à importer des images, des vidéos ou à mettre en avant une information importante avec les options à votre disposition.",
        isFakeContent: false,
        content: [
          {
            type: "element",
            tagName: "p",
            attributes: [],
            children: [
              {
                type: "text",
                content: "tes",
              },
            ],
          },
        ],
        editable: false,
        title: "Prendre ses premiers cours de français",
      },
      {
        type: "accordion",
        placeholder:
          "Précisez votre pensée ! N'hésitez pas créer des listes, à importer des images, des vidéos ou à mettre en avant une information importante avec les options à votre disposition.",
        isFakeContent: false,
        content: [
          {
            type: "element",
            tagName: "p",
            attributes: [],
            children: [
              {
                type: "text",
                content:
                  "Solodou propose différents supports d'apprentissage. En effet, en plus d'une application numérique, vous bénéficierez d'un kit papier pour travailler la lecture et l'écriture. test",
              },
            ],
          },
        ],
        editable: false,
        title: "Différents supports d'apprentissage",
      },
      {
        type: "accordion",
        placeholder:
          "Précisez votre pensée ! N'hésitez pas créer des listes, à importer des images, des vidéos ou à mettre en avant une information importante avec les options à votre disposition.",
        isFakeContent: false,
        content: [
          {
            type: "element",
            tagName: "p",
            attributes: [],
            children: [
              {
                type: "text",
                content:
                  "Grâce à l'application Solodou, vous pouvez apprendre le français seul, quand vous voulez, depuis votre appareil électronique. ",
              },
            ],
          },
        ],
        editable: false,
        title: "Travailler en autonomie",
      },
    ],
  },
  {
    title: "Comment je m'engage ?",
    content: [
      {
        type: "text",
        content: "null",
      },
    ],
    editable: false,
    type: "paragraphe",
    children: [
      {
        type: "accordion",
        placeholder:
          "Précisez votre pensée ! N'hésitez pas créer des listes, à importer des images, des vidéos ou à mettre en avant une information importante avec les options à votre disposition.",
        isFakeContent: false,
        content: [
          {
            type: "element",
            tagName: "p",
            attributes: [],
            children: [
              {
                type: "text",
                content: "Pour créer un compte: ",
              },
              {
                type: "element",
                tagName: "a",
                attributes: [
                  {
                    key: "href",
                    value: "https://www.solodou.com/home-1.0/web/register.php",
                  },
                  {
                    key: "target",
                    value: "_blank",
                  },
                  {
                    key: "class",
                    value: "edited-btn",
                  },
                ],
                children: [
                  {
                    type: "text",
                    content: "Cliquez ici! ",
                  },
                ],
              },
              {
                type: "text",
                content: " ",
              },
              {
                type: "element",
                tagName: "br",
                attributes: [],
                children: [],
              },
              {
                type: "element",
                tagName: "br",
                attributes: [],
                children: [],
              },
              {
                type: "text",
                content:
                  "Si vous bénéficiez déjà d'un compte, vous pouvez vous connecter:  ",
              },
              {
                type: "element",
                tagName: "a",
                attributes: [
                  {
                    key: "href",
                    value: "https://www.solodou.com/home-1.0/web/login.php",
                  },
                  {
                    key: "target",
                    value: "_blank",
                  },
                  {
                    key: "class",
                    value: "edited-btn",
                  },
                ],
                children: [
                  {
                    type: "text",
                    content: "Ici! ",
                  },
                ],
              },
              {
                type: "text",
                content: " ",
              },
            ],
          },
        ],
        editable: false,
        title: "Inscrivez-vous sur Solodou",
      },
    ],
  },
];

export const fakeContenuWithZoneDActionAll = [
  {
    title: "C'est quoi ?",
    content: [
      {
        type: "element",
        tagName: "p",
        attributes: [],
        children: [
          {
            type: "text",
            content: "modification bis",
          },
        ],
      },
    ],
    editable: false,
    type: "paragraphe",
  },
  {
    title: "C'est pour qui ?",
    content: [
      {
        type: "text",
        content: "null",
      },
    ],
    editable: false,
    type: "cards",
    children: [
      {
        type: "card",
        isFakeContent: false,
        title: "Zone d'action",
        titleIcon: "pin-outline",
        typeIcon: "eva",
        departments: ["All"],
        free: true,
        contentTitle: "Sélectionner",
        editable: false,
      },
    ],
  },
];
