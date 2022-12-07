import React from "react";
import { Row } from "reactstrap";
import h2p from "html2plaintext";
import { useTranslation } from "next-i18next";
import { DispositifContent } from "types/interface";
import { infoCardIcon } from "../../../Icon/Icon";
import { jsUcfirst } from "lib";

interface Props {
  menu: DispositifContent[];
  isRTL: boolean;
}

const EnBrefBanner: React.FunctionComponent<Props> = (props: Props) => {
  // display En Bref and a summary of infocards
  const { t } = useTranslation();

  const getTextForAgeInfocard = (
    ageRange: string | undefined,
    bottomValue: number | undefined,
    topValue: number | undefined
  ) => {
    if (ageRange === "De ** à ** ans") {
      return (
        t("Dispositif.De", "De") +
        " " +
        bottomValue +
        " " +
        t("Dispositif.à", "à") +
        " " +
        topValue +
        " " +
        t("Dispositif.ans", "ans")
      );
    }

    if (ageRange === "Moins de ** ans") {
      return (
        t("Dispositif.Moins de", "Moins de") +
        " " +
        topValue +
        " " +
        t("Dispositif.ans", "ans")
      );
    }

    return (
      t("Dispositif.Plus de", "Plus de") +
      " " +
      bottomValue +
      " " +
      t("Dispositif.ans", "ans")
    );
  };

  const rightSection = (props.menu || []).find(
    (x: DispositifContent) => x.title === "C'est pour qui ?"
  );

  const childrenArray =
    rightSection && rightSection.children ? rightSection.children : [];
  return (
    <Row>
      <b className="en-bref">{t("Dispositif.En bref", "En bref")} </b>
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
            card.title && [
              "Niveau de français",
              "Justificatif demandé",
              "Public visé",
            ].includes(card.title)
          ) {
            // @ts-ignore
            texte =
            card.contentTitle &&
            // @ts-ignore
            t("Dispositif." + card.contentTitle, card.contentTitle);
          } else if (card.title === "Combien ça coûte ?") {
            // @ts-ignore
            texte = card.free
            ? t("Dispositif.Gratuit", "Gratuit")
            : card.price +
            " € " +
            // @ts-ignore
                t("Dispositif." + card.contentTitle, card.contentTitle);
          } else if (
            card.title && ["Acte de naissance OFPRA", "Titre de séjour"].includes(card.title)
          ) {
            // @ts-ignore
            texte = t("Dispositif." + card.title, card.title);
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

export default EnBrefBanner;
