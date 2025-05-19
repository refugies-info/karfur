import { FrIconClassName, RiIconClassName } from "@codegouvfr/react-dsfr";

type IconName = FrIconClassName | RiIconClassName;

interface IconProps {
  name: IconName;
  size?: number; // en px
  className?: string;
  color?: string; // si tu veux override le bg
}

export function Icon({ name, size = 24, className = "", color = "currentColor" }: IconProps) {
  const maskUrl = `/${name}.svg`;

  return (
    <span
      className={`inline-block ${className}`}
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        WebkitMaskImage: `url(${maskUrl})`,
        WebkitMaskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        WebkitMaskSize: "contain",
        maskImage: `url(${maskUrl})`,
        maskRepeat: "no-repeat",
        maskPosition: "center",
        maskSize: "contain",
      }}
    />
  );
}
