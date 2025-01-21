import Button from "@codegouvfr/react-dsfr/Button";
import { SimpleDispositif } from "@refugies-info/api-types";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { getPath } from "routes";

interface Props {
  nbDemarches: number;
  nbDispositifs: number;
  nbStructures: number;
  demarches: SimpleDispositif[];
  dispositifs: SimpleDispositif[];
}

const ContentSlider = (props: Props) => {
  const { t } = useTranslation();
  const router = useRouter();

  const navigateType = (type: string) => {
    router.push({
      pathname: getPath("/recherche", router.locale),
      query: {
        type: type,
      },
    });
  };

  return (
    <section className="w-full overflow-hidden">
      <div className="container flex items-center justify-between">
        <h2 className="!text-[2rem]">
          {`{${props.nbDemarches}}`} {t("Homepage.infoTypeDemarche")}
        </h2>
        <Button onClick={() => navigateType("demarche")}>{t("Recherche.seeAllButton", "Voir tout")}</Button>
      </div>

      {/* <CardSlider cards={props.demarches} type={ContentType.DEMARCHE} /> */}
      {/* <div>
        <h2>
          {t("Homepage.infoTypeDispositif", {
            countDispositifs: props.nbDispositifs,
            countStructures: props.nbStructures,
          })}
        </h2>
        <Button onClick={() => navigateType("dispositif")}>{t("Recherche.seeAllButton", "Voir tout")}</Button>
      </div>
      <CardSlider cards={props.dispositifs} type={ContentType.DISPOSITIF} /> */}
    </section>
  );
};

export default ContentSlider;
