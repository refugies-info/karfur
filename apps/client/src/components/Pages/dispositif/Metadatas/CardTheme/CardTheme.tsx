import type { UpdateDispositifRequest } from "@refugies-info/api-types";
import { MetaDataCard } from "@refugies-info/ui";
import { useContext, useMemo } from "react";
import { useSelector } from "react-redux";
import AdminIcon from "~/assets/dispositif/crown.svg";
import Image from "~/components/UI/Image";
import TagName from "~/components/UI/TagName";
import { secondaryThemesSelector, themeSelector } from "~/services/Themes/themes.selectors";
import PageContext from "~/utils/pageContext";
import styles from "./CardTheme.module.scss";

interface Props {
  formData: UpdateDispositifRequest;
}

const CardTheme = ({ formData }: Props) => {
  const theme = useSelector(themeSelector(formData.theme));
  const secondaryThemes = useSelector(secondaryThemesSelector(formData.secondaryThemes));
  const { setActiveModal, formSubmitted } = useContext(PageContext);
  const content = useMemo(() => {
    return (
      <div>
        {theme && (
          <span className={styles.badge} style={{ backgroundColor: theme.colors.color100 }}>
            <TagName className="[&_[fill]]:fill-white" theme={theme} size={16} />
            <Image src={AdminIcon} width={16} height={16} alt="" className="ms-2" />
          </span>
        )}
        {secondaryThemes.map((theme, i) => (
          <span key={i} className={styles.badge} style={{ backgroundColor: theme.colors.color100 }}>
            <TagName className="[&_[fill]]:fill-white" theme={theme} size={16} />
          </span>
        ))}
      </div>
    );
  }, [theme, secondaryThemes]);
  return (
    <MetaDataCard
      state={formSubmitted && theme === undefined ? "invalid" : undefined}
      title={"Thèmes"}
      onClick={() => setActiveModal?.("Themes")}
    >
      {content}
    </MetaDataCard>
  );
};

export default CardTheme;
