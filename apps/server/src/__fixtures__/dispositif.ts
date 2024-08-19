import { ContentType, DispositifStatus } from "@refugies-info/api-types";
import { Dispositif, ObjectId } from "../typegoose";

const dispositif: Dispositif = new Dispositif();
dispositif._id = new ObjectId("5ce7b52d83983700167bca27");
dispositif.typeContenu = ContentType.DISPOSITIF
dispositif.status = DispositifStatus.ACTIVE
dispositif.secondaryThemes = [
  new ObjectId("63286a015d31b2c0cad9960d"),
  new ObjectId("63450dd43e23cd7181ba0b26")
]
dispositif.needs = [
  new ObjectId("613721a409c5190dfa70d057"),
  new ObjectId("63450e79f14a373d5af284c0"),
  new ObjectId("613721a409c5190dfa70d064")
]
dispositif.sponsors = []
dispositif.creatorId = new ObjectId("6569af9815c38bd134125ff3")
dispositif.participants = [
  new ObjectId("6569af9815c38bd134125ff3"),
  new ObjectId("5fbd620b2e78910014405443"),
  new ObjectId("6568946b61b13ef3180600a7"),
  new ObjectId("5dd11f037939c90016c8c920"),
  new ObjectId("5fa0a1076e3ea80047c12808"),
  new ObjectId("617763ae794ec90014ef6f2e"),
  new ObjectId("604d227fb90cfa0014682490")
]
dispositif.lastModificationAuthor = new ObjectId("5fbd620b2e78910014405443")
dispositif.nbFavoritesMobile = 0
dispositif.nbVues = 79
dispositif.nbVuesMobile = 1
dispositif.nbMots = 256
dispositif.themesSelectedByAuthor = false
dispositif.suggestions = []
dispositif.merci = []
dispositif.webOnly = false
dispositif.translations = {
  fr: {
    content: {
      titreInformatif: "Apprendre le français",
      titreMarque: "Des mots d'ancrage",
      abstract: "Formations et ateliers linguistiques pour progresser en français à Marseille",
      what: "<p dir=\"ltr\"><span>Des cours de français à Marseille pour améliorer votre niveau à l’écrit et à l’oral, pour :</span></p><ul><li value=\"1\"><span>être autonome dans la vie quotidienne,</span></li><li value=\"2\"><span>trouver un travail,</span></li><li value=\"3\"><span>accompagner au mieux la scolarité de vos enfants...</span></li></ul><div class=\"callout callout--info\" data-callout=\"info\" data-title=\"Bon à savoir\"><span>Nous pouvons vous aider à préparer l'examen de langue DELF B1.</span></div>",
      how: {
        "d758ba3e-ed67-4aa9-9256-4d8b10a7971e": {
          "title": "Venez-nous rencontrer !",
          "text": "<p dir=\"ltr\"><span>N'hésitez pas à venir nous rencontrer directement pendant les temps d'inscription et d'accueil </span><b><strong class=\"rtri-bold\">le lundi</strong></b><span>, hors vacances scolaires, </span><b><strong class=\"rtri-bold\">entre 14h et 16h.</strong></b></p><p dir=\"ltr\"><span>Vous pouvez nous contacter si besoin :</span></p><ul><li value=\"1\"><span>par téléphone : 07 82 13 67 17</span></li><li value=\"2\"><span>par mail : </span><a href=\"mailto:contact@associationmotamot.org\" class=\"rtri-link\"><span>contact@associationmotamot.org</span></a></li></ul><div class=\"callout callout--info\" data-callout=\"info\" data-title=\"Bon à savoir\"><span>Les ateliers se déroulent de septembre à juin.</span></div>"
        }
      },
      why: {
        "ea443139-224f-4cc6-9268-8c3333a52ff4": {
          "title": "Améliorer son français",
          "text": "<p dir=\"ltr\"><span>Vous apprendrez à mieux communiquer en français à l'oral et à l'écrit en lien avec des situations de la vie quotidienne, professionnelle ou en lien avec la scolarité de vos enfants.</span></p>"
        },
        "1c1ef0ef-bb35-443a-882d-402a5ac8436e": {
          "title": "Prendre confiance en soi",
          "text": "<p dir=\"ltr\"><span>Mieux savoir parler et écrire en français vous permet de gagner en confiance. Vous pourrez aussi travailler votre imaginaire pendant des ateliers d'écriture.</span></p>"
        },
        "b95a30a5-b3b1-4080-a1a6-16bc69f9b83a": {
          "title": "Participer à la vie associative",
          "text": "<p dir=\"ltr\"><span>Vous pourrez participer à des sorties culturelles, projets, et vous investir si vous le souhaitez dans la vie associative et la gouvernance de l'association.</span></p>"
        },
        "dedf6f61-4d14-4133-b777-c0c0ee3bead9": {
          "title": "Rencontrer de nouvelles personnes",
          "text": "<p dir=\"ltr\"><span>Participer à un cours de français, c'est aussi l'occasion de rencontrer plein de nouvelles personnes.</span></p>"
        },
        "4c069c4e-0d75-4b4b-abb9-8f25b348d8ef": {
          "title": "Préparer un examen en langue française",
          "text": "<p dir=\"ltr\"><span>Vous pourrez préparer le B1 pour l'accès à la nationalité.</span></p>"
        },
        "c3561f40-f89b-4071-a4ad-fe3a59c27c74": {
          "title": "Apprendre le lexique du code de la route",
          "text": "<p dir=\"ltr\"><span>Comprendre le lexique du code de la route pour réussir l'examen du code et pouvoir passer votre permis.</span></p>"
        }
      }
    },
    created_at: new Date("2023-12-01T14:34:06.706Z"),
    validatorId: new ObjectId("6569af9815c38bd134125ff3")
  },
  fa: {
    content: {
      titreInformatif: "آموزش زبان فرانسوی",
      titreMarque: "Des mots d'ancrage",
      abstract: "آموزش زبان و کارگاه ها برای بهبود زبان فرانسوی در Marseille",
      what: "<p dir=\"rtl\" style=\"text-align: right;\"><span>دوره های زبان فرانسوی در Marseille برای بهبود سطح کتبی و شفاهی شما، به منظور:</span></p><ul><li value=\"1\"><span>استقلال در زندگی روزمره،</span></li><li value=\"2\"><span>یافتن شغل،</span></li><li value=\"3\"><span>همراهی برای تحصیلات فرزندان خود...</span></li></ul><div class=\"callout callout--info\" data-callout=\"info\" data-title=\"Bon à savoir\"><span>ما می توانیم به شما کمک کنیم تا برای آزمون سطح DELF B1 آماده شوید.</span></div>",
      why: {
        "ea443139-224f-4cc6-9268-8c3333a52ff4": {
          "title": "بهبود سطح زبان فرانسوی خود",
          "text": "<p dir=\"rtl\" style=\"text-align: right;\"><span>شما یاد خواهید گرفت که چگونه در موقعیت های مختلف زندگی روزمره، حرفه ای یا مرتبط با تحصیلات فرزندان خود، بهتر به زبان فرانسوی ارتباط برقرار کنید.</span></p>"
        },
        "1c1ef0ef-bb35-443a-882d-402a5ac8436e": {
          "title": "افزایش اعتماد به نفس",
          "text": "<p dir=\"rtl\" style=\"text-align: right;\"><span>دانستن نحوه صحبت کردن و نوشتن بهتر به زبان فرانسوی به شما امکان می دهد اعتماد به نفس خود را افزایش دهید. شما همچنین می توانید در کارگاه های نویسندگی روی تخیل خود کار کنید.</span></p>"
        },
        "b95a30a5-b3b1-4080-a1a6-16bc69f9b83a": {
          "title": "شرکت در زندگی انجمنی",
          "text": "<p dir=\"rtl\" style=\"text-align: right;\"><span>شما می توانید در برنامه های فرهنگی و پروژه‌ها شرکت کرده و در صورت تمایل، در زندگی اجتماعی و مدیریت انجمن شرکت کنید.</span></p>"
        },
        "dedf6f61-4d14-4133-b777-c0c0ee3bead9": {
          "title": "ملاقات با افراد جدید\n\n",
          "text": "<p dir=\"rtl\" style=\"text-align: right;\"><span>شرکت در یک دوره زبان فرانسوی، همچنین فرصتی برای ملاقات با افراد جدید است.</span></p>"
        },
        "4c069c4e-0d75-4b4b-abb9-8f25b348d8ef": {
          "title": "آمادگی برای امتحان زبان فرانسوی",
          "text": "<p dir=\"rtl\" style=\"text-align: right;\"><span>شما می توانید برای سطح B1 برای دسترسی به ملیت فرانسوی آماده شوید.</span></p>"
        },
        "c3561f40-f89b-4071-a4ad-fe3a59c27c74": {
          "title": "یادگیری اصطلاحات قانون رانندگی (code de la route)",
          "text": "<p dir=\"rtl\" style=\"text-align: right;\"><span>درک اصطلاحات برای موفقیت در امتحان قانون و گرفتن گواهینامه رانندگی ضروری است.</span></p>"
        }
      },
      how: {
        "d758ba3e-ed67-4aa9-9256-4d8b10a7971e": {
          "title": "ملاقات با ما",
          "text": "<p dir=\"rtl\" style=\"text-align: right;\"><span>دریغ نکنید </span><b><strong class=\"rtri-bold\">روزهای دوشنبه</strong></b><span>، خارج از تعطیلات مدرسه، </span><b><strong class=\"rtri-bold\">بین ساعت 2 تا 4 عصر،</strong></b><span> بیایید و با ما ملاقات کنید.</span></p><p dir=\"rtl\" style=\"text-align: right;\"><span>در صورت لزوم می توانید با ما تماس بگیرید:</span></p><ul><li value=\"1\"><span>از طریق تلفن: 07.82.13.67.17</span></li><li value=\"2\"><span>از طریق ایمیل: </span><a href=\"mailto:contact@associationmotamot.org\" class=\"rtri-link\"><span>contact@associationmotamot.org</span></a></li></ul><div class=\"callout callout--info\" data-callout=\"info\" data-title=\"Bon à savoir\"><span>این کارگاه ها از سپتامبر تا ژوئن برگزار می شوند.</span></div>"
        }
      }
    },
    created_at: new Date("2023-12-02T13:12:54.658Z"),
    validatorId: new ObjectId("604d227fb90cfa0014682490")
  }
}
dispositif.map = [
  {
    title: "Le Lokal 36",
    address: "36 Rue Bernard, 13003 Marseille, France",
    city: "Marseille",
    lat: 43.3105542,
    lng: 5.387217100000001,
    email: "contact@associationmotamot.org",
    phone: "0782136717",
    description: "Accueil et inscriptions le lundi entre 14h et 16h, hors vacnces scolaires"
  }
]
dispositif.created_at = new Date("2023-12-01T10:05:56.577Z")
dispositif.updatedAt = new Date("2023-12-07T14:25:30.108Z")
dispositif.lastModificationDate = new Date("2023-12-01T14:34:06.706Z")
dispositif.theme = new ObjectId("63286a015d31b2c0cad9960a")
dispositif.metadatas = {
  location: [
    "13 - Bouches-du-Rhône"
  ],
  frenchLevel: [
    "alpha",
    "A1",
    "A2",
    "B1"
  ],
  age: null,
  price: {
    "values": [
      0
    ]
  },
  publicStatus: [
    "apatride",
    "asile",
    "refugie",
    "temporaire",
    "subsidiaire",
    "french"
  ],
  public: null,
  conditions: null,
  commitment: null,
  frequency: {
    amountDetails: "minimum",
    hours: 2,
    timeUnit: "hours",
    frequencyUnit: "week"
  },
  timeSlots: [
    "monday",
    "tuesday",
    "thursday",
    "friday"
  ]
}
dispositif.mainSponsor = new ObjectId("6569c41c61b13ef31806fadb")
dispositif.hasDraftVersion = false
dispositif.publishedAt = new Date("2023-12-01T14:34:29.335Z")
dispositif.publishedAtAuthor = new ObjectId("5fbd620b2e78910014405443")
dispositif.notificationsSent = {}

export { dispositif }