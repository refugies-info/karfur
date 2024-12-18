import PublierPage from "~/app/[locale]/publier/page-publier";
import API from "~/utils/API";

async function getData() {
  const dispStatistics = await API.getDispositifsStatistics({
    facets: ["nbVues", "nbVuesMobile", "nbDispositifs", "nbDemarches"],
  });
  const structStatistics = await API.getStructuresStatistics({ facets: ["nbStructures"] });

  return {
    nbVues: (dispStatistics.nbVues || 0) + (dispStatistics.nbVuesMobile || 0),
    nbFiches: (dispStatistics.nbDispositifs || 0) + (dispStatistics.nbDemarches || 0),
    nbStructures: structStatistics.nbStructures || 0,
  };
}

export default async function Publier({ params }: { params: { locale: string } }) {
  const data = await getData();
  return (
    <PublierPage
      nbVues={data.nbVues}
      nbFiches={data.nbFiches}
      nbStructures={data.nbStructures}
      locale={params.locale}
    />
  );
}
