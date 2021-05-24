import logo from "./images/logo.svg";

const colors = {
  darkBlue: "#0421B1",
  dark: "#212121",
  darkGrey: "#5E5E5E",
  grey: "#EDEBEB",
  white: "#FFFFF",
  lightGrey: "#F6F6F6",
};

const images = {
  logo,
};

const fonts = {
  button: {
    fontSize: 14,
    fontFamily: "Roboto-Medium",
    letterSpacing: 0.5,
  },
  verySmall: {
    fontSize: 13,
    fontFamily: "circularBook",
  },
  verySmallBold: {
    fontSize: 13,
    fontFamily: "circularBold",
  },
  small: {
    fontSize: 16,
    fontFamily: "circularBook",
  },
  smallBold: {
    fontSize: 16,
    fontFamily: "circularBold",
  },
  normal: {
    fontSize: 19,
    fontFamily: "circularBook",
  },
  normalBold: {
    fontSize: 19,
    fontFamily: "circularBold",
  },
};

export const theme = {
  colors,
  images,
  margin: 8,
  fonts,
};
