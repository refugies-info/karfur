const colors: Record<string, string> = {
  darkBlue: "#0421B1",
  black: "#212121",
  darkGrey: "#5E5E5E",
  grey: "#EDEBEB",
  grey60: "#C6C6C6",
  grey70: "#ABABAB",
  white: "#FFFFFF",
  lightGrey: "#F6F6F6",
  admin100: "#443023",
  admin80: "#715F56",
  admin60: "#9D8F88",
  admin40: "#CABEBB",
  admin30: "#EEE7E5",
  français100: "#3D2884",
  français80: "#705FA4",
  français60: "#A396C4",
  français40: "#D6CDE4",
  français30: "#EFE8F4",
  travail100: "#055E5A",
  travail80: "#27A8A5",
  travail60: "#82F2DB",
  travail40: "#D7FAF2",
  travail30: "#EDFDF9",
  formation100: "#095411",
  formation80: "#26B759",
  formation60: "#82E59B",
  formation40: "#D4F4D7",
  formation30: "#E8F4E8",
  logement100: "#06508C",
  logement80: "#1E9ED1",
  logement60: "#88C6E3",
  logement40: "#C1E3F2",
  logement30: "#DDF2F9",
  sante100: "#910940",
  sante80: "#D64B71",
  sante60: "#E78CA2",
  sante40: "#F7CDD4",
  sante30: "#FFEDED",
  mobilite100: "#CD5605",
  mobilite80: "#F97319",
  mobilite60: "#FB9B5A",
  mobilite40: "#FDD7BD",
  mobilite30: "#FEEBDE",
  rencontre100: "#770649",
  rencontre80: "#D01F67",
  rencontre60: "#FC6EB5",
  rencontre40: "#FFC2E5",
  rencontre30: "#FFEAF4",
  etudes100: "#204F01",
  etudes80: "#47AA0A",
  etudes60: "#70CE33",
  etudes40: "#DFFDAD",
  etudes30: "#F2F9E5",
  benevolat100: "#073099",
  benevolat80: "#1C66DD",
  benevolat60: "#5EA5EF",
  benevolat40: "#C4E8F8",
  benevolat30: "#EEF8FF",
  loisirs100: "#600566",
  loisirs80: "#9E2DAD",
  loisirs60: "#D16DEA",
  loisirs40: "#EDC4FC",
  loisirs30: "#F9F1FD",
  culture100: "#9E180A",
  culture80: "#E05A3E",
  culture60: "#EF9887",
  culture40: "#FFD5D0",
  culture30: "#F9E8E8",
  lightBlue: "#DAE0FB",
  blue: "#2D9CDB",
  red: "#B01917",
  lighterRed: "#E8140F",
  green: "#008205",
  lightRed: "#ffcecb",
  greyF7: "#F7F7F7",
  greyDisabled: "#919191",
};

/**
 * Décisions design
 * Permet d'apporter du sens aux noms des couleurs
 */
colors.skeleton = colors.greyDisabled;
colors.action = colors.darkBlue;

const images = {};

const fonts = {
  sizes: {
    verySmall: 13,
    small: 16,
    normal: 19,
    big: 25,
  },
  families: {
    circularStandard: "circularBook",
    circularBold: "circularBold",
    circularItalic: "circularItalic",
  },
  button: {
    family: "circularBook",
    size: "19px",
    weight: "normal",
  },
};

const shadows = {
  xs: `
      shadow-color: ${colors.black};
      shadow-opacity: 0.08;
      shadow-offset: 0px -1px;
      shadow-radius: 8px;
      elevation: 4;
    `,
  sm: `
      shadow-color: ${colors.black};
      shadow-opacity: 0.4;
      shadow-offset: 1px 1px;
      shadow-radius: 2px;
      elevation: 2;
    `,
  lg: `
      shadow-color: ${colors.black};
      shadow-opacity: 0.16;
      shadow-offset: 1px 1px;
      shadow-radius: 8px;
      elevation: 6;
    `,
  needSummary: `
      shadow-opacity: 0.24;
      shadow-offset: 4px 4px;
      shadow-radius: 8px;
      elevation: 6;
    `,
  blue: `
      shadow-color: ${colors.darkBlue};
      shadow-opacity: 0.16;
      shadow-offset: 0 0;
      shadow-radius: 8px;
      elevation: 5;
    `,
};

const shadowsStylesheet = {
  lg: {
    shadowColor: colors.black,
    shadowOpacity: 0.16,
    shadowOffset: { width: 1, height: 1 },
    shadowRadius: 8,
    elevation: 6,
  },
};

const margin = 8;

const layout = {
  columns: {
    nospace: "0",
    default: `${margin}px`,
    large: `${margin * 2}px`,
  },
  content: {
    normal: `${margin * 3}px`,
    normalValue: margin * 3,
  },
  rows: {
    nospace: "0",
    default: `${margin * 2}px`,
    text: `${margin}px`,
  },
  header: {
    minHeight: 65,
    paddingBottom: 20,
  },
};

export default {
  colors,
  fonts,
  images,
  layout,
  margin,
  radius: 6,
  shadows,
  shadowsStylesheet,
  opacity: {
    disabled: 0.8,
  },
};
