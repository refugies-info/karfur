import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { ContentType, CreateDispositifRequest } from "api-types";
import { getPath } from "routes";
import { useChangeLanguage, useLocale } from "hooks";
import { submitCreateForm } from "lib/dispositifForm";
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
  const router = useRouter();
  const methods = useForm<CreateDispositifRequest>({ defaultValues: { typeContenu: ContentType.DISPOSITIF } });
  const onSubmit = async (data: CreateDispositifRequest) => {
    const res = await submitCreateForm(data);
    router.push({
      pathname: getPath("/dispositif/[id]/edit", router.locale),
      query: { id: res.data.data.id.toString() },
    });
  };
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
          <form onSubmit={methods.handleSubmit(onSubmit)}>
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
