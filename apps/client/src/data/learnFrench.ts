/**
 * Theme "Apprendre le français" (RI-1522 spike): dispositifs matching this page are those
 * whose `theme` or `secondaryThemes` is this id. Also used to select the theme's `needs` for the
 * "Catégorie" filter (RI-1526) — see `needsSelector`, those already carry their own translations.
 */
export const LEARN_FRENCH_THEME_ID = "63286a015d31b2c0cad9960a";

import type { StaticImageData } from "next/image";
import BookIcon from "~/assets/pictogrammes/book.svg";
import ContractIcon from "~/assets/pictogrammes/contract.svg";
import SuccessIcon from "~/assets/pictogrammes/success.svg";

export interface HowToLearnFrenchCardConfig {
  id: string;
  tagKey: string;
  icon: StaticImageData;
}

/**
 * Static config (dispositif/démarche id + tag + icon) for the 3 cards shown in the "How to learn
 * French" section (RI-1524). Ids confirmed against production content by title match (RI-1522
 * spike); title/description/href are fetched from the id at build time (see
 * getStaticProps in trouver-cours-francais.tsx).
 */
export const HOW_TO_LEARN_FRENCH_CARDS_CONFIG: HowToLearnFrenchCardConfig[] = [
  {
    id: "695e72ee48154115afadec89", // Signer le Contrat d'intégration républicaine (CIR)
    tagKey: "LearnFrench.howTo_tag_arrival",
    icon: ContractIcon,
  },
  {
    id: "69947fe741807e63ce7a7030", // Préparer et passer l'examen civique
    tagKey: "LearnFrench.howTo_tag_mandatory",
    icon: BookIcon,
  },
  {
    id: "63e66c6f1371d6d47fb60ed9", // Avoir une certification officielle du niveau de français
    tagKey: "LearnFrench.howTo_tag_certification",
    icon: SuccessIcon,
  },
];
