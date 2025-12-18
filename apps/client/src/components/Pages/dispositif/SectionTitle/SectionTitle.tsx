import { cn } from "@refugies-info/ui";
import { useTranslation } from "next-i18next";
import { useContext } from "react";
import EVAIcon from "~/components/UI/EVAIcon/EVAIcon";
import { getDispositifSectionTitle, type titleKeyType } from "~/lib/getDispositifSectionTitle";
import PageContext from "~/utils/pageContext";

interface TitleProps {
  titleKey: titleKeyType;
  className?: string;
}
const Title = (props: TitleProps) => {
  const { t } = useTranslation();
  return (
    props.titleKey !== "what" && ( // Hide the 'what' section title as per RI-561
      <h2 className={cn("text-title-lg text-title-grey font-bold", props.className)}>
        {props.titleKey === "abstract" && (
          <EVAIcon name="file-text-outline" size={32} fill="#000" className="me-2" />
        )}
        {t(getDispositifSectionTitle(props.titleKey))}
      </h2>
    )
  );
};

interface Props {
  titleKey: titleKeyType;
  className?: string;
}
const SectionTitleEdit = (props: Props) => {
  return <Title titleKey={props.titleKey} className={props.className} />;
};
const SectionTitleView = (props: Props) => {
  return <Title titleKey={props.titleKey} className={props.className} />;
};

/**
 * Displays automatically the title of a section in the right color for VIEW or EDIT mode
 */
const SectionTitle = (props: Props) => {
  const pageContext = useContext(PageContext);
  return pageContext.mode === "edit" || pageContext.mode === "translate" ? (
    <SectionTitleEdit titleKey={props.titleKey} className={props.className} />
  ) : (
    <SectionTitleView titleKey={props.titleKey} className={props.className} />
  );
};

export default SectionTitle;
