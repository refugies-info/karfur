import { Languages } from "@refugies-info/api-types";
import Image from "next/image";
import { useMemo } from "react";
import BubbleFlagBack from "~/assets/dispositif/bubble-flag.svg";
import Flag from "~/components/UI/Flag";
import { useLanguages } from "~/hooks";
import { cls } from "~/lib/classname";
import styles from "./BubbleFlag.module.scss";

interface Props {
  ln: Languages;
  size?: "lg" | "md";
  className?: string;
}

const BubbleFlag = (props: Props) => {
  const { langues } = useLanguages();
  const langueCode = useMemo(
    () => langues.find((language) => language.i18nCode === props.ln)?.langueCode,
    [props.ln, langues],
  );
  const sizePx = useMemo(() => (props.size === "lg" ? 80 : 32), [props.size]);

  return (
    <div
      className={cls(styles.item, styles[props.size || "md"], props.className)}
      style={{ width: sizePx, height: sizePx }}
    >
      <Image src={BubbleFlagBack} width={sizePx} height={sizePx} alt="" className={styles.background} />
      {langueCode && <Flag langueCode={langueCode} className={styles.flag} />}
    </div>
  );
};

export default BubbleFlag;
