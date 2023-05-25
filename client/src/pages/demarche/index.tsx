import { useState } from "react";
import { END } from "redux-saga";
import { FormProvider, useForm } from "react-hook-form";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { ContentType, CreateDispositifRequest } from "@refugies-info/api-types";
import { getInitialValue } from "lib/dispositifForm";
import { getLanguageFromLocale } from "lib/getLanguageFromLocale";
import PageContext from "utils/pageContext";
import { useDispositifForm } from "hooks/dispositif";
import { wrapper } from "services/configureStore";
import { fetchThemesActionCreator } from "services/Themes/themes.actions";
import { fetchNeedsActionCreator } from "services/Needs/needs.actions";
import { fetchUserActionCreator } from "services/User/user.actions";
import Dispositif from "components/Content/Dispositif";
import { ModalWelcome } from "components/Pages/dispositif/Edition/Modals";

interface Props {
  history: string[];
}

const DemarchePage = (props: Props) => {
  const methods = useForm<CreateDispositifRequest>({ defaultValues: getInitialValue(ContentType.DEMARCHE) });
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);
  const dispositifFormContext = useDispositifForm();

  return (
    <PageContext.Provider value={dispositifFormContext}>
      <FormProvider {...methods}>
        <div className="w-100">
          <form>
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
        destination: "/login",
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
