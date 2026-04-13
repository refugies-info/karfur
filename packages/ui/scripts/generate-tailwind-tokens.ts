/* eslint-disable no-console */
import fs from "fs-extra";
import postcss from "postcss";

const INPUT_CSS = require.resolve("@codegouvfr/react-dsfr/dsfr/dsfr.min.css");
const OUTPUT_CSS = "./src/css/dsfr-tokens.css"; // Utiliser dsfr-tokens.css pour la sortie

/**
 * Variables CSS de DSFR à exclure du @theme Tailwind car elles entrent en conflit
 * avec des propriétés CSS standard ou des mécanismes internes de Tailwind.
 *
 * Exemple : `--content` est utilisé par DSFR pour les messages d'erreur de formulaire
 * (" - "attr(data-fr-error)...) mais Tailwind v4 l'utilise aussi en interne pour les
 * utilitaires `before:content-*`, ce qui injecte un tiret parasite sur tous les ::before.
 */
const EXCLUDED_VARIABLES = ["content"];

/**
 * Extrait les variables CSS du fichier tokens.css
 */
async function extractCssVariables(filePath: string): Promise<Record<string, string>> {
  const content = fs.readFileSync(filePath, "utf-8");
  const variables: Record<string, string> = {};

  await postcss()
    .process(content, { from: undefined })
    .then((result) => {
      result.root.walkDecls((decl) => {
        if (decl.prop.startsWith("--")) {
          const varName = decl.prop.slice(2);
          if (!EXCLUDED_VARIABLES.includes(varName)) {
            variables[varName] = decl.value;
          }
        }
      });
    });

  return variables;
}

/**
 * Récupère le préfixe pour une variable CSS
 */
function getPrefix(key: string) {
  if (key.startsWith("background-")) return `color-${key}`;
  if (key.startsWith("text-")) return `color-${key}`;
  if (key.startsWith("border-")) return `color-${key}`;
  if (key.startsWith("artwork-")) return `color-${key}`;

  return `${key}`;
}

/**
 * Generates the CSS file with only the variables
 */
function generateCssWithVariables(variables: Record<string, string>) {
  const variableCss = `
/* stylelint-disable at-rule-empty-line-before */
/* stylelint-disable selector-class-pattern */
/* stylelint-disable color-function-notation */
/* stylelint-disable alpha-value-notation */
/* stylelint-disable no-irregular-whitespace */
/* stylelint-disable scss/at-rule-no-unknown */

@import "tailwindcss";

@theme {
${Object.entries(variables)
  .map(([key, value]) => `  --${getPrefix(key)}: ${value};`)
  .join("\n")}
}
  ${Object.entries(variables)
    .map(([key]) => {
      const prefix = getPrefix(key).replace("color-", "").replace("background", "bg");
      const applyStyle = (property: string) => `
@utility ${prefix} {
  @apply ${property}-[var(--color-${key})]
}
`;

      if (key.startsWith("background-")) {
        return applyStyle("bg");
      }
      if (key.startsWith("border-")) {
        return applyStyle("border");
      }
      if (key.startsWith("text-")) {
        return applyStyle("text");
      }
      return null;
    })
    .filter(Boolean)
    .join("\n")}
    `;

  fs.writeFileSync(OUTPUT_CSS, variableCss);
}

/**
 * Exécution du script
 */
async function main() {
  if (!fs.existsSync(INPUT_CSS)) {
    console.error(`Le fichier ${INPUT_CSS} est introuvable.`);
    process.exit(1);
  }

  console.log("📥 Extraction des variables CSS...");
  const variables = await extractCssVariables(INPUT_CSS);

  console.log("📝 Génération du fichier CSS avec les variables...");
  generateCssWithVariables(variables);

  console.log(`✅ Fichier CSS généré : ${OUTPUT_CSS}`);
}

main().catch((err) => {
  console.error("❌ Erreur lors de la génération du CSS:", err);
  process.exit(1);
});
