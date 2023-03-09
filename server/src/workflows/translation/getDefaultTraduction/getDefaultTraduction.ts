import { getDispositifById } from "../../../modules/dispositif/dispositif.repository";
import { Dispositif, DispositifId } from "../../../typegoose";

const getDefaultTraduction = (dispositifId: DispositifId): Promise<Dispositif["translations"]["fr"]> =>
  getDispositifById(dispositifId).then((dispositif) => dispositif.translations.fr);

export default getDefaultTraduction;
