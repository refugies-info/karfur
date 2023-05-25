import React from "react";
import { useRouter } from "next/router";
import { cls } from "lib/classname";
import { getPath } from "routes";
import ThemesGrid from "components/Content/ThemesGrid";
import commonStyles from "scss/components/staticPages.module.scss";
import styles from "./AllThemes.module.scss";
import { Id } from "@refugies-info/api-types";

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
