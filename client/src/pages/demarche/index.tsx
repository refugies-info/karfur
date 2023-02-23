import { ContentType, CreateDispositifRequest } from "api-types";
import Dispositif from "components/Content/Dispositif";
import { submitCreateForm } from "lib/dispositifForm";
import { defaultStaticPropsWithThemes } from "lib/getDefaultStaticProps";
import { FormProvider, useForm } from "react-hook-form";
import PageContext from "utils/pageContext";

interface Props {
  history: string[];
}

const DemarchePage = (props: Props) => {
  const methods = useForm<CreateDispositifRequest>({ defaultValues: { typeContenu: ContentType.DEMARCHE } });
  const onSubmit = (data: CreateDispositifRequest) => submitCreateForm(data);

  return (
    <PageContext.Provider value={{ mode: "edit" }}>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <Dispositif typeContenu="demarche" />
          <button type="submit">Enregistrer</button>
        </form>
      </FormProvider>
    </PageContext.Provider>
  );
};

export const getStaticProps = defaultStaticPropsWithThemes;

export default DemarchePage;
