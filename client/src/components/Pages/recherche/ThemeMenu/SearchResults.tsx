import { ThemeMenuContext } from "components/Pages/recherche/ThemeMenu/ThemeMenuContext";
import { useLocale } from "hooks";
import React, { useContext } from "react";
import { useSelector } from "react-redux";
import { needsSelector } from "services/Needs/needs.selectors";
import styles from "./SearchResults.module.css";

const SearchResults: React.FC = () => {
  const { search } = useContext(ThemeMenuContext);
  const allNeeds = useSelector(needsSelector);
  const locale = useLocale();
  const selectedNeeds = allNeeds.filter((need) => need[locale].text.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className={styles.container}>
      {selectedNeeds.map((need, i) => {
        return <div key={i}>{need[locale].text}</div>;
      })}
    </div>
  );
};

export default SearchResults;
