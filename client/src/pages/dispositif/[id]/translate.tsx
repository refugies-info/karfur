import { wrapper } from "services/configureStore";
import { END } from "redux-saga";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { fetchSelectedDispositifActionCreator } from "services/SelectedDispositif/selectedDispositif.actions";
import { getLanguageFromLocale } from "lib/getLanguageFromLocale";
import { fetchThemesActionCreator } from "services/Themes/themes.actions";
import { FormProvider, useForm } from "react-hook-form";
import PageContext from "utils/pageContext";
import DispositifTranslate from "components/Content/DispositifTranslate";
import { useDispositifTranslateForm } from "hooks/dispositif";
import { fetchUserActionCreator } from "services/User/user.actions";
import API from "utils/API";
import { GetTraductionsForReviewResponse, TranslationContent } from "api-types";

interface Props {
  history: string[];
  traductions: GetTraductionsForReviewResponse;
  defaultTraduction: TranslationContent;
}

const DispositifPage = (props: Props) => {
  const { dispositifFormContext, methods } = useDispositifTranslateForm(props.traductions);

  return (
    <PageContext.Provider value={dispositifFormContext}>
      <FormProvider {...methods}>
        <div className="w-100">
          <form>
            <DispositifTranslate traductions={props.traductions} defaultTraduction={props.defaultTraduction} />
          </form>
        </div>
      </FormProvider>
    </PageContext.Provider>
  );
};

export const getServerSideProps = wrapper.getServerSideProps((store) => async ({ req, query, locale }) => {
  if (!req.cookies.authorization) {
    return { notFound: true }; // TODO: not authorized? redirect to login?
  }
  const dispositifId: string | undefined = query.id as string;

  if (dispositifId) {
    const action = fetchSelectedDispositifActionCreator({
      selectedDispositifId: dispositifId as string,
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
  if (!dispositif || dispositif.typeContenu !== "dispositif") {
    return { notFound: true };
  }

  const authOptions = { token: req.cookies.authorization };
  const traductions = await API.getTraductionsForReview(
    {
      dispositif: dispositifId || "",
      language: (query.language as string) || "",
    },
    authOptions,
  ).then(({ data }) => data.data);

  const defaultTraduction = await API.getDefaultTraductionForDispositif(
    {
      dispositif: dispositifId || "",
    },
    authOptions,
  ).then(({ data }) => data.data.translation);

  // 200
  return {
    props: {
      ...(await serverSideTranslations(getLanguageFromLocale(locale), ["common"])),
      traductions,
      defaultTraduction,
    },
  };
});

export default DispositifPage;
