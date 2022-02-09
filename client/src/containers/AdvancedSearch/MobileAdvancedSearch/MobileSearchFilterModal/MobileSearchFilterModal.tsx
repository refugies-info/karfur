import React from "react";
import { Modal } from "reactstrap";
import { useTranslation } from "next-i18next";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import Streamline from "assets/streamline";
import { initial_data } from "data/searchFilters";
import styles from "./MobileSearchFilterModal.module.scss";
import { tags } from "data/tags";

interface Props {
  selectOption: (item: any, type: string) => void;
  toggle: () => void;
  type: string;
  show: boolean;
  title: string;
  defaultTitle: string;
  sentence: string;
  defaultSentence: string;
}

export const MobileSearchFilterModal = (props: Props) => {
  const { t } = useTranslation();

  const data: any =
    props.type === "thème"
      ? tags
      : props.type === "age"
      ? initial_data.filter(
          (item: { title: string }) => item.title === "J'ai"
        )[0].children
      : props.type === "french"
      ? initial_data.filter(
          (item: { title: string }) => item.title === "Je parle"
        )[0].children
      : null;

  const selectOption = (item: any, type: string) => {
    props.selectOption(item, type);
    props.toggle();
  };

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
        data.map((item: any, index: number) => {
          return (
            <div key={index}>
              {props.type === "thème" ? (
                <button
                  onClick={() => selectOption(item, props.type)}
                  className={`${styles.filter_btn} ${styles.theme}`}
                  style={{ backgroundColor: item.darkColor}}
                >
                  {t("Tags." + item.name, item.name)}
                  {item.icon ? (
                    <Streamline
                      name={item.icon}
                      stroke={"white"}
                      width={22}
                      height={22}
                    />
                  ) : null}
                </button>
              ) : props.type === "age" || props.type === "french" ? (
                <button
                  onClick={() => selectOption(item, props.type)}
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
