import type { Id } from "@refugies-info/api-types";
import Link from "next/link";
import { getPath } from "routes";
import gif from "~/assets/annuaire/GIF-annuaire.gif";
import FButton from "~/components/UI/FButton/FButton";
import Image from "~/components/UI/Image";
import { useLocale } from "~/hooks";
import styles from "./Step6.module.scss";

interface Props {
  structureId: string | Id;
}
export const Step6 = (props: Props) => {
  const locale = useLocale();

  return (
    <div className="step6">
      <div style={{ marginTop: "24px" }}>
        <Image src={gif} width={700} height={344} alt="" style={{ objectFit: "contain" }} />
      </div>
      <div className={styles.title}>
        Vos informations sont désormais disponibles dans l’annuaire des acteurs de l’intégration.
      </div>
      <Link
        legacyBehavior
        href={{
          pathname: getPath("/annuaire/[id]", locale),
          query: { id: props.structureId.toString() },
        }}
        passHref
      >
        <FButton type="dark" name="eye-outline" tag="a">
          Voir ma structure dans l&apos;annuaire
        </FButton>
      </Link>
    </div>
  );
};
