import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useSelector } from "react-redux";
import { END } from "redux-saga";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { UpdateDispositifRequest } from "@refugies-info/api-types";
import { getDefaultValue, hasMissingAccordions } from "lib/dispositifForm";
import { canEdit } from "lib/dispositif";
import { getLanguageFromLocale } from "lib/getLanguageFromLocale";
import { useDispositifForm } from "hooks/dispositif";
import PageContext from "utils/pageContext";
import { wrapper } from "services/configureStore";
import { fetchSelectedDispositifActionCreator } from "services/SelectedDispositif/selectedDispositif.actions";
import { fetchUserActionCreator } from "services/User/user.actions";
import { fetchThemesActionCreator } from "services/Themes/themes.actions";
import { selectedDispositifSelector } from "services/SelectedDispositif/selectedDispositif.selector";
import Dispositif from "components/Content/Dispositif";
import { ModalAccordionsCount } from "components/Pages/dispositif/Edition/Modals";

interface Props {
  history: string[];
}

const DispositifPage = (props: Props) => {
  const dispositif = useSelector(selectedDispositifSelector);
  const methods = useForm<UpdateDispositifRequest>({ defaultValues: getDefaultValue(dispositif) });
  const dispositifFormContext = useDispositifForm();
  const [showAccordionsCountModal, setShowAccordionsCountModal] = useState(hasMissingAccordions(dispositif, "why"));

  return (
    <PageContext.Provider value={dispositifFormContext}>
      <FormProvider {...methods}>
        <div className="w-100">
          <form>
            <Dispositif />
          </form>
        </div>
      </FormProvider>
      <ModalAccordionsCount show={showAccordionsCountModal} toggle={() => setShowAccordionsCountModal((o) => !o)} />
    </PageContext.Provider>
  );
};

export const getServerSideProps = wrapper.getServerSideProps((store) => async ({ req, query, locale }) => {
  if (query.id) {
    const action = fetchSelectedDispositifActionCreator({
      selectedDispositifId: query.id as string,
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
  const isAllowedToEdit = dispositif ? canEdit(dispositif, store.getState().user.user) : false;
  if (!dispositif || dispositif.typeContenu !== "dispositif" || !isAllowedToEdit) {
    return { notFound: true };
  }

  // 200
  return {
    props: {
      ...(await serverSideTranslations(getLanguageFromLocale(locale), ["common"])),
    },
  };
});

export default DispositifPage;
