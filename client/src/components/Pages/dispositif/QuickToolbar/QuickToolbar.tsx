import React, { useState } from "react";
import { Card, CardBody, Row, Col, Tooltip, Button } from "reactstrap";
import h2p from "html2plaintext";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import { colors } from "colors";
import styles from "./QuickToolbar.module.scss";
import { DispositifContent } from "types/interface";
import { readAudio, stopAudio } from "lib/readAudio";
import { useTranslation } from "next-i18next";
import { useSelector } from "react-redux";
import { ttsActiveSelector } from "services/Tts/tts.selector";
import { languei18nSelector } from "services/Langue/langue.selectors";
import { cls } from "lib/classname";

interface Props {
  show: boolean;
  keyValue: number;
  subkey?: number;
  disableEdit: boolean;
  item: DispositifContent;
  handleContentClick: (arg1: any, arg2: boolean, arg3?: number) => void;
  toggleModal: (arg1: boolean, arg2: string) => void;
  removeItem: (arg1: number, arg2: number | null) => void;
}

const QuickToolbar = (props: Props) => {
  const { t } = useTranslation();
  const [fill, setFill] = useState(new Array(4).fill(false));
  const [tooltipOpen, setTooltipOpen] = useState(new Array(4).fill(false));
  const [isVoiceActiv, setIsVoiceActiv] = useState(false);

  const ttsActive = useSelector(ttsActiveSelector);
  const activeLangue = useSelector(languei18nSelector);

  const _hoverOn = (key: number) => {
    setFill(fill.map((_, i) => key === i));
  };
  const _hoverOff = () => {
    setFill(fill.map(() => false));
  };
  const toggleTooltip = (key: number) => {
    setTooltipOpen(tooltipOpen.map((x, i) => (key === i ? !x : false)));
  };

  const getSectionTitleInCorrectLanguage = (title: string) => {
    if (
      [
        "C'est quoi ?",
        "C'est pour qui ?",
        "Pourquoi c'est intéressant ?",
        "Comment je m'engage ?",
        "La démarche par étapes",
        "Comment faire ?",
        "Et après ?",
      ].includes(title)
    ) {
      return t(`Dispositif.${title}`);
    }

    return title;
  };

  const _onClick = (id: number) => {
    if (props.disableEdit) {
      if (id === 0) {
        props.toggleModal(true, "reaction");
      } else if (id === 1 && !isVoiceActiv) {
        let node: any = props.item;
        if (
          props.subkey !== undefined &&
          props.subkey !== null &&
          props.subkey >= 0 &&
          node.children &&
          node.children.length > 0
        ) {
          node = props.item.children?.[props.subkey];
        }
        setIsVoiceActiv(!isVoiceActiv);
        node &&
          node.title &&
          readAudio(
            h2p(getSectionTitleInCorrectLanguage(node.title)),
            activeLangue,
            () =>
              readAudio(
                h2p(node.content),
                activeLangue,
                () =>
                  readAudio(
                    "",
                    activeLangue,
                    setIsVoiceActiv(!isVoiceActiv),
                    true
                  ),
                true
              ),
            true
          );
      } else if (id === 1 && isVoiceActiv) {
        setIsVoiceActiv(!isVoiceActiv);
        stopAudio();
      }
    } else {
      if (id === 0) {
        props.handleContentClick(props.keyValue, true, props.subkey);
      } else if (id === 2) {
        props.removeItem(props.keyValue, props.subkey || null);
      }
    }
  };

  const showLanguageButton = ["fr", "en", "ar", "ru"].includes(activeLangue);
  if (props.show) {
    if (props.disableEdit) {
      return (
        <Card className={styles.toolbar}>
          <CardBody className={styles.card_body}>
            <Row>
              <Col lg="6" md="6" sm="12" xs="12" className={styles.col}>
                <Button
                  className={cls(styles.btn_pill, styles.unactive)}
                  id="eva-icon-0"
                  onMouseEnter={() => _hoverOn(0)}
                  onMouseLeave={_hoverOff}
                  onClick={() => _onClick(0)}
                >
                  <EVAIcon
                    name={"message-circle" + (fill[0] ? "" : "-outline")}
                    fill={colors.gray90}
                  />
                  <Tooltip
                    className={styles.tooltip_dark_back}
                    placement="top"
                    isOpen={tooltipOpen[0]}
                    target="eva-icon-0"
                    toggle={() => toggleTooltip(0)}
                  >
                    {t("Dispositif.réagir", "réagir")}
                  </Tooltip>
                </Button>
              </Col>
              {showLanguageButton && (
                <Col md="6" xs="12" className={styles.col}>
                  <Button
                    className={cls(
                      styles.btn_pill,
                      isVoiceActiv ? styles.active : styles.unactive,
                    )}
                    id="eva-icon-1"
                    onMouseEnter={() => _hoverOn(1)}
                    onMouseLeave={_hoverOff}
                    onClick={() => _onClick(1)}
                  >
                    <EVAIcon
                      name={
                        "volume-up" + (fill[1] || ttsActive ? "" : "-outline")
                      }
                      fill={isVoiceActiv ? colors.gray10 : colors.gray90}
                    />

                    <Tooltip
                      className={styles.tooltip_dark_back}
                      placement="top"
                      isOpen={tooltipOpen[1]}
                      target="eva-icon-1"
                      toggle={() => toggleTooltip(1)}
                    >
                      {t("Dispositif.écouter", "écouter")}
                    </Tooltip>
                  </Button>
                </Col>
              )}
            </Row>
          </CardBody>
        </Card>
      );
    }
    return null;
  }
  return null;
};

export default QuickToolbar;
