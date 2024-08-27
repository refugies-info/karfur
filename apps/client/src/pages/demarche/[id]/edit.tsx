import { UpdateDispositifRequest } from "@refugies-info/api-types";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { FormProvider, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { END } from "redux-saga";
import Dispositif from "~/components/Content/Dispositif";
import { useDispositifForm } from "~/hooks/dispositif";
import { canEdit } from "~/lib/dispositif";
import { getDefaultValue } from "~/lib/dispositifForm";
import { getLanguageFromLocale } from "~/lib/getLanguageFromLocale";
import { wrapper } from "~/services/configureStore";
import { fetchSelectedDispositifActionCreator } from "~/services/SelectedDispositif/selectedDispositif.actions";
import { selectedDispositifSelector } from "~/services/SelectedDispositif/selectedDispositif.selector";
import { fetchThemesActionCreator } from "~/services/Themes/themes.actions";
import { fetchUserActionCreator } from "~/services/User/user.actions";
import PageContext from "~/utils/pageContext";

interface Props {
  history: string[];
}

const DemarchePage = (props: Props) => {
  const dispositif = useSelector(selectedDispositifSelector);
  const methods = useForm<UpdateDispositifRequest>({ defaultValues: getDefaultValue(dispositif) });
  const dispositifFormContext = useDispositifForm();

  return (
    <PageContext.Provider value={dispositifFormContext}>
      <FormProvider {...methods}>
        <div className="w-100">
          <form onKeyDown={dispositifFormContext.preventSubmissionOnEnter}>
            <Dispositif />
          </form>
        </div>
      </FormProvider>
    </PageContext.Provider>
  );
};

export const getServerSideProps = wrapper.getServerSideProps((store) => async ({ req, query, locale }) => {
  if (query.id) {
    const action = fetchSelectedDispositifActionCreator({
      selectedDispositifId: query.id as string,
      locale: "fr",
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
  const isAllowedToEdit = dispositif ? canEdit(dispositif, store.getState().user.user) : false;
  if (!dispositif || dispositif.typeContenu !== "demarche" || !isAllowedToEdit) {
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
