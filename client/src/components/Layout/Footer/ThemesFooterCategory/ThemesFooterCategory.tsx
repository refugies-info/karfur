import { FooterLink, FooterTopCategory } from "@dataesr/react-dsfr";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { getPath } from "routes";
import { themesSelector } from "services/Themes/themes.selectors";
import { Theme } from "types/interface";

const ThemesFooterCategory = () => {
  const router = useRouter();
  const themes = useSelector(themesSelector);
  return (
    <FooterTopCategory title="Chercher par thématique">
      {themes.map((theme: Theme) => (
        <FooterLink
          asLink={<Link href={`${getPath("/recherche", router.locale)}?themes=${theme._id}`} />}
          key={theme._id.toString()}
        >
          {theme.short[router.locale || "fr"]}
        </FooterLink>
      ))}
    </FooterTopCategory>
  );
};

ThemesFooterCategory.defaultProps = {
  __TYPE: "FooterTopCategory"
};

export default ThemesFooterCategory;
