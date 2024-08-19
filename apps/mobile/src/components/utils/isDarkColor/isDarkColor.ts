import { hexToRgb } from "./hexToRgb";

// From : https://github.com/gion/is-dark-colors
// adapted from https://stackoverflow.com/a/3943023/491075
export const isDarkColor = (
  hexColor: string,
  options?: { override: { [key: string]: boolean } }
): boolean => {
  if (options && options.override) {
    const overridedColor = Object.keys(options.override).find(
      (k) => k.toLowerCase() === hexColor.toLowerCase()
    );
    if (overridedColor !== undefined) {
      return options.override[overridedColor];
    }
  }

  const { r, g, b } = hexToRgb(hexColor);

  let colorArray = [r / 255, g / 255, b / 255].map((v) => {
    if (v <= 0.03928) {
      return v / 12.92;
    }

    return Math.pow((v + 0.055) / 1.055, 2.4);
  });

  const luminance =
    0.2126 * colorArray[0] + 0.7152 * colorArray[1] + 0.0722 * colorArray[2];

  return luminance <= 0.179;
};
