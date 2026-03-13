import { Accordion } from "@codegouvfr/react-dsfr/Accordion";
import { Alert } from "@codegouvfr/react-dsfr/Alert";
import { Badge } from "@codegouvfr/react-dsfr/Badge";
import { Breadcrumb } from "@codegouvfr/react-dsfr/Breadcrumb";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { CallOut } from "@codegouvfr/react-dsfr/CallOut";
import { Card } from "@codegouvfr/react-dsfr/Card";
import { Checkbox } from "@codegouvfr/react-dsfr/Checkbox";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { Notice } from "@codegouvfr/react-dsfr/Notice";
import { RadioButtons } from "@codegouvfr/react-dsfr/RadioButtons";
import { Select } from "@codegouvfr/react-dsfr/Select";
import { Tabs } from "@codegouvfr/react-dsfr/Tabs";
import { Tag } from "@codegouvfr/react-dsfr/Tag";
import { cn } from "@refugies-info/ui";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta: Meta = {
  title: "UI/DSFR Components",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "This page showcases examples of DSFR (Design System de l&apos;État Français) components used in the Refugies.info application. It serves as a visual reference and documentation for developers to understand how to implement and use these official French government design system components within the application. Each section demonstrates a different component with various configurations and usage examples.",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;

export const Buttons: StoryObj = {
  parameters: {
    layout: "padded",
  },
  render: () => (
    <div className={cn("fr-container", "fr-py-3w")}>
      <h2 className={cn("fr-h2", "fr-mb-2w")}>Buttons</h2>
      <div className={cn("fr-grid-row", "fr-grid-row--gutters")}>
        <div className={cn("fr-col-12", "fr-col-md-4")}>
          <Button>Default Button</Button>
        </div>
        <div className={cn("fr-col-12", "fr-col-md-4")}>
          <Button priority="secondary">Secondary Button</Button>
        </div>
        <div className={cn("fr-col-12", "fr-col-md-4")}>
          <Button priority="tertiary">Tertiary Button</Button>
        </div>
      </div>
    </div>
  ),
};

export const Alerts: StoryObj = {
  render: () => (
    <div className={cn("fr-container", "fr-py-3w")}>
      <h2 className={cn("fr-h2", "fr-mb-2w")}>Alerts</h2>
      <Alert
        severity="info"
        title="Information"
        description="Ceci est une alerte d'information"
        className={cn("fr-mb-2w")}
      />
      <Alert
        severity="success"
        title="Succès"
        description="Ceci est une alerte de succès"
        className={cn("fr-mb-2w")}
      />
      <Alert
        severity="warning"
        title="Avertissement"
        description="Ceci est une alerte d'avertissement"
        className={cn("fr-mb-2w")}
      />
      <Alert severity="error" title="Erreur" description="Ceci est une alerte d'erreur" />
    </div>
  ),
};

export const Accordions: StoryObj = {
  render: () => (
    <div className={cn("fr-container", "fr-py-3w")}>
      <h2 className={cn("fr-h2", "fr-mb-2w")}>Accordions</h2>
      <Accordion label="Cliquez pour ouvrir l'accordéon">
        <p>
          Contenu de l&apos;accordéon. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
          non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed,
          dolor.
        </p>
      </Accordion>
    </div>
  ),
};

export const Badges: StoryObj = {
  render: () => (
    <div className={cn("fr-container", "fr-py-3w")}>
      <h2 className={cn("fr-h2", "fr-mb-2w")}>Badges</h2>
      <div className={cn("fr-grid-row", "fr-grid-row--gutters")}>
        <div className={cn("fr-col-auto")}>
          <Badge severity="info">Info</Badge>
        </div>
        <div className={cn("fr-col-auto")}>
          <Badge severity="success">Succès</Badge>
        </div>
        <div className={cn("fr-col-auto")}>
          <Badge severity="warning">Avertissement</Badge>
        </div>
        <div className={cn("fr-col-auto")}>
          <Badge severity="error">Erreur</Badge>
        </div>
        <div className={cn("fr-col-auto")}>
          <Badge severity="new">Nouveau</Badge>
        </div>
      </div>
    </div>
  ),
};

export const Breadcrumbs: StoryObj = {
  render: () => (
    <div className={cn("fr-container", "fr-py-3w")}>
      <h2 className={cn("fr-h2", "fr-mb-2w")}>Breadcrumb</h2>
      <Breadcrumb
        segments={[
          { label: "Accueil", linkProps: { href: "#" } },
          { label: "Section", linkProps: { href: "#" } },
          { label: "Sous-section", linkProps: { href: "#" } },
        ]}
        currentPageLabel="Page actuelle"
        className={cn("fr-mb-3w")}
      />
    </div>
  ),
};

export const Callouts: StoryObj = {
  render: () => (
    <div className={cn("fr-container", "fr-py-3w")}>
      <h2 className={cn("fr-h2", "fr-mb-2w")}>Callout</h2>
      <CallOut title="Titre du callout" iconId="ri-information-line">
        Contenu du callout. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      </CallOut>
    </div>
  ),
};

export const Cards: StoryObj = {
  render: () => (
    <div className={cn("fr-container", "fr-py-3w")}>
      <h2 className={cn("fr-h2", "fr-mb-2w")}>Cards</h2>
      <div className={cn("fr-grid-row", "fr-grid-row--gutters")}>
        <div className={cn("fr-col-12", "fr-col-md-6")}>
          <Card
            title="Titre de la carte"
            desc="Description de la carte"
            linkProps={{
              href: "#",
            }}
            footer="Footer de la carte"
            enlargeLink
          />
        </div>
        <div className={cn("fr-col-12", "fr-col-md-6")}>
          <Card
            title="Carte avec image"
            desc="Description de la carte avec image"
            linkProps={{
              href: "#",
            }}
            footer="Footer de la carte"
            enlargeLink
            imageAlt="Image d'illustration"
            imageUrl="https://picsum.photos/id/237/600/300"
          />
        </div>
      </div>
    </div>
  ),
};

export const FormElements: StoryObj = {
  render: () => (
    <div className={cn("fr-container", "fr-py-3w")}>
      <h2 className={cn("fr-h2", "fr-mb-2w")}>Form Elements</h2>

      <h3 className={cn("fr-h3", "fr-mb-1w")}>Input</h3>
      <Input
        label="Champ de texte"
        hintText="Texte d'aide pour ce champ"
        className={cn("fr-mb-3w")}
      />

      <h3 className={cn("fr-h3", "fr-mb-1w")}>Select</h3>
      <Select
        label="Sélection"
        hint="Choisissez une option"
        className={cn("fr-mb-3w")}
        nativeSelectProps={{}}
      >
        <option value="">Sélectionnez une option</option>
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
        <option value="3">Option 3</option>
      </Select>

      <h3 className={cn("fr-h3", "fr-mb-1w")}>Checkbox</h3>
      <Checkbox
        options={[
          {
            label: "Option 1",
            hintText: "Description de l&apos;option 1",
            nativeInputProps: {
              name: "checkbox-1",
              value: "1",
            },
          },
          {
            label: "Option 2",
            nativeInputProps: {
              name: "checkbox-1",
              value: "2",
            },
          },
        ]}
        className={cn("fr-mb-3w")}
      />

      <h3 className={cn("fr-h3", "fr-mb-1w")}>Radio Buttons</h3>
      <RadioButtons
        legend="Choix unique"
        hintText="Sélectionnez une seule option"
        options={[
          {
            label: "Option 1",
            hintText: "Description de l&apos;option 1",
            nativeInputProps: {
              value: "1",
              name: "radio-1",
            },
          },
          {
            label: "Option 2",
            nativeInputProps: {
              value: "2",
              name: "radio-1",
            },
          },
        ]}
        className={cn("fr-mb-3w")}
      />
    </div>
  ),
};

export const Notices: StoryObj = {
  render: () => (
    <div className={cn("fr-container", "fr-py-3w")}>
      <h2 className={cn("fr-h2", "fr-mb-2w")}>Notice</h2>
      <Notice
        title="Titre de la notice"
        description="Contenu de la notice. Lorem ipsum dolor sit amet, consectetur adipiscing elit."
      />
    </div>
  ),
};

export const Tags: StoryObj = {
  render: () => (
    <div className={cn("fr-container", "fr-py-3w")}>
      <h2 className={cn("fr-h2", "fr-mb-2w")}>Tags</h2>
      <div className={cn("fr-tags-group")}>
        <Tag>Tag standard</Tag>
        <Tag dismissible>Tag supprimable</Tag>
        <Tag linkProps={{ href: "#" }}>Tag lien</Tag>
        <Tag small={true}>Tag petit</Tag>
      </div>
    </div>
  ),
};

export const TabsExample: StoryObj = {
  render: () => (
    <div className={cn("fr-container", "fr-py-3w")}>
      <h2 className={cn("fr-h2", "fr-mb-2w")}>Tabs</h2>
      <Tabs
        tabs={[
          {
            label: "Onglet 1",
            content: (
              <div className={cn("fr-p-2w")}>
                <p>Contenu de l&apos;onglet 1</p>
              </div>
            ),
          },
          {
            label: "Onglet 2",
            content: (
              <div className={cn("fr-p-2w")}>
                <p>Contenu de l&apos;onglet 2</p>
              </div>
            ),
          },
          {
            label: "Onglet 3",
            content: (
              <div className={cn("fr-p-2w")}>
                <p>Contenu de l&apos;onglet 3</p>
              </div>
            ),
          },
        ]}
      />
    </div>
  ),
};
