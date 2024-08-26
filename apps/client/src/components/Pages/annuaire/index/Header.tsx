import useRTL from "@/hooks/useRTL";
import { GetActiveStructuresResponse } from "@refugies-info/api-types";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { useRouter } from "next/router";
import { getPath } from "routes";
import styles from "./Header.module.scss";
import { SearchBarAnnuaire } from "./SearchBarAnnuaire";

interface Props {
  letters: string[];
  filteredStructures: GetActiveStructuresResponse[] | null;
  typeSelected: string[] | null;
  setTypeSelected: (a: string[]) => void;
  ville: string;
  setVille: (a: string) => void;
  depName: string;
  setDepName: (a: string) => void;
  depNumber: string | null;
  setDepNumber: (a: string) => void;
  isCityFocus: boolean;
  setIsCityFocus: (a: boolean) => void;
  isCitySelected: boolean;
  setIsCitySelected: (a: boolean) => void;
  keyword: string;
  setKeyword: (a: string) => void;
  lettersClickable: string[];
}

export const Header = (props: Props) => {
  const isRTL = useRTL();
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <>
      <div className={styles.grey_block} />
      <div className={styles.back_image} />
      <div className={styles.container}>
        <div className="d-flex">
          {" "}
          <h1 className={`${styles.title} ${isRTL && styles.rtl}`}>{t("Annuaire.Annuaire", "Annuaire")}</h1>
          <SearchBarAnnuaire
            filteredStructures={props.filteredStructures}
            t={t}
            keyword={props.keyword}
            setKeyword={props.setKeyword}
            typeSelected={props.typeSelected}
            setTypeSelected={props.setTypeSelected}
            ville={props.ville}
            setVille={props.setVille}
            depName={props.depName}
            setDepName={props.setDepName}
            depNumber={props.depNumber}
            setDepNumber={props.setDepNumber}
            isCityFocus={props.isCityFocus}
            setIsCityFocus={props.setIsCityFocus}
            isCitySelected={props.isCitySelected}
            setIsCitySelected={props.setIsCitySelected}
          />
        </div>

        <div className={`${styles.letters} ${isRTL && styles.rtl}`}>
          <>
            {props.letters.map((letter) => (
              <Link
                legacyBehavior
                href={getPath(
                  "/annuaire",
                  router.locale,
                  props.lettersClickable.includes(letter.toLocaleUpperCase()) ? "#" + letter.toUpperCase() : "",
                )}
                key={letter}
              >
                <a
                  className={`${styles.letter} ${
                    props.lettersClickable.includes(letter.toLocaleUpperCase()) && styles.clickable
                  }`}
                >
                  {letter.toUpperCase()}
                </a>
              </Link>
            ))}
          </>
        </div>
      </div>
    </>
  );
};
