import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm, FormProvider } from "react-hook-form";
import { wrapper } from "services/configureStore";
import { END } from "redux-saga";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useChangeLanguage, useLocale } from "hooks";
import { fetchSelectedDispositifActionCreator } from "services/SelectedDispositif/selectedDispositif.actions";
import { fetchUserActionCreator } from "services/User/user.actions";
import { getLanguageFromLocale } from "lib/getLanguageFromLocale";
import { fetchThemesActionCreator } from "services/Themes/themes.actions";
import PageContext from "utils/pageContext";
import { selectedDispositifSelector } from "services/SelectedDispositif/selectedDispositif.selector";
import { UpdateDispositifRequest } from "api-types";
import { getDefaultValue, submitUpdateForm } from "lib/dispositifForm";
import Dispositif from "components/Content/Dispositif";
import { fetchAllStructuresActionsCreator } from "services/AllStructures/allStructures.actions";

interface Props {
  history: string[];
}

const DemarchePage = (props: Props) => {
  const dispositif = useSelector(selectedDispositifSelector);
  const methods = useForm<UpdateDispositifRequest>({ defaultValues: getDefaultValue(dispositif) });
  const onSubmit = (data: UpdateDispositifRequest) => {
    if (!dispositif?._id) return;
    submitUpdateForm(dispositif._id, data);
  };
  const [activeSection, setActiveSection] = useState("");

  const locale = useLocale();
  const { changeLanguage } = useChangeLanguage();
  useEffect(() => {
    if (locale !== "fr") {
      changeLanguage("fr");
    }
  }, [locale, changeLanguage]);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchAllStructuresActionsCreator());
  }, [dispatch]);

  return (
    <PageContext.Provider value={{ mode: "edit", activeSection, setActiveSection }}>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <Dispositif />
        </form>
      </FormProvider>
    </PageContext.Provider>
  );
};

export const getServerSideProps = wrapper.getServerSideProps((store) => async ({ query, locale }) => {
  if (query.id) {
    const action = fetchSelectedDispositifActionCreator({
      selectedDispositifId: query.id as string,
      locale: locale || "fr",
    });
    store.dispatch(action);
    store.dispatch(fetchThemesActionCreator());
    store.dispatch(fetchUserActionCreator());
    store.dispatch(END);
    await store.sagaTask?.toPromise();
  }

  // 404
  const dispositif = store.getState().selectedDispositif;
  if (!dispositif || dispositif.typeContenu !== "demarche") {
    /* TODO: check authorization */
    return { notFound: true };
  }

  // 200
  return {
    props: {
      ...(await serverSideTranslations(getLanguageFromLocale(locale), ["common"])),
    },
  };
});

export default DemarchePage;
