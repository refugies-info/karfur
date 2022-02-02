import { cardTitlesDispositif, cardTitlesDemarche } from "data/dispositif";
import React from "react";
import { Card, CardHeader, CardBody, Col } from "reactstrap";
import { Tag } from "types/interface";
import parentStyles from "./CardParagraphe.module.scss"
import styles from "./PlusCard.module.scss"

interface PlusCardProps {
  addItem: (key: any, type?: string, subkey?: string|null) => void
  keyValue: number;
  cards: string[];
  typeContenu: "dispositif" | "demarche";
  mainTag: Tag;
}

export const PlusCard = (props: PlusCardProps) => {
  const cardTitles =
    props.typeContenu === "dispositif"
      ? cardTitlesDispositif
      : cardTitlesDemarche;
  const availablecardTitlesDispositif = cardTitles.filter(
    (x) => !props.cards.includes(x.title)
  );
  const nextTitle =
    availablecardTitlesDispositif.length > 0
      ? availablecardTitlesDispositif[0].title
      : "";
  return (
    <Col xl="4" lg="6" md="6" sm="12" xs="12" className={parentStyles.card_col}>
      <Card
        className={styles.add_card}
        onClick={() => props.addItem(props.keyValue, "card", nextTitle)}
      >
        <CardHeader className="bg-darkColor" style={{ backgroundColor: props.mainTag.darkColor}}>
          Ajouter un item
        </CardHeader>
        <CardBody className={styles.card_body}>
          <span className={styles.add_sign}>+</span>
        </CardBody>
      </Card>
    </Col>
  );
};
