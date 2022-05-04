import { wrapper } from "services/configureStore";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { getLanguageFromLocale } from "./getLanguageFromLocale";

export const defaultStaticProps = wrapper.getStaticProps(() => async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(getLanguageFromLocale(locale), ["common"])),
    }
  };
});
