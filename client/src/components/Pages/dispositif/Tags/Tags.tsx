import React, { useEffect, useState } from "react";
import { Button } from "reactstrap";
import { useRouter } from "next/router";
import { Tag } from "types/interface";
import FSearchBtn from "components/UI/FSearchBtn/FSearchBtn";
import FButton from "components/UI/FButton/FButton";
import Streamline from "assets/streamline";
import styles from "./Tags.module.scss";
import { tags } from "data/tags";
import { useTranslation } from "next-i18next";
import { cls } from "lib/classname";
import { getPath } from "routes";

interface Props {
  tags: Tag[];
  disableEdit: boolean;
  changeTag: (arg1: number, arg2: Tag) => void;
  openTag: () => void;
  toggleTutorielModal: (arg: string) => void;
  displayTuto: boolean;
  updateUIArray: (arg: number) => void;
  isRTL: boolean;
  typeContenu: "dispositif" | "demarche";
}

const Tags = (props: Props) => {
  const router = useRouter();
  const { t } = useTranslation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(
    new Array(props.tags?.length || 0).fill(false)
  );

  useEffect(() => {
    if (props.tags) {
      setIsDropdownOpen(new Array(props.tags.length).fill(false));
    }
  }, [props.tags]);

  const toggleDropdown = (key: number, tag: Tag) => {
    if (props.disableEdit) {
      router.push({
        pathname: getPath("/recherche", router.locale),
        search: "?tag=" + tag.short || tag.name,
      });
    } else {
      setIsDropdownOpen(isDropdownOpen.map((x, i) => (i === key ? !x : false)));
    }
  };

  return (
    <div className={styles.tags}>
      {(props.tags || []).map((tag: Tag, key: number) => {
        if (tag) {
          var tagIcon = tags.find((elem) => elem.name === tag.name);
          return (
            <div key={key}>
              <FSearchBtn
                className="mr-10 color"
                color={(tag.short || "").replace(/ /g, "-")}
                noHover
                onMouseEnter={() => props.updateUIArray(-6)}
              >
                <div className={styles.btn_container}>
                  {tagIcon ? (
                    <div
                      className={cls(
                        styles.icon_container,
                        props.isRTL && styles.rtl,
                      )}
                    >
                      <Streamline
                        name={tagIcon.icon}
                        stroke={"white"}
                        width={20}
                        height={20}
                      />
                    </div>
                  ) : null}
                  {t("Tags." + tag.short)}
                </div>
              </FSearchBtn>
            </div>
          );
        }
        return null;
      })}
      {!props.disableEdit && (props.tags || []).length > 0 ? (
        <Button
          className={cls(styles.plus_btn, styles.icon, "ml-10")}
          onClick={props.openTag}
          onMouseEnter={() => props.updateUIArray(-6)}
        >
          <Streamline name={"tag"} width={26} height={26} />
        </Button>
      ) : !props.disableEdit && (props.tags || []).length < 1 ? (
        <Button
          className={styles.plus_btn + " ml-10"}
          onClick={props.openTag}
          onMouseEnter={() => props.updateUIArray(-6)}
        >
          <Streamline name={"tag"} width={22} height={22} />
          {"Choisir les thèmes"}
        </Button>
      ) : null}
      {!props.disableEdit &&
        props.displayTuto &&
        props.typeContenu === "dispositif" && (
          <div
            style={{ marginLeft: 8 }}
            onMouseEnter={() => props.updateUIArray(-6)}
          >
            <FButton
              type="tuto"
              name={"play-circle-outline"}
              onClick={() => props.toggleTutorielModal("Tags")}
            />
          </div>
        )}
    </div>
  );
};

export default Tags;
