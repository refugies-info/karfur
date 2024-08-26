import EVAIcon from "@/components/UI/EVAIcon/EVAIcon";
import { getDispositifSectionTitle, titleKeyType } from "@/lib/getDispositifSectionTitle";
import { selectedDispositifSelector } from "@/services/SelectedDispositif/selectedDispositif.selector";
import { themeSelector } from "@/services/Themes/themes.selectors";
import PageContext from "@/utils/pageContext";
import { CreateDispositifRequest } from "@refugies-info/api-types";
import { useTranslation } from "next-i18next";
import { useContext, useMemo } from "react";
import { useWatch } from "react-hook-form";
import { useSelector } from "react-redux";
import styles from "./SectionTitle.module.scss";

interface TitleProps {
  titleKey: titleKeyType;
  color: string;
}
const Title = (props: TitleProps) => {
  const { t } = useTranslation();
  return (
    <p className={styles.title} style={{ color: props.color }}>
      {props.titleKey === "abstract" && (
        <EVAIcon name="file-text-outline" size={32} fill={props.color} className="me-2" />
      )}
      {t(getDispositifSectionTitle(props.titleKey))}
    </p>
  );
};

interface Props {
  titleKey: titleKeyType;
}
const SectionTitleEdit = (props: Props) => {
  const themeId: CreateDispositifRequest["theme"] = useWatch({ name: "theme" });
  const theme = useSelector(themeSelector(themeId));
  const color = useMemo(() => theme?.colors.color100 || "#000", [theme]);
  return <Title titleKey={props.titleKey} color={color} />;
};
const SectionTitleView = (props: Props) => {
  const dispositif = useSelector(selectedDispositifSelector);
  const theme = useSelector(themeSelector(dispositif?.theme));
  const color = useMemo(() => theme?.colors.color100 || "#000", [theme]);

  return <Title titleKey={props.titleKey} color={color} />;
};

/**
 * Displays automatically the title of a section in the right color for VIEW or EDIT mode
 */
const SectionTitle = (props: Props) => {
  const pageContext = useContext(PageContext);
  return pageContext.mode === "edit" ? (
    <SectionTitleEdit titleKey={props.titleKey} />
  ) : (
    <SectionTitleView titleKey={props.titleKey} />
  );
};

export default SectionTitle;
