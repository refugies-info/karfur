import { DispositifsFilteredState } from "lib/filterContents";
import NoResultPlaceholder from "../NoResultPlaceholder";
import SearchResultCard from "../SearchResultCard";
import { IDispositif, IUserFavorite } from "types/interface";
import styles from "./SearchResults.module.scss";

interface Props {
  queryResults: DispositifsFilteredState;
  embed: boolean;
  pin?: (e: any, dispositif: IDispositif | IUserFavorite)  => void;
  pinnedList?: string[];
  restart?: () => void;
  writeNew?: () => void;
}

export const CityResults = (props: Props) => {
  const {
    filterVille,
    dispositifs,
    dispositifsFullFrance
  } = props.queryResults;

  return (
    <div className={styles.theme_container}>
      <div className={styles.header}>
        <p className={styles.title}>{"Fiches disponibles à "}</p>
        <div className={styles.button}>
          <p className={styles.text_alone}>{filterVille}</p>
        </div>
      </div>
      <div className={styles.theme_grid}>
        {dispositifs.length > 0 ? (
          dispositifs.map((dispositif, index: number) => {
            return (
              <div key={index}>
                <SearchResultCard
                  pin={props.pin}
                  pinnedList={props.pinnedList}
                  dispositif={dispositif}
                  showPinned={!props.embed}
                  linkBlank={props.embed}
                />
              </div>
            );
          })
        ) : (
          <NoResultPlaceholder
            restart={props.restart}
            writeNew={props.writeNew}
          />
        )}
      </div>
      <div className={styles.header}>
        <p className={styles.title}>
          {"Fiches disponibles partout en France"}
        </p>
      </div>
      <div className={styles.theme_grid}>
        {dispositifsFullFrance.length > 0 ? (
          dispositifsFullFrance.map((dispositif, index: number) => {
            return (
              <div key={index}>
                <SearchResultCard
                  pin={props.pin}
                  pinnedList={props.pinnedList}
                  dispositif={dispositif}
                  showPinned={!props.embed}
                  linkBlank={props.embed}
                />
              </div>
            );
          })
        ) : (
          <NoResultPlaceholder
            restart={props.restart}
            writeNew={props.writeNew}
          />
        )}
      </div>
    </div>
  )
}
