import type { SaveTranslationRequest } from "@refugies-info/api-types";

type TranslatedContent = NonNullable<SaveTranslationRequest["translated"]["content"]>;

const STEP_SECTIONS = ["why", "how", "next"] as const;

export const removeInvalidTranslationValues = (content: TranslatedContent): TranslatedContent => {
  const cleaned: Record<string, unknown> = { ...content };

  STEP_SECTIONS.forEach((section) => {
    const steps = content[section];
    if (!steps) return;
    cleaned[section] = Object.fromEntries(
      Object.entries(steps)
        .map(([id, step]) => [
          id,
          Object.fromEntries(
            Object.entries(step ?? {}).filter(([, value]) => typeof value === "string"),
          ),
        ])
        .filter(([, step]) => Object.keys(step).length > 0),
    );
  });

  return cleaned as TranslatedContent;
};
