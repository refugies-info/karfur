import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { ContentType, CreateDispositifRequest } from "api-types";
import { useChangeLanguage, useLocale } from "hooks";
import { defaultStaticPropsWithThemes } from "lib/getDefaultStaticProps";
import PageContext from "utils/pageContext";
import Dispositif from "components/Content/Dispositif";
import { ModalWelcome } from "components/Pages/dispositif/Edition/Modals";
import { useDispatch } from "react-redux";
import { fetchAllStructuresActionsCreator } from "services/AllStructures/allStructures.actions";

interface Props {
  history: string[];
}

const DispositifPage = (props: Props) => {
  const methods = useForm<CreateDispositifRequest>({ defaultValues: { typeContenu: ContentType.DISPOSITIF } });
  const [activeSection, setActiveSection] = useState("");
  const [showMissingSteps, setShowMissingSteps] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);

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
    <PageContext.Provider
      value={{ mode: "edit", activeSection, setActiveSection, showMissingSteps, setShowMissingSteps }}
    >
      <FormProvider {...methods}>
        <div className="w-100">
          <form>
            <Dispositif typeContenu={ContentType.DISPOSITIF} />
          </form>
        </div>
      </FormProvider>
      <ModalWelcome show={showWelcomeModal} toggle={() => setShowWelcomeModal((o) => !o)} />
    </PageContext.Provider>
  );
};

export const getStaticProps = defaultStaticPropsWithThemes;

export default DispositifPage;
