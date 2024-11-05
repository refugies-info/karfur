import { ContentType, CreateDispositifRequest } from "@refugies-info/api-types";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { END } from "redux-saga";
import Dispositif from "~/components/Content/Dispositif";
import { ModalWelcome } from "~/components/Pages/dispositif/Edition/Modals";
import { useDispositifForm } from "~/hooks/dispositif";
import { getInitialValue } from "~/lib/dispositifForm";
import { getLanguageFromLocale } from "~/lib/getLanguageFromLocale";
import { wrapper } from "~/services/configureStore";
import { fetchNeedsActionCreator } from "~/services/Needs/needs.actions";
import { clearSelectedDispositifActionCreator } from "~/services/SelectedDispositif/selectedDispositif.actions";
import { fetchThemesActionCreator } from "~/services/Themes/themes.actions";
import { fetchUserActionCreator } from "~/services/User/user.actions";
import PageContext from "~/utils/pageContext";

interface Props {
  history: string[];
}

const DemarchePage = (props: Props) => {
  const methods = useForm<CreateDispositifRequest>({ defaultValues: getInitialValue(ContentType.DEMARCHE) });
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);
  const dispositifFormContext = useDispositifForm();

  // reset dispositif to be considered as creation and not edition
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(clearSelectedDispositifActionCreator());
  }, [dispatch]);

  return (
    <PageContext.Provider value={dispositifFormContext}>
      <FormProvider {...methods}>
        <div className="w-100">
          <form onKeyDown={dispositifFormContext.preventSubmissionOnEnter}>
            <Dispositif typeContenu={ContentType.DEMARCHE} />
          </form>
        </div>
      </FormProvider>
      <ModalWelcome show={showWelcomeModal} toggle={() => setShowWelcomeModal((o) => !o)} />
    </PageContext.Provider>
  );
};

export const getServerSideProps = wrapper.getServerSideProps((store) => async ({ req, query, locale }) => {
  // must be authenticated to access page
  if (!req.cookies.authorization) {
    return {
      redirect: {
        destination: "/auth",
        permanent: false,
      },
    };
  }

  store.dispatch(fetchThemesActionCreator());
  store.dispatch(fetchNeedsActionCreator());
  store.dispatch(fetchUserActionCreator({ token: req.cookies.authorization }));
  store.dispatch(END);
  await store.sagaTask?.toPromise();

  // 200
  return {
    props: {
      ...(await serverSideTranslations(getLanguageFromLocale(locale), ["common"])),
    },
  };
});

export default DemarchePage;
