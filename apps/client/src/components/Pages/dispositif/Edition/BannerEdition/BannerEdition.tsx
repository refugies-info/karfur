import { Id } from "@refugies-info/api-types";
import { useWatch } from "react-hook-form";
import Banner from "../../Banner";

/**
 * Get the banner of the dispositif based on the values of the current form.
 */
const BannerEdition = () => {
  const themeId = useWatch<Id>({ name: "theme" });
  return <Banner themeId={themeId} />;
};

export default BannerEdition;
