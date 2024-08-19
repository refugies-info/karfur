export const cls = (...classNames: (string | boolean | undefined)[]) => classNames.filter(className => !!className).join(" ");
