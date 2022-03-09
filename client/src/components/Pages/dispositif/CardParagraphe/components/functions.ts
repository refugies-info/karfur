export const jsUcfirstInfocards = (string: string, title: string) => {
  if (title === "Public visé" && string && string.length > 1) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  return string;
};

export const getTextForAgeInfocard = (
  ageRange: string | undefined,
  bottomValue: number | undefined,
  topValue: number | undefined,
  t: any
) => {
  if (ageRange === "De ** à ** ans") {
    return (
      t("Dispositif.De", "De") +
      " " +
      bottomValue +
      " " +
      t("Dispositif.à", "à") +
      " " +
      topValue +
      " " +
      t("Dispositif.ans", "ans")
    );
  }

  if (ageRange === "Moins de ** ans") {
    return (
      t("Dispositif.Moins de", "Moins de") +
      " " +
      topValue +
      " " +
      t("Dispositif.ans", "ans")
    );
  }

  return (
    t("Dispositif.Plus de", "Plus de") +
    " " +
    bottomValue +
    " " +
    t("Dispositif.ans", "ans")
  );
};
