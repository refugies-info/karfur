import { GetDispositifResponse } from "@refugies-info/api-types";
import { MetaDataCard } from "@refugies-info/ui";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import AdminIcon from "~/assets/dispositif/crown.svg";
import Image from "~/components/UI/Image";
import TagName from "~/components/UI/TagName";
import { secondaryThemesSelector, themeSelector } from "~/services/Themes/themes.selectors";
import styles from "./CardTheme.module.scss";

interface Props {
  dataTheme: GetDispositifResponse["theme"] | undefined;
  dataSecondaryThemes: GetDispositifResponse["secondaryThemes"] | undefined;
  color: string;
  onClick?: () => void;
}

const CardTheme = ({ dataTheme, dataSecondaryThemes, color, onClick }: Props) => {
  const theme = useSelector(themeSelector(dataTheme));
  const secondaryThemes = useSelector(secondaryThemesSelector(dataSecondaryThemes));
  const content = useMemo(() => {
    return (
      <div>
        {theme && (
          <span className={styles.badge} style={{ backgroundColor: theme.colors.color100 }}>
            <TagName theme={theme} size={16} />
            <Image src={AdminIcon} width={16} height={16} alt="" className="ms-2" />
          </span>
        )}
        {secondaryThemes.map((theme, i) => (
          <span key={i} className={styles.badge} style={{ backgroundColor: theme.colors.color100 }}>
            <TagName theme={theme} size={16} />
          </span>
        ))}
      </div>
    );
  }, [theme, secondaryThemes]);
  return (
    <MetaDataCard title={"Thèmes"} onClick={onClick}>
      {content}
    </MetaDataCard>
  );
};

export default CardTheme;
