import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { ContentType, CreateDispositifRequest } from "api-types";
import { submitCreateForm } from "lib/dispositifForm";
import { defaultStaticPropsWithThemes } from "lib/getDefaultStaticProps";
import PageContext from "utils/pageContext";
import Dispositif from "components/Content/Dispositif";

interface Props {
  history: string[];
}

const DemarchePage = (props: Props) => {
  const methods = useForm<CreateDispositifRequest>({ defaultValues: { typeContenu: ContentType.DEMARCHE } });
  const onSubmit = (data: CreateDispositifRequest) => submitCreateForm(data);
  const [activeSection, setActiveSection] = useState("");

  return (
    <PageContext.Provider value={{ mode: "edit", activeSection, setActiveSection }}>
      <FormProvider {...methods}>
        <div className="w-100">
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <Dispositif typeContenu={ContentType.DEMARCHE} />
          </form>
        </div>
      </FormProvider>
    </PageContext.Provider>
  );
};

export const getStaticProps = defaultStaticPropsWithThemes;

export default DemarchePage;
