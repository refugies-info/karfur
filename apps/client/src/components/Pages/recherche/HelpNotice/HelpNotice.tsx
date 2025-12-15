import Notice from "@codegouvfr/react-dsfr/Notice";
import { useLocale } from "~/hooks";

interface NoticeContentItem {
  title?: string;
  link: string;
  text: string;
  className?: string;
}

export const HelpNotice = ({ className }: { className?: string }) => {
  const noticeContent = {
    fr: {
      title: "Réfugiés.info a été nommé Service numérique à impact national ! ",
      link: "https://beta.gouv.fr/startups/refugies.info#impact",
      text: "Découvrir l'impact du projet.",
    },
    en: {
      link: "https://refugies.typeform.com/impact-EN-jan25",
      text: "🎤 👋 Help us improve Réfugiés.info!",
    },
    ps: {
      link: "https://refugies.typeform.com/impact-PA-jan25",
      text: "🎤 👋 موږ ته ووایاست چې تاسو د Réfugiés.info په اړه څه فکر کوئ!",
    },
    fa: {
      link: "https://refugies.typeform.com/impact-FA-jan25",
      text: "🎤 👋 نظر شما در مورد Réfugiés.info چیست!",
    },
    ru: {
      link: "https://refugies.typeform.com/impact-RU-jan25",
      text: "🎤 👋 Расскажите нам, что вы думаете о Réfugiés.info!",
    },
    ar: {
      link: "https://refugies.typeform.com/impact-AR-jan25",
      text: "[استبيان] 🎤👋 ما رأيكم في برنامجنا ؟",
    },
    uk: {
      link: "https://refugies.typeform.com/impact-UK-jan25",
      text: "🎤 👋 Розкажіть нам, що ви думаєте про Réfugiés.info!",
    },
    ti: {
      link: "https://refugies.typeform.com/impact-fr-jan25",
      text: "🎤 👋 ሓብሩና ንምምሕያሽ ዘለኩም ርእይቶ Réfugiés.info ንምምዕባል!",
    },
  };

  const locale = useLocale();

  // Use French as fallback if the current locale is not available
  const content: NoticeContentItem =
    noticeContent[locale as keyof typeof noticeContent] || noticeContent.fr;

  return (
    <Notice
      isClosable
      className={className}
      title={
        <>
          {content.title && content.title}
          <a
            href={content.link}
            target="_blank"
            rel="noopener noreferrer"
            className="!border-0 !underline"
          >
            {content.text}
          </a>
        </>
      }
    />
  );
};
