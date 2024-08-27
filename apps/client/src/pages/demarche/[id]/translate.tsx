import { ContentType, GetTraductionsForReviewResponse, TranslationContent } from "@refugies-info/api-types";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { FormProvider } from "react-hook-form";
import { END } from "redux-saga";
import { getPath } from "routes";
import DispositifTranslate from "~/components/Content/DispositifTranslate";
import { useDispositifTranslateForm } from "~/hooks/dispositif";
import { canTranslate, getTranslationPageData } from "~/lib/dispositif";
import { getLanguageFromLocale } from "~/lib/getLanguageFromLocale";
import { wrapper } from "~/services/configureStore";
import { fetchSelectedDispositifActionCreator } from "~/services/SelectedDispositif/selectedDispositif.actions";
import { fetchThemesActionCreator } from "~/services/Themes/themes.actions";
import { fetchUserActionCreator } from "~/services/User/user.actions";
import PageContext from "~/utils/pageContext";

interface Props {
  history: string[];
  traductions: GetTraductionsForReviewResponse;
  defaultTraduction: TranslationContent;
}

const DemarchePage = (props: Props) => {
  const { dispositifFormContext, methods } = useDispositifTranslateForm(props.traductions);

  return (
    <PageContext.Provider value={dispositifFormContext}>
      <FormProvider {...methods}>
        <form>
          <DispositifTranslate
            traductions={props.traductions}
            defaultTraduction={props.defaultTraduction}
            typeContenu={ContentType.DEMARCHE}
          />
        </form>
      </FormProvider>
    </PageContext.Provider>
  );
};

export const getServerSideProps = wrapper.getServerSideProps((store) => async ({ req, query, locale }) => {
  const queryLanguage = query.language as string;
  if (!req.cookies.authorization || !queryLanguage) {
    return { notFound: true };
  }

  const dispositifId: string | undefined = query.id as string;
  if (dispositifId) {
    const action = fetchSelectedDispositifActionCreator({
      selectedDispositifId: dispositifId,
      locale: locale || "fr",
      token: req.cookies.authorization,
    });
    store.dispatch(action);
    store.dispatch(fetchThemesActionCreator());
    store.dispatch(fetchUserActionCreator({ token: req.cookies.authorization }));
    store.dispatch(END);
    await store.sagaTask?.toPromise();
  }

  // 404
  const dispositif = store.getState().selectedDispositif;
  if (!dispositif || dispositif.typeContenu !== "demarche") {
    return { notFound: true };
  }

  // already translated and not expert -> redirect
  const isExpert = store.getState().user?.expertTrad || store.getState().user?.admin;
  if (!canTranslate(dispositif, queryLanguage, isExpert)) {
    const path = getPath("/demarche/[id]", locale).replace("[id]", dispositifId);
    return {
      redirect: {
        destination: path,
        permanent: false,
      },
    };
  }

  // get data
  const { traductions, defaultTraduction } = await getTranslationPageData(
    dispositif,
    queryLanguage,
    req.cookies.authorization,
    store.getState().user.user,
  );

  // 200
  return {
    props: {
      ...(await serverSideTranslations(getLanguageFromLocale(locale), ["common"])),
      traductions,
      defaultTraduction,
    },
  };
});

export default DemarchePage;
