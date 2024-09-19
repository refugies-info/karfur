import { Id } from "@refugies-info/api-types";
import { useRouter } from "next/router";
import { getPath } from "routes";
import ThemesGrid from "~/components/Content/ThemesGrid";
import { cls } from "~/lib/classname";
import commonStyles from "~/scss/components/staticPages.module.scss";
import styles from "./AllThemes.module.scss";

interface Props {
  id: string;
}

const AllThemes = (props: Props) => {
  const router = useRouter();

  const navigateTheme = (themeId: Id) => {
    router.push({
      pathname: getPath("/recherche", router.locale),
      query: {
        themes: themeId.toString(),
      },
    });
  };

  return (
    <div id={props.id} className={cls(commonStyles.section, styles.themes)}>
      <ThemesGrid className={commonStyles.container} onClickTheme={(themeId) => navigateTheme(themeId)} />
    </div>
  );
};

export default AllThemes;
