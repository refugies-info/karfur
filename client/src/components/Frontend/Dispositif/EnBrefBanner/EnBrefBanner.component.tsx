import React from "react";
import { Row } from "reactstrap";
import { Props } from "./EnBrefBanner.container";
import EVAIcon from "../../../UI/EVAIcon/EVAIcon";
import SVGIcon from "../../../UI/SVGIcon/SVGIcon";
import h2p from "html2plaintext";
import { DispositifContent } from "../../../../@types/interface";

export interface PropsBeforeInjection {
  t: any;
  menu: DispositifContent[];
}

export const EnBrefBanner: React.FunctionComponent<Props> = (props: Props) => {
  // display En Bref and a summary of infocards

  const rightSection = (props.menu || []).find(
    (x: DispositifContent) => x.title === "C'est pour qui ?"
  );

  const childrenArray =
    rightSection && rightSection.children ? rightSection.children : [];
  return (
    <Row>
      <b className="en-bref mt-10">{props.t("En bref", "En bref")} </b>
      {childrenArray.map((card: DispositifContent, key: number) => {
        // selected card, not Important
        if (card.type === "card" && card.title !== "Important !") {
          let texte = card.contentTitle;
          // reformat text of cards age
          if (card.title === "Âge requis") {
            texte =
              card.contentTitle === "De ** à ** ans"
                ? props.t("Dispositif.De", "De") +
                  " " +
                  card.bottomValue +
                  " " +
                  props.t("Dispositif.à", "à") +
                  " " +
                  card.topValue +
                  " " +
                  props.t("Dispositif.ans", "ans")
                : card.contentTitle === "Moins de ** ans"
                ? props.t("Dispositif.Moins de", "Moins de") +
                  " " +
                  card.topValue +
                  " " +
                  props.t("Dispositif.ans", "ans")
                : props.t("Dispositif.Plus de", "Plus de") +
                  " " +
                  card.bottomValue +
                  " " +
                  props.t("Dispositif.ans", "ans");
          } else if (
            [
              "Niveau de français",
              "Justificatif demandé",
              "Public visé",
            ].includes(card.title)
          ) {
            texte =
              card.contentTitle &&
              props.t("Dispositif." + card.contentTitle, card.contentTitle);
          } else if (card.title === "Combien ça coûte ?") {
            texte = card.free
              ? props.t("Dispositif.Gratuit", "Gratuit")
              : card.price +
                " € " +
                props.t("Dispositif." + card.contentTitle, card.contentTitle);
          }
          return (
            <div className="tag-wrapper ml-15" key={key}>
              <div className="tag-item">
                <a href={"#item-head-1"} className="no-decoration">
                  {card.typeIcon === "eva" ? (
                    <EVAIcon
                      name={card.titleIcon}
                      fill="#FFFFFF"
                      className="mr-10"
                    />
                  ) : (
                    <SVGIcon
                      fill="#FFFFFF"
                      width="20"
                      height="20"
                      viewBox="0 0 25 25"
                      name={card.titleIcon}
                      className="mr-10"
                    />
                  )}
                  <span>{h2p(texte)}</span>
                </a>
              </div>
            </div>
          );
        }
        return false;
      })}
    </Row>
  );
};
