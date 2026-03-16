import type { Dispositif, DispositifId } from "@refugies-info/mongo";
import { getDispositifById } from "~/modules/dispositif/dispositif.repository";

const getDefaultTraduction = (
  dispositifId: DispositifId,
): Promise<Dispositif["translations"]["fr"]> =>
  getDispositifById(dispositifId).then((dispositif) => dispositif.translations.fr);

export default getDefaultTraduction;
