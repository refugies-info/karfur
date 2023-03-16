import { useState } from "react";
import { ContentType, CreateDispositifRequest } from "api-types";
import Dispositif from "components/Content/Dispositif";
import { submitCreateForm } from "lib/dispositifForm";
import { defaultStaticPropsWithThemes } from "lib/getDefaultStaticProps";
import { logger } from "logger";
import { FormProvider, useForm } from "react-hook-form";
import PageContext from "utils/pageContext";

interface Props {
  history: string[];
}

const DispositifPage = (props: Props) => {
  const methods = useForm<CreateDispositifRequest>({ defaultValues: { typeContenu: ContentType.DISPOSITIF } });
  const onSubmit = (data: CreateDispositifRequest) => {
    // submitCreateForm(data)
    logger.info("submit", data);
  };
  const [activeSection, setActiveSection] = useState("");

  return (
    <PageContext.Provider value={{ mode: "edit", activeSection, setActiveSection }}>
      <FormProvider {...methods}>
        <div className="w-100">
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <Dispositif typeContenu={ContentType.DISPOSITIF} />
          </form>
        </div>
      </FormProvider>
    </PageContext.Provider>
  );
};

export const getStaticProps = defaultStaticPropsWithThemes;

export default DispositifPage;
