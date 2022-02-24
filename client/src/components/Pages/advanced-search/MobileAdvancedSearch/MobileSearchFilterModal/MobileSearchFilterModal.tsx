import React from "react";
import { Modal } from "reactstrap";
import { useTranslation } from "next-i18next";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import Streamline from "assets/streamline";
import { AvailableFilters, searchTheme, searchAge, searchFrench } from "data/searchFilters";
import styles from "./MobileSearchFilterModal.module.scss";
import { tags } from "data/tags";

interface Props {
  selectOption: (item: string, type: AvailableFilters) => void;
  toggle: () => void;
  type: AvailableFilters;
  show: boolean;
  title: string;
  defaultTitle: string;
  sentence: string;
  defaultSentence: string;
}

export const MobileSearchFilterModal = (props: Props) => {
  const { t } = useTranslation();

  const data =
    props.type === "theme"
      ? searchTheme.children
      : props.type === "age"
      ? searchAge.children
      : props.type === "frenchLevel"
      ? searchFrench.children
      : undefined;

  const selectOption = (item: string, type: AvailableFilters) => {
    props.selectOption(item, type);
    props.toggle();
  };

  const findTag = (tagName: string) => {
    return tags.find(tag => tag.name === tagName);
  }

  return (
    <Modal
      isOpen={props.show}
      toggle={props.toggle}
      className={styles.modal}
      contentClassName={styles.modal_content}
    >
      <div className={styles.title}>
        <p className={styles.title_text}> {t(props.sentence, props.defaultSentence)}</p>
        <button className={styles.title_btn} onClick={props.toggle}>
          {t(props.title, props.defaultTitle)}
          <EVAIcon name="close" fill="#FFFFFF" size="large" />
        </button>
      </div>
      {/* Display list of possible values */}
      {data &&
        data.map((item, index: number) => {
          return (
            <div key={index}>
              {props.type === "theme" ? (
                <button
                  onClick={() => selectOption(item.name, props.type)}
                  className={`${styles.filter_btn} ${styles.theme}`}
                  style={{ backgroundColor: findTag(item.name)?.darkColor}}
                >
                  {t("Tags." + item.name, item.name)}
                  {findTag(item.name)?.icon ? (
                    <Streamline
                      name={findTag(item.name)?.icon}
                      stroke={"white"}
                      width={22}
                      height={22}
                    />
                  ) : null}
                </button>
              ) : props.type === "age" || props.type === "frenchLevel" ? (
                <button
                  onClick={() => selectOption(item.name, props.type)}
                  className={`${styles.filter_btn} ${styles.other}`}
                >
                  <div className="m-auto">
                    {t("Tags." + item.name, item.name)}
                  </div>
                </button>
              ) : null}
            </div>
          );
        })}
    </Modal>
  );
};
