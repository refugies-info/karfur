import { Map } from "@refugies-info/ui";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta = {
  title: "UI/Composites/Map",
  component: Map,
  parameters: {
    layout: "fullscreen",
    backgrounds: {
      default: "light",
      values: [
        {
          name: "light",
          value: "#FFFFFF",
        },
        {
          name: "dark",
          value: "#333333",
        },
      ],
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Map>;

export default meta;
type Story = StoryObj<typeof meta>;

const mapData = [
  {
    title: "RHJ Robert Rème",
    address: "8 Avenue Gros Malhon, 35000 Rennes, France",
    city: "Rennes",
    lat: 48.1223722,
    lng: -1.6816899,
    email: "ajouter@votreemail.fr",
    phone: "0299530000",
  },
  {
    title: "RHJ Patio-Saint Martin",
    address: "11 Avenue Gros Malhon, 35000 Rennes, France",
    city: "Rennes",
    lat: 48.1219536,
    lng: -1.6820584,
    email: "ajouter@votreemail.fr",
  },
  {
    title: "RHJ Mille Visages",
    address: "4 Boulevard de Verdun, 35000 Rennes, France",
    city: "Rennes",
    lat: 48.1132483,
    lng: -1.6931352,
    email: "ajouter@votreemail.fr",
  },
  {
    title: "RHJ Le Colibri",
    address: "14 Avenue Jorge Semprún, 35000 Rennes, France",
    city: "Rennes",
    lat: 48.108914,
    lng: -1.6457046,
    email: "ajouter@votreemail.fr",
  },
  {
    title: "RHJ Les Gantelles",
    address: "16 Rue Franz Heller, 35700 Rennes, France",
    city: "Rennes",
    lat: 48.13017099999999,
    lng: -1.6633932,
    email: "ajouter@votreemail.fr",
  },
  {
    title: "RHJ Bourg l'évêque",
    address: "30 Rue de Brest, 35000 Rennes, France",
    city: "Rennes",
    lat: 48.1128516,
    lng: -1.6925208,
    email: "ajouter@votreemail.fr",
  },
  {
    title: "RHJ Coëtlogon",
    address: "193 Rue Saint-Malo, 35000 Rennes, France",
    city: "Rennes",
    lat: 48.12551409999999,
    lng: -1.6857191,
    email: "ajouter@votreemail.fr",
  },
  {
    title: "RHJ Les Bouvreuils",
    address: "9 Allée des Bouvreuils, 35230 Noyal-Châtillon-sur-Seiche, France",
    city: "Noyal-Châtillon-sur-Seiche",
    lat: 48.04163049999999,
    lng: -1.6660836,
    email: "ajouter@votreemail.fr",
  },
  {
    title: "RHJ Mabilais",
    address: "Rue Herminie Prod'homme, 35000 Rennes, France",
    city: "Rennes",
    lat: 48.1056625,
    lng: -1.6947916,
    email: "ajouter@votreemail.fr",
  },
  {
    title: "RHJ Patton",
    address: "1ter Rue du Houx, 35700 Rennes, France",
    city: "Rennes",
    lat: 48.1305117,
    lng: -1.6641906,
    email: "ajouter@votreemail.fr",
  },
];

export const Default: Story = {
  args: {
    title: "Résidences Habitat Jeunes à Rennes",
    description: "Carte des résidences habitat jeunes dans la région de Rennes",
    mapData: mapData,
  },
};

export const WithSingleLocation: Story = {
  args: {
    title: "Résidence Habitat Jeunes",
    description: "Carte d'une résidence habitat jeune à Rennes",
    mapData: [mapData[0]],
    defaultFocusedPoi: mapData[0],
  },
};

export const WithDefaultFocus: Story = {
  args: {
    title: "Résidences Habitat Jeunes à Rennes",
    description: "Carte des résidences habitat jeunes avec focus sur RHJ Le Colibri",
    mapData: mapData,
    defaultFocusedPoi: mapData[3], // RHJ Le Colibri
  },
};

export const WithoutSidebar: Story = {
  args: {
    title: "Résidences Habitat Jeunes à Rennes",
    description: "Carte des résidences habitat jeunes sans barre latérale",
    mapData: mapData,
    showSidebar: false,
  },
};
