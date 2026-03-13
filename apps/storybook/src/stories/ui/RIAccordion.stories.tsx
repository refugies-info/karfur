import { RIAccordion } from "@refugies-info/ui";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta: Meta<typeof RIAccordion> = {
  title: "UI/Composites/RIAccordion",
  component: RIAccordion,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Ce composant encapsule l'Accordéon du DSFR pour implémenter le design spécifique des blocs 'Dispositif' (Why, How, What) et des toggles Markdown.\n\n" +
          "**Pourquoi cette surcharge ?**\n" +
          "- Pour correspondre au design spécifique : icônes `+` / `-` personnalisées au lieu de la flèche par défaut.\n" +
          "- Pour supporter le badge numéroté (`stepNumber`) à gauche.\n" +
          "- Pour assurer une cohérence visuelle dans toute l'app (Markdown vs React components).\n\n" +
          "**Comment ?**\n" +
          "- On masque le style par défaut du DSFR (la flèche) via CSS/Tailwind.\n" +
          "- On injecte les icônes Remix Icons (`ri-add-fill` et `ri-subtract-fill`) directement dans le label.\n" +
          "- On force l'alignement du bouton avec Flexbox (`!flex !justify-between`) pour gérer proprement l'espacement titre/icônes.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    title: { control: "text" },
    children: { control: "text" },
    stepNumber: { control: "number" },
    defaultExpanded: { control: "boolean" },
    expanded: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof RIAccordion>;

export const Default: Story = {
  args: {
    title: "Comment ça marche ?",
    children: (
      <div className="text-gray-700">
        Voici le contenu de l'accordéon. Il peut contenir du texte, des images ou d'autres
        composants.
      </div>
    ),
  },
};

export const WithStepNumber: Story = {
  args: {
    title: "Vérifier si vous pouvez avoir la nationalité française",
    stepNumber: 1,
    children: (
      <div className="text-gray-700">
        Vous pouvez utiliser ce simulateur en ligne pour vérifier si vous pouvez demander la
        nationalité française.
      </div>
    ),
  },
};

export const LongContent: Story = {
  args: {
    title: "Pourquoi s'inscrire ?",
    children: (
      <div className="space-y-4 text-gray-700">
        <p>
          L'inscription vous permet d'accéder à des fonctionnalités personnalisées comme la
          sauvegarde de vos recherches et la traduction des contenus dans votre langue préférée.
        </p>
        <p>
          En créant un compte, vous pouvez également contribuer en traduisant des fiches ou en
          proposant de nouvelles démarches administratives.
        </p>
        <p>C'est gratuit et ouvert à tous !</p>
      </div>
    ),
  },
};

export const Multiple: Story = {
  render: () => (
    <div className="space-y-4">
      <RIAccordion title="Étape 1" stepNumber={1}>
        Contenu de l'étape 1
      </RIAccordion>
      <RIAccordion title="Étape 2" stepNumber={2}>
        Contenu de l'étape 2
      </RIAccordion>
      <RIAccordion title="Étape 3" stepNumber={3}>
        Contenu de l'étape 3
      </RIAccordion>
    </div>
  ),
};
