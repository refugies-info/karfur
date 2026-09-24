import type { DispositifOrigin } from "@refugies-info/api-types";
import Image from "next/image";
import { useTranslation } from "next-i18next";
import { getContentSourceByOrigin } from "~/data/contentSources";

interface Props {
  origin: DispositifOrigin;
  sourceName?: string;
  logoUrl?: string;
}

/**
 * Displays the source information for a dispositif when origin is not RI
 */
const SourceCard = ({ origin, sourceName, logoUrl }: Props) => {
  const { t } = useTranslation();
  const source = getContentSourceByOrigin(origin);

  // Don't display anything if source is not configured and not in dev mode
  if (!source && process.env.NODE_ENV !== "development") {
    return null;
  }

  // Dev mode: show warning if source is missing
  if (!source) {
    return (
      <div className="mb-6 rounded-lg border-2 border-yellow-500 bg-yellow-50 p-4">
        <h3 className="mb-2 text-lg font-bold text-yellow-800">⚠️ Dev Warning</h3>
        <p className="text-sm text-yellow-700">
          Source configuration missing for origin:{" "}
          <code className="rounded bg-yellow-200 px-1 font-mono">{origin}</code>
          <br />
          Please add this origin to{" "}
          <code className="rounded bg-yellow-200 px-1 font-mono">contentSources.ts</code>
        </p>
      </div>
    );
  }

  return (
    <div className="mb-20">
      <h2 className="text-title-grey mb-6 text-[2rem] leading-[2.5rem] font-bold md:mb-8">
        Source
      </h2>
      <div className="flex items-center gap-10">
        <div className="flex-shrink-0">
          <Image
            src={logoUrl ?? source.logo.secure_url}
            alt={`Logo ${sourceName ?? origin}`}
            width={120}
            height={60}
            className="h-[60px] w-[120px] object-contain"
          />
        </div>
        <p className="text-sm mb-0">
          {sourceName && source.textKeyWithSourceName
            ? t(source.textKeyWithSourceName, {
                sourceName,
                interpolation: { escapeValue: false },
              })
            : t(source.textKey)}
        </p>
      </div>
    </div>
  );
};

export default SourceCard;
