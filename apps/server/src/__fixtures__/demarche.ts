import { ContentType, DispositifStatus } from "@refugies-info/api-types";
import { Dispositif, ObjectId } from "../typegoose";

const demarche: Dispositif = new Dispositif();
demarche._id = new ObjectId("651588ea521b25fd0f92ee1a");
demarche.typeContenu = ContentType.DEMARCHE
demarche.status = DispositifStatus.ACTIVE
demarche.secondaryThemes = [
  new ObjectId("63286a015d31b2c0cad9960b"),
]
demarche.needs = [
  new ObjectId("63450e14f14a373d5af2814e"),
  new ObjectId("613721a409c5190dfa70d06a"),
]
demarche.sponsors = []
demarche.creatorId = new ObjectId("6479ed27a7c5fe2318dec396")
demarche.participants = [
  new ObjectId("6479ed27a7c5fe2318dec396"),
  new ObjectId("5fbd620b2e78910014405443"),
]
demarche.lastModificationAuthor = new ObjectId("5fbd620b2e78910014405443")
demarche.nbFavoritesMobile = 0
demarche.nbVues = 173
demarche.nbVuesMobile = 32
demarche.nbMots = 1244
demarche.themesSelectedByAuthor = false
demarche.suggestions = []
demarche.merci = [{
  created_at: new Date("2023-12-01T14:07:29.084Z"),
  userId: new ObjectId("63e25241640ef776c3247e13")
}]
demarche.webOnly = false
demarche.translations = {
  fr: {
    content: {
      "titreInformatif": "Avoir un livret de famille",
      "titreMarque": "",
      "abstract": "Découvrez les cas où vous allez recevoir un livret de famille de l'Ofpra ou de votre mairie",
      "what": "<p dir=\"ltr\"><span>Un</span><b><strong class=\"rtri-bold\"> livret de famille </strong></b><span>est un document officiel qui est délivré </span><b><strong class=\"rtri-bold\">soit par les mairies, soit par l’Ofpra, soit par le service central d'état civil</strong></b><span>.</span></p><p dir=\"ltr\"><span>Le livret de famille contient des extraits d’actes de naissance, de mariage ou de décès concernant les membres de votre famille. Il est mis à jour ou rectifié dans certains cas.</span></p><p dir=\"ltr\"><span>En France, il y a un livret de famille par union.</span></p><div class=\"callout callout--important\" data-callout=\"important\" data-title=\"Important\"><span>Le livret de famille </span><b><strong class=\"rtri-bold\">n’est pas obligatoire</strong></b><span>, mais il peut vous être demandé dans vos démarches en France. Il est important de le conserver précieusement.</span></div><p style=\"text-align: justify;\" dir=\"ltr\"><b><strong class=\"rtri-bold\">Par exemple, le livret de famille n’est pas obligatoire :</strong></b></p><ul><li value=\"1\"><span>Dans le cadre de la réunification familiale</span></li><li value=\"2\"><span>Pour l'inscription de vos enfants à l'école</span></li><li value=\"3\"><span>Pour obtenir un travail</span></li></ul><p dir=\"ltr\"><span>Cet article vous informe des différents cas où vous recevez un livret de famille.</span></p><div class=\"callout callout--important\" data-callout=\"important\" data-title=\"Important\"><span>Le livret de famille vous est envoyé ou remis </span><b><strong class=\"rtri-bold\">automatiquement</strong></b><span> par l'administration compétente. Vous n'avez donc pas besoin de le demander.</span></div><p dir=\"ltr\"><span>Dans certains cas, vous n’aurez pas de livret de famille. Vous devrez alors présenter, selon le cas, un acte de mariage ou l’acte de naissance de vos enfants.</span></p>",
      "how": {
        "1ee3b60e-b3b8-408a-8e51-00d43467f4a4": {
          "title": "Avoir un livret de l'Ofpra : vous êtes marié et l’Ofpra a fait votre certificat de mariage ",
          "text": "<p style=\"text-align: justify;\" dir=\"ltr\"><span>L’Ofpra vous enverra automatiquement un livret de famille </span><b><strong class=\"rtri-bold\">si vous vous êtes mariés </strong></b><u><b><strong class=\"rtri-bold rtri-underline\">avant</strong></b></u><b><strong class=\"rtri-bold\"> d'avoir votre protection </strong></b><span>et que l’Ofpra a créé votre certificat de mariage.</span></p><p dir=\"ltr\"><span>À l’intérieur du livret de famille, les noms suivants seront écrits :</span></p><ul><li value=\"1\"><span>Votre nom</span></li><li value=\"2\"><span>Le nom de la personne avec qui vous êtes marié </span></li><li value=\"3\"><span>Le nom des enfants nés de cette union et qui sont présents en France</span></li></ul><p style=\"text-align: justify;\" dir=\"ltr\"><span>Si un enfant naît en France de cette union, c’est la mairie du lieu de naissance qui écrira son nom après sa naissance.</span></p><div class=\"callout callout--important\" data-callout=\"important\" data-title=\"Important\"><span>Si vos enfants ne sont pas présents en France, ils ne peuvent pas figurer sur le livret de famille.</span><br><br><span>Dans certains cas, l’Ofpra aura besoin d’éléments complémentaires pour écrire certains noms dans le livret de famille.</span></div>"
        },
        "964d9bb5-4b57-40e6-bafb-2596d16a9095": {
          "title": "Avoir un livret par l’Ofpra : l'Ofpra n'a pas fait de certificat de mariage ",
          "text": "<p style=\"text-align: justify;\" dir=\"ltr\"><span>Si vous avez des enfants nés à l'étranger qui ont obtenu l’asile en même temps que vous, l’Ofpra vous enverra un livret de famille de </span><b><strong class=\"rtri-bold\">parent célibataire ou de parents concubins.</strong></b></p><p dir=\"ltr\"><span>Les noms suivants seront écrits dans le livret :</span></p><ul><li value=\"1\"><span>Votre nom</span></li><li value=\"2\"><span>Le nom de l’autre parent si celui-ci est protégé par l’Ofpra</span></li><li value=\"3\"><span>Le nom des enfants nés de cette union et qui sont présents en France.</span></li></ul><p dir=\"ltr\"><span>Si un enfant naît de cette union en France, c’est la mairie du lieu de naissance qui écrira son nom après sa naissance.</span></p><div class=\"callout callout--important\" data-callout=\"important\" data-title=\"Important\"><span>Si votre mariage n'est pas reconnu par l'Ofpra (polygamie, la loi du pays d’origine n’a pas été respectée, un des époux avait moins de 16 ans), vous serez considéré comme parents concubins.</span><br><br><span>Si vos enfants ne sont pas présents en France, vous ne recevrez pas de livret de famille. </span><br><br><span>Dans certains cas, l’Ofpra aura besoin d’éléments complémentaires pour écrire certains noms dans le livret de famille.</span></div>"
        },
        "21887132-46cf-457c-8ed6-3bfe691da7c7": {
          "title": "Avoir un livret de l'Ofpra : vos enfants vous rejoignent après votre protection ",
          "text": "<p style=\"text-align: justify;\" dir=\"ltr\"><b><strong class=\"rtri-bold\">Si vos enfants arrivent en France </strong></b><u><b><strong class=\"rtri-bold rtri-underline\">après</strong></b></u><b><strong class=\"rtri-bold\"> l’obtention de votre protection</strong></b><span>, vous pouvez faire une demande de livret de famille à l’Ofpra avec les originaux de leurs certificats de naissance et un justificatif de leurs présences en France.</span></p><p dir=\"ltr\"><span>Si vous avez déjà un livret de famille Ofpra, vous pouvez demander à ce qu’il soit complété avec le nom de ces enfants.</span></p><p dir=\"ltr\"><span>Il faut envoyer ces documents par courrier postal à l'Ofpra avec le formulaire prévu pour cela :</span></p><p dir=\"ltr\"><a href=\"https://www.ofpra.gouv.fr/libraries/pdf.js/web/viewer.html?file=/sites/default/files/2023-02/230217%20Formulaire%20Actes%20en%20d%C3%A9p%C3%B4t.pdf\" rel=\"noopener\" class=\"rtri-link\"><span>Cliquez ici pour voir le formulaire de demande d’inscription sur le livret de famille établi par l’OFPRA d’un acte de naissance pour un enfant né à l’étranger.</span></a></p><div class=\"callout callout--info\" data-callout=\"info\" data-title=\"Bon à savoir\"><span>Si vos enfants demandent, et obtiennent, l’asile, un livret de famille vous sera délivré si vous n’en aviez pas eu&nbsp;; si un livret de famille vous avait déjà été délivré, il vous sera demandé afin d’être complété.</span></div>"
        },
        "104bf3ba-0848-418e-a6f6-6ca74f3a9181": {
          "title": "Avoir un livret d’une mairie : vous vous êtes marié en France",
          "text": "<p style=\"text-align: justify;\" dir=\"ltr\"><b><strong class=\"rtri-bold\">Si vous vous mariez en France</strong></b><span>, et que vous n’avez pas encore de livret de famille, c’est la mairie où le mariage a été célébré qui vous remettra ce livret, le jour même du mariage.</span></p><p dir=\"ltr\"><span>Si vous aviez déjà un livret de famille de parents concubins, c’est la mairie qui complètera le livret de famille avec l’acte de mariage.</span></p>"
        },
        "c5009aa7-6e17-47fc-a7e3-a2e4254a6ad5": {
          "title": "Avoir un livret d’une mairie : vous n'êtes pas marié et votre enfant est né en France ",
          "text": "<p style=\"text-align: justify;\" dir=\"ltr\"><b><strong class=\"rtri-bold\">Si vous n'êtes pas marié et que votre enfant est né en France, </strong></b><span>c’est la mairie de naissance de votre premier enfant né en France qui vous enverra votre livret de famille.</span></p><p dir=\"ltr\"><span>Si seul votre enfant est protégé et aucun parent, ni l’Ofpra, ni la mairie ne pourront délivrer de livret de famille.</span></p><div class=\"callout callout--info\" data-callout=\"info\" data-title=\"Bon à savoir\"><span>Ce n’est pas à vous de contacter l’Ofpra, mais c’est la mairie qui s’en occupera pour que le livret soit correctement complété.</span></div>"
        },
        "2a470cc2-611d-47dc-a4ab-dab5df44d53d": {
          "title": "Ne pas avoir de livret de famille : les cas",
          "text": "<p style=\"text-align: justify;\" dir=\"ltr\"><span>Il existe des cas où </span><b><strong class=\"rtri-bold\">vous ne recevez pas de livret de famille.</strong></b></p><p dir=\"ltr\"><span>Il n'y a pas besoin de demander un livret de famille à l’Ofpra ou à une mairie française dans ces situations :</span></p><ul><li value=\"1\"><span>Si vous êtes célibataire et que vous n’avez pas d’enfants</span></li><li value=\"2\"><span>Si vous n’êtes pas marié et que vos enfants ne sont pas présents en France</span></li><li value=\"3\"><span>Si votre mariage n’a pas été reconnu par l’Ofpra et que vous n’avez pas d’enfants ou qu’ils ne sont pas présents en France</span></li><li value=\"4\"><span>Si vous vous êtes mariés à l’étranger après l’obtention de votre statut et que le pays où vous vous êtes marié ne délivre pas de livret de famille.</span></li></ul><div class=\"callout callout--important\" data-callout=\"important\" data-title=\"Important\"><span>L’absence de livret de famille ne vous empêche pas de demander à ce que votre conjoint/vos enfants vous rejoignent en France.</span><br><a href=\"https://refugies.info/fr/demarche/5e3d2572ca16ad0056c9dc48\" rel=\"noopener\" class=\"rtri-link\"><span>Pour plus d'informations sur la réunification familiale, vous pouvez consulter cette fiche Réfugiés.info.</span></a></div>"
        },
        "cb42d013-b986-413d-8fdf-92ad937a0d4e": {
          "title": "Une personne de votre famille n’est pas écrite dans le livret de famille",
          "text": "<p style=\"text-align: justify;\" dir=\"ltr\"><span>Il est possible d’avoir un livret de famille, mais que toute votre famille ne soit pas renseignée dedans.</span></p><p dir=\"ltr\"><span>Il y a plusieurs situations qui expliquent cela :</span></p><ul><li value=\"1\"><span>Vos enfants ne sont pas présents en France</span></li><li value=\"2\"><span>Si vous avez plusieurs conjoints (la polygamie n'est pas autorisée en France et seule la première épouse sera considérée comme votre épouse</span></li><li value=\"3\"><span>Si l'un de vos enfants est décédé avant la décision de protection</span></li><li value=\"4\"><span>Si vous avez eu des enfants avec plusieurs personnes, vous aurez plusieurs livrets de famille.</span></li></ul><div class=\"callout callout--info\" data-callout=\"info\" data-title=\"Bon à savoir\"><span>Il n'est pas nécessaire de contacter l'Ofpra dans ces cas.</span></div>"
        }
      },
      "next": {
        "f5fef43c-c548-443c-952b-588ac144a6b1": {
          "title": "Si vous perdez votre livret de famille ou si vous avez besoin d'un second livret de famille",
          "text": "<p style=\"text-align: justify;\" dir=\"ltr\"><span>Si vous avez perdu votre livret de famille ou si vous avez besoin d'un second livret de famille (suite à une séparation par exemple), il est possible de </span><b><strong class=\"rtri-bold\">faire une demande de duplicata </strong></b><span>à la mairie du lieu de résidence.</span></p><p dir=\"ltr\"><span>Celle-ci se chargera de contacter l’administration compétente.</span></p>"
        },
        "bafec7ec-6d4c-445c-af40-7d833f83baeb": {
          "title": "En cas de mariage ou de divorce ",
          "text": "<ul><li value=\"1\"><b><strong class=\"rtri-bold\">Si l’Ofpra vous a délivré un livret de famille en tant que concubin et que vous décidez de vous marier</strong></b><span>, la mairie du lieu de mariage vous délivrera un nouveau livret de famille ou complétera le livret de famille précédemment délivré par l'Ofpra.</span></li><li value=\"2\"><b><strong class=\"rtri-bold\">Si l’Ofpra vous a délivré un livret de famille et un certificat de mariage et que vous décidez de divorcer</strong></b><span>, l’Ofpra mettra à jour votre livret de famille.</span></li><li value=\"3\"><b><strong class=\"rtri-bold\">Si vous avez un livret de famille délivré par une mairie et que vous décidez de vous marier</strong></b><span>, la mairie du lieu de votre mariage vous délivrera un nouveau livret de famille.</span></li><li value=\"4\"><b><strong class=\"rtri-bold\">Si vous décidez de divorcer,</strong></b><span> c’est la mairie qui a établi l’acte de mariage qui mettra à jour votre livret de famille.</span></li></ul>"
        }
      }
    },
    created_at: new Date("2023-12-01T13:51:58.427Z"),
    validatorId: new ObjectId("6479ed27a7c5fe2318dec396")
  },
  fa: {
    content: {
      "titreInformatif": "دفترچه ثبت خانواده داشته باشید",
      "abstract": "موارد دریافت دفترچهٔ خانواده از Ofpra یا شهرداری\n",
      "what": "<p dir=\"rtl\" style=\"text-align: right;\"><span>دفترچه </span><b><strong class=\"rtri-bold\">سوابق خانوادگی</strong></b><span> livret de famille یک سند رسمی است که توسط </span><b><strong class=\"rtri-bold\">شهرداری‌ها، ادارهٔ امور پناهندگان (Ofpra) یا ادارهٔ مرکزی ثبت احوال</strong></b><span> صادر می‌شود.</span></p><p dir=\"rtl\" style=\"text-align: right;\"><span>دفترچهٔ خانواده شامل خلاصه‌هایی از سند تولد، ازدواج یا فوت اعضای خانواده شما است. در برخی موارد، به‌روزرسانی یا اصلاح می‌شود.</span></p><p dir=\"rtl\" style=\"text-align: right;\"><span>در فرانسه، برای هر ازدواج یک دفترچهٔ خانواده صادر می‌شود.</span></p><div class=\"callout callout--important\" data-callout=\"important\" data-title=\"Important\"><span>دفترچه ثبت خانواده </span><b><strong class=\"rtri-bold\">اجباری نیست</strong></b><span>، اما ممکن است در برخی مراحل اداری در فرانسه از شما خواسته شود. بنابراین، مهم است که آن را به‌خوبی نگهدارید.</span></div><p dir=\"rtl\" style=\"text-align: right;\"><b><strong class=\"rtri-bold\">داشتن دفترچهٔ خانواده در موارد زیر اجباری نیست</strong></b><span>:</span></p><ul><li value=\"1\"><span>در چارچوب اتحاد خانواده</span></li><li value=\"2\"><span>برای ثبت نام فرزندان تان در مدرسه</span></li><li value=\"3\"><span>برای یافتن شغل</span></li></ul><p dir=\"rtl\" style=\"text-align: right;\"><span>این برگه شما را از موارد مختلف گرفتن دفترچه ثبت خانواده مطلع می کند.</span></p><div class=\"callout callout--important\" data-callout=\"important\" data-title=\"Important\"><span>دفترچهٔ خانواده به‌طور خودکار توسط ادارهٔ ذی‌صلاح به شما ارسال یا تحویل داده می‌شود. بنابراین، نیازی به درخواست آن ندارید.</span></div><p dir=\"rtl\" style=\"text-align: right;\"><span>در برخی موارد، شما دفترچهٔ خانواده نخواهید داشت. در این صورت، باید بسته به مورد، سند ازدواج یا سند تولد فرزندان خود را ارائه دهید.</span></p>",
      "how": {
        "1ee3b60e-b3b8-408a-8e51-00d43467f4a4": {
          "title": "داشتن دفترچهٔ خانوادهٔ Ofpra: شما ازدواج کرده‌اید و Ofpra گواهی ازدواج شما را صادر کرده است",
          "text": "<p dir=\"rtl\" style=\"text-align: right;\"><b><strong class=\"rtri-bold\">اگر</strong></b><span> </span><u><b><strong class=\"rtri-bold rtri-underline\">قبل از</strong></b></u><span> </span><b><strong class=\"rtri-bold\">حمایت خود ازدواج کرده باشید</strong></b><span> و Ofpra گواهی ازدواج شما را ایجاد کرده باشد، Ofpra به طور خودکار برای شما یک دفترچه سابقه خانوادگی ارسال می کند.</span></p><p dir=\"rtl\" style=\"text-align: right;\"><span>در داخل دفترچه ثبت خانواده اسامی زیر نوشته می شود:</span></p><ul><li value=\"1\"><span>نام شما</span></li><li value=\"2\"><span>نام شخصی که با او ازدواج کرده اید</span></li><li value=\"3\"><span>نام فرزندان متولد شده از این ازدواج که در فرانسه حضور دارند</span></li></ul><p dir=\"rtl\" style=\"text-align: right;\"><span>اگر فرزندی از این ازدواج در فرانسه متولد شود، نام آن را شهرداری محل تولد پس از تولد خواهد نوشت.</span></p><div class=\"callout callout--important\" data-callout=\"important\" data-title=\"Important\"><span>اگر فرزندان شما در فرانسه حضور نداشته باشند، نمی توانند در دفترچه ثبت خانواده درج شوند.</span><br><br><span>در موارد خاص، Ofpra برای نوشتن اسامی خاص در دفترچه سوابق خانواده به اطلاعات بیشتری نیاز دارد.</span></div>"
        },
        "964d9bb5-4b57-40e6-bafb-2596d16a9095": {
          "title": "داشتن دفترچهٔ خانوادهٔ Ofpra :Ofpra گواهیازدواج شما را صادر نکرده است",
          "text": "<p dir=\"rtl\" style=\"text-align: right;\"><span>اگر فرزندانی دارید که در خارج از کشور متولد شده اند و همزمان با شما پناهندگی گرفته اند، Ofpra برای شما یک دفترچه ثبت خانواده برای </span><b><strong class=\"rtri-bold\">والدین مجرد یا والدینی که با هم زندگی می کنند ارسال می کند.</strong></b></p><p dir=\"rtl\" style=\"text-align: right;\"><span>اسامی زیر در دفترچه نوشته خواهد شد:</span></p><ul><li value=\"1\"><span>نام شما</span></li><li value=\"2\"><span>نام والدین دیگر اگر آن‌ها نیز توسط اوپرا محافظت می شوند</span></li><li value=\"3\"><span>نام فرزندان متولد شده از این ازدواج که در فرانسه حضور دارند.</span></li></ul><p dir=\"rtl\" style=\"text-align: right;\"><span>اگر فرزندی از این ازدواج در فرانسه متولد شود، نام آن را شهرداری محل تولد پس از تولد خواهد نوشت.</span></p><div class=\"callout callout--important\" data-callout=\"important\" data-title=\"Important\"><span>اگر ازدواج شما توسط Ofpra به رسمیت شناخته نشود (تعدد زوجات، رعایت نشدن قانون کشور مبدأ، یکی از زوجین زیر 16 سال سن داشته باشد)، شما به عنوان والدین مشترک محسوب خواهید شد.</span><br><br><span>اگر فرزندان شما در فرانسه حضور نداشته باشند، شما دفترچهٔ خانواده دریافت نخواهید کرد.</span><br><br><span>در موارد خاص، Ofpra برای نوشتن اسامی خاص در دفترچه سوابق خانواده به اطلاعات بیشتری نیاز دارد.</span></div>"
        },
        "21887132-46cf-457c-8ed6-3bfe691da7c7": {
          "title": "داشتن دفترچهٔ خانوادهٔ Ofpra: فرزندان شما  فرزندان شما پس از محافظت شما به فرانسه آمده اند",
          "text": "<p dir=\"rtl\" style=\"text-align: right;\"><span>اگر فرزندان شما </span><u><b><strong class=\"rtri-bold rtri-underline\">پس از</strong></b></u><span> </span><b><strong class=\"rtri-bold\">حافظت شما</strong></b><span> </span><b><strong class=\"rtri-bold\">وارد فرانسه شوند</strong></b><span>، می توانید یک دفترچه ثبت خانواده با اصل شناسنامه و مدرک حضور آنها در فرانسه از Ofpra درخواست کنید.</span></p><p dir=\"rtl\" style=\"text-align: right;\"><span>اگر قبلاً یک دفترچه ثبت خانواده Ofpra دارید، می‌توانید درخواست کنید که نام فرزندان شما نیز در آن درج شود.</span></p><p dir=\"rtl\" style=\"text-align: right;\"><span>برای این کار باید مدارک خود را از طریق پست به Ofpra با فرم مربوطه ارسال کنید: [</span><a href=\"https://www.ofpra.gouv.fr/libraries/pdf.js/web/viewer.html?file=/sites/default/files/2023-02/230217%20Formulaire%20Actes%20en%20d%C3%A9p%C3%B4t.pdf\" rel=\"noopener\" class=\"rtri-link\"><span>لینک به فرم مربوطه درخواست ثبت نام در دفترچهٔ خانوادهٔ Ofpra</span></a><span>] </span></p><div class=\"callout callout--info\" data-callout=\"info\" data-title=\"Bon à savoir\"><span>اگر فرزندان شما نیز درخواست پناهندگی دهند و موفق به دریافت آن شوند، در صورتی که قبلاً دفترچهٔ خانوادهٔ Ofpra نداشته‌اید، دفترچهٔ خانوادهٔ جدیدی برای شما صادر خواهد شد. اگر قبلاً دفترچهٔ خانوادهٔ Ofpra داشته‌اید، دفترچهٔ شما تکمیل خواهد شد.</span></div>"
        },
        "104bf3ba-0848-418e-a6f6-6ca74f3a9181": {
          "title": "داشتن دفترچهٔ خانوادهٔ شهرداری (Mairie): شما در فرانسه ازدواج کرده‌اید\n\n",
          "text": "<p dir=\"rtl\" style=\"text-align: right;\"><b><strong class=\"rtri-bold\">اگر در فرانسه ازدواج کرده اید</strong></b><span> و قبلاً دفترچهٔ خانواده نداشته باشید، تالار شهر محل برگزاری ازدواج، دفترچهٔ خانواده را در همان روز به شما میدهد.</span></p><p dir=\"rtl\" style=\"text-align: right;\"><span>اگر قبلاً دفترچه ثبت خانواده برای والدینی که با هم زندگی می کنند داشته باشید، شهرداری دفتر ثبت خانواده را همراه با سند ازدواج تکمیل می کند.</span></p>"
        },
        "c5009aa7-6e17-47fc-a7e3-a2e4254a6ad5": {
          "title": "داشتن دفترچهٔ خانوادهٔ شهرداری: شما ازدواج نکرده اید و فرزند شما در فرانسه به دنیا آمده است",
          "text": "<p dir=\"rtl\" style=\"text-align: right;\"><b><strong class=\"rtri-bold\">اگر متاهل نیستید و فرزندتان در فرانسه به دنیا آمده است،</strong></b><span> شهرداری محل تولد فرزند شما در فرانسه، دفترچه سوابق خانوادگی شما را ارسال می کند.</span></p><p dir=\"rtl\" style=\"text-align: right;\"><span>اگر فقط فرزند شما تحت محافظت Ofpra باشد و والدین تحت محافظت Ofpra نباشند، نه Ofpra و نه شهرداری شهر می توانند دفترچه ثبت خانواده صادر کنند.</span></p><div class=\"callout callout--info\" data-callout=\"info\" data-title=\"Bon à savoir\"><span>لازم نیست شما با Ofpra تماس بگیرید، بلکه شهرداری این کار را انجام خواهد داد تا دفترچهٔ خانواده به درستی تکمیل شود.</span></div>"
        },
        "2a470cc2-611d-47dc-a4ab-dab5df44d53d": {
          "title": "نداشتن دفترچه ثبت خانواده: موارد دیگر",
          "text": "<p dir=\"rtl\" style=\"text-align: right;\"><span>در برخی موارد، شما </span><b><strong class=\"rtri-bold\">دفترچه ثبت خانواده دریافت </strong></b><span>نمی کنید.</span></p><p dir=\"rtl\" style=\"text-align: right;\"><span>در این شرایط نیازی به درخواست دفترچهٔ خانواده از Ofpra یا شهرداری فرانسه نیست:</span></p><ul><li value=\"1\"><span>اگر مجرد هستید و فرزندی ندارید</span></li><li value=\"2\"><span>اگر متاهل نیستید و فرزندانتان در فرانسه حضور ندارند</span></li><li value=\"3\"><span>اگر ازدواج شما توسط Ofpra به رسمیت شناخته نشده است و فرزندی ندارید یا فرزندانتان در فرانسه حضور ندارند</span></li><li value=\"4\"><span>اگر پس از محافظت Ofpra در خارج از فرانسه ازدواج کرده اید و کشوری که در آن ازدواج کرده‌اید، دفترچهٔ خانواده صادر نمی‌کند.</span><br></li></ul><div class=\"callout callout--important\" data-callout=\"important\" data-title=\"Important\"><span>نداشتن دفترچهٔ خانواده مانع از درخواست شما برای پیوستن همسر یا فرزندانتان به شما در فرانسه نمی‌شود.</span><br><a href=\"https://refugies.info/fr/demarche/5e3d2572ca16ad0056c9dc48\" rel=\"noopener\" class=\"rtri-link\"><span>برای اطلاعات بیشتر در مورد الحاق خانواده، می توانید به این برگه Réfugiés.info مراجعه کنید.</span></a></div>"
        },
        "cb42d013-b986-413d-8fdf-92ad937a0d4e": {
          "title": "یکی از اعضای خانواده شما در دفترچهٔ خانواده ثبت نشده است",
          "text": "<p dir=\"rtl\" style=\"text-align: right;\"><span>ممکن است شما یک دفترچهٔ خانواده داشته باشید، اما تمام اعضای خانواده شما در آن ثبت نشده باشند.</span></p><p dir=\"rtl\" style=\"text-align: right;\"><span>چندین موارد وجود دارد که این را وجه توضیح می دهد:</span></p><ul><li value=\"1\"><span>فرزندان شما در فرانسه حضور ندارند</span></li><li value=\"2\"><span>اگر چند همسر دارید (تعدد زوجات \"چند همسری\" در فرانسه مجاز نیست و تنها همسر اول همسر شما محسوب می شود.</span></li><li value=\"3\"><span>اگر یکی از فرزندان شما قبل از تصمیم Ofpra فوت شده باشد</span></li><li value=\"4\"><span>اگر با چند همسر فرزند داشته باشید، چندین دفترچهٔ خانواده خواهید داشت.</span></li></ul><div class=\"callout callout--info\" data-callout=\"info\" data-title=\"Bon à savoir\"><span>در این موارد نیازی به تماس با Ofpra نیست.</span></div>"
        }
      },
      "next": {
        "f5fef43c-c548-443c-952b-588ac144a6b1": {
          "title": "اگر دفترچه ثبت خانواده خود را گم کردید یا اگر به دفترچه ثبت خانواده دوم نیاز دارید",
          "text": "<p dir=\"rtl\" style=\"text-align: right;\"><span>اگر دفترچه خانوادگی خود را گم کرده اید یا به یک دفترچه دوم خانواده نیاز دارید (مثلا پس از جدایی)، امکان درخواست </span><b><strong class=\"rtri-bold\">مثنی</strong></b><span> از شهرداری محل سکونت خود دارید.</span></p><p dir=\"rtl\" style=\"text-align: right;\"><span>شهرداری با ادارهٔ ذیصلاح تماس خواهد گرفت.</span></p>"
        },
        "bafec7ec-6d4c-445c-af40-7d833f83baeb": {
          "title": "در صورت ازدواج یا طلاق",
          "text": "<ul><li value=\"1\"><b><strong class=\"rtri-bold\">اگر Ofpra برای شما یک دفترچه سابقه خانوادگی به عنوان یک زندگی مشترک صادر کرده است و شما تصمیم ازدواج دارید</strong></b><span>، شهرداری محل ازدواج برای شما یک دفترچه سابقه خانوادگی جدید صادر می کند یا دفترچه ثبت خانواده را که قبلاً توسط Ofpra صادر شده است تکمیل می کند.</span></li><li value=\"2\"><b><strong class=\"rtri-bold\">اگر Ofpra برای شما دفترچه ثبت خانواده و گواهی ازدواج صادر کرده باشد و تصمیم طلاق بگیرید</strong></b><span>، Ofpra دفترچه ثبت خانواده شما را به روز می کند.</span></li><li value=\"3\"><b><strong class=\"rtri-bold\">اگر دفترچه ثبت خانواده ای دارید که توسط تالار شهر صادر شده است و تصمیم ازدواج دارید</strong></b><span>، شهرداری محل ازدواج شما یک دفترچه ثبت خانواده جدید برای شما صادر می کند.</span></li><li value=\"4\"><b><strong class=\"rtri-bold\">اگر تصمیم طلاق دارید،</strong></b><span> شهرداری که سند ازدواج را تنظیم کرده است، دفترچه ثبت خانواده شما را به روز می کند.</span></li></ul>"
        }
      },
      "titreMarque": ""
    },
    created_at: new Date("2023-12-04T15:46:33.087Z"),
    validatorId: new ObjectId("604d227fb90cfa0014682490")
  }
}
demarche.map = []
demarche.created_at = new Date("2023-09-28T14:08:42.886Z")
demarche.updatedAt = new Date("2023-12-07T14:47:44.773Z")
demarche.lastModificationDate = new Date("2023-12-01T13:51:58.427Z")
demarche.draftReminderMailSentDate = new Date("2023-10-17T08:00:01.635Z")
demarche.theme = new ObjectId("63450dd43e23cd7181ba0b26")
demarche.metadatas = {
  "location": "france",
  "frenchLevel": null,
  "age": null,
  "price": null,
  "publicStatus": [
    "refugie",
    "subsidiaire",
    "apatride",
    "french"
  ],
  "public": [
    "family"
  ],
  "conditions": null,
  "timeSlots": []
}
demarche.mainSponsor = new ObjectId("63ef5c87226626966d9272d0")
demarche.hasDraftVersion = false
demarche.publishedAt = new Date("2023-12-01T13:57:31.392Z")
demarche.publishedAtAuthor = new ObjectId("5fbd620b2e78910014405443")
demarche.notificationsSent = {}

export { demarche }
