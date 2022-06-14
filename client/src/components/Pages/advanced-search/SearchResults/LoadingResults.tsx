import LoadingCard from "../LoadingCard";
import styles from "./SearchResults.module.scss";

export const LoadingResults = () => {
  return (
    <div className={styles.theme_container}>
      <div className={styles.header}></div>
      <div className={styles.theme_grid}>
        {new Array(20).fill(true).map((_, index: number) => {
          return <LoadingCard key={index} />;
        })}
      </div>
    </div>
  );
};
