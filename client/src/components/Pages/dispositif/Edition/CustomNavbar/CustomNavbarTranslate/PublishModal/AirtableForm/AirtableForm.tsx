import Image from "next/image";
import { useSelector } from "react-redux";
import { ContentType, Languages } from "@refugies-info/api-types";
import { selectedDispositifSelector } from "services/SelectedDispositif/selectedDispositif.selector";
import Button from "components/UI/Button";
import AirtableScreenshot from "assets/dispositif/airtable-screenshot.png";
import styles from "./AirtableForm.module.scss";

interface Props {
  locale?: Languages;
}

const AirtableForm = (props: Props) => {
  const dispositif = useSelector(selectedDispositifSelector);
  const prefillDispositif = encodeURI(
    dispositif?.typeContenu === ContentType.DISPOSITIF
      ? `${dispositif?.titreMarque} - ${dispositif?.titreInformatif}`
      : dispositif?.titreInformatif || "",
  );
  const prefillLangue = encodeURI(props.locale?.toUpperCase() || "");

  return (
    <>
      <Image src={AirtableScreenshot} width={524} height={262} alt="Airtable screenshot" />
      <div className="text-center mt-8">
        <Button
          onClick={(e: any) => {
            e.preventDefault();
            window.open(
              `https://airtable.com/shr2i7HLU1eJSsznj?&prefill_Dispositif=${prefillDispositif}&prefill_Langues=${prefillLangue}`,
              "_ blank",
            );
          }}
          evaIcon="arrow-forward-outline"
          iconPosition="right"
        >
          Remplir le formulaire
        </Button>
      </div>
    </>
  );
};

export default AirtableForm;
