import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { ContentType, CreateDispositifRequest } from "api-types";
import { defaultStaticPropsWithThemes } from "lib/getDefaultStaticProps";
import { getInitialValue } from "lib/dispositifForm";
import PageContext from "utils/pageContext";
import Dispositif from "components/Content/Dispositif";
import { ModalWelcome } from "components/Pages/dispositif/Edition/Modals";
import { useDispositifForm } from "hooks/dispositif";

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

export const getStaticProps = defaultStaticPropsWithThemes;

export default DemarchePage;
