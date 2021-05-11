import React from "react";
import { Row } from "reactstrap";
import { Props } from "./EnBrefBanner.container";
import h2p from "html2plaintext";
import { DispositifContent } from "../../../../types/interface";
import { infoCardIcon } from "../../../Icon/Icon";
import { jsUcfirst } from "../../../../lib";

export interface PropsBeforeInjection {
  t: any;
  menu: DispositifContent[];
  isRTL: boolean;
}

export const EnBrefBanner: React.FunctionComponent<Props> = (props: Props) => {
  // display En Bref and a summary of infocards

  const getTextForAgeInfocard = (
    ageRange: string | undefined,
    bottomValue: number | undefined,
    topValue: number | undefined
  ) => {
    if (ageRange === "De ** à ** ans") {
      return (
        props.t("Dispositif.De", "De") +
        " " +
        bottomValue +
        " " +
        props.t("Dispositif.à", "à") +
        " " +
        topValue +
        " " +
        props.t("Dispositif.ans", "ans")
      );
    }

    if (ageRange === "Moins de ** ans") {
      return (
        props.t("Dispositif.Moins de", "Moins de") +
        " " +
        topValue +
        " " +
        props.t("Dispositif.ans", "ans")
      );
    }

    return (
      props.t("Dispositif.Plus de", "Plus de") +
      " " +
      bottomValue +
      " " +
      props.t("Dispositif.ans", "ans")
    );
  };

  const rightSection = (props.menu || []).find(
    (x: DispositifContent) => x.title === "C'est pour qui ?"
  );

  const childrenArray =
    rightSection && rightSection.children ? rightSection.children : [];
  return (
    <Row>
      <b className="en-bref">{props.t("Dispositif.En bref", "En bref")} </b>
      {childrenArray.map((card: DispositifContent, key: number) => {
        if (!card) return;
        // selected card, not Important
        if (
          card.type === "card" &&
          card.title !== "Important !" &&
          card.title !== "Justificatif demandé" &&
          card.title !== "Zone d'action"
        ) {
          let texte = card.contentTitle;
          // reformat text of cards age
          if (card.title === "Âge requis") {
            if (card.ageTitle) {
              texte = getTextForAgeInfocard(
                card.ageTitle,
                card.bottomValue,
                card.topValue
              );
            } else {
              texte = getTextForAgeInfocard(
                card.contentTitle,
                card.bottomValue,
                card.topValue
              );
            }
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
          } else if (
            ["Acte de naissance OFPRA", "Titre de séjour"].includes(card.title)
          ) {
            texte = props.t("Dispositif." + card.title, card.title);
          }
          return (
            <div className="tag-wrapper ml-15" key={key}>
              <div className="tag-item">
                <a href={"#item-head-1"} className="no-decoration">
                  {infoCardIcon(card.titleIcon, "#FFFFFF")}
                  <span
                    className={!props.isRTL ? "text-span" : "text-span-rtl"}
                  >
                    {jsUcfirst(h2p(texte))}
                  </span>
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
