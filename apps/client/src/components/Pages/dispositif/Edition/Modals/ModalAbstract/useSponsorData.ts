import { ContentType, CreateDispositifRequest, GetDispositifsResponse } from "@refugies-info/api-types";
import { useMemo } from "react";
import { DeepPartialSkipArrayKey } from "react-hook-form";
import { useSelector } from "react-redux";
import { allStructuresSelector } from "~/services/AllStructures/allStructures.selector";

export const useSponsorData = (values: DeepPartialSkipArrayKey<CreateDispositifRequest>, typeContenu: ContentType) => {
  const structures = useSelector(allStructuresSelector);
  const sponsor: GetDispositifsResponse["sponsor"] = useMemo(() => {
    if (typeContenu === ContentType.DEMARCHE) {
      return {
        nom: values.administration?.name || "",
        picture: {
          secure_url: values.administration?.logo?.secure_url || "",
          imgId: null,
          public_id: null,
        },
      };
    }
    if (typeof values.mainSponsor === "string") {
      const sponsor = structures.find((s) => s._id.toString() === values.mainSponsor);
      return {
        nom: sponsor?.nom || "",
        picture: {
          secure_url: sponsor?.picture?.secure_url || "",
          imgId: null,
          public_id: null,
        },
      };
    }
    return {
      nom: values.mainSponsor?.name || "",
      picture: {
        secure_url: values.mainSponsor?.logo?.secure_url || "",
        imgId: null,
        public_id: null,
      },
    };
  }, [values.mainSponsor, values.administration, structures, typeContenu]);

  return sponsor;
};
