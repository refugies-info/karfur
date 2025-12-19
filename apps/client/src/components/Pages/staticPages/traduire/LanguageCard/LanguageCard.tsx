import type { BadgeProps } from "@codegouvfr/react-dsfr/Badge";
import Link from "next/link";
import { useSelector } from "react-redux";
import DSFRBadge from "~/components/UI/Badge";
import Flag from "~/components/UI/Flag";
import { smoothScroll } from "~/lib/smoothScroll";
import type { NeedKey } from "~/pages/traduire";
import { langueSelector } from "~/services/Langue/langue.selectors";

interface Props {
  languageId: string;
  need: NeedKey;
  href: string;
}

const SEVERITIES: Record<NeedKey, BadgeProps["severity"]> = {
  strong: "warning",
  medium: "new",
  weak: "success",
};

const NEED: Record<NeedKey, string> = {
  strong: "fort",
  medium: "moyen",
  weak: "faible",
};

const LanguageCard = (props: Props) => {
  const language = useSelector(langueSelector(props.languageId));

  return (
    <Link
      href={props.href}
      onClick={smoothScroll}
      className="border-default-grey hover:hover-tint inline-flex items-center gap-2 border bg-white p-3 md:p-4"
    >
      <Flag langueCode={language?.langueCode} />
      <span className="text-h6 md:text-h5 font-bold">{language?.langueFr}</span>
      <DSFRBadge severity={SEVERITIES[props.need]}>Besoin {NEED[props.need]}</DSFRBadge>
    </Link>
  );
};

export default LanguageCard;
