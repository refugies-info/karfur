import { wrapper } from "services/configureStore";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export const defaultStaticProps = wrapper.getStaticProps(() => async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || "fr", ["common"])),
    }
  };
});
