import { useContext } from "react";
import { ContentType } from "api-types";
import PageContext from "utils/pageContext";
import CustomNavbarEdit from "./CustomNavbarEdit";
import CustomNavbarTranslate from "./CustomNavbarTranslate";

interface Props {
  typeContenu: ContentType;
}

/**
 * Navbar of edition or translate mode, which shows progress and validate buttons.
 * Responsible for autosave
 */
const CustomNavbar = ({ typeContenu }: Props) => {
  const { mode } = useContext(PageContext);
  return mode === "translate" ? (
    <CustomNavbarTranslate typeContenu={typeContenu} />
  ) : (
    <CustomNavbarEdit typeContenu={typeContenu} />
  );
};

export default CustomNavbar;
