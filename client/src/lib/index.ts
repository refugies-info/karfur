export const jsUcfirst = (string: string) =>
  string &&
  string.length > 1 &&
  string.charAt(0).toUpperCase() + string.slice(1, string.length);

export const jsLcfirst = (string: string) =>
  string &&
  string.length > 1 &&
  string.charAt(0).toLowerCase() + string.slice(1, string.length);

export const limitNbCaracters = (string: string, nbCaractersMax: number) =>
  string.substring(0, Math.min(string.length, nbCaractersMax)) +
  (string.length > nbCaractersMax ? "..." : "");

export const removeAccents = (str = "") => {
  var accents =
    "ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž";
  var accentsOut =
    "AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz";
  const chars = str.split("");
  let i, x;
  for (i = 0; i < chars.length; i++) {
    if ((x = accents.indexOf(chars[i])) !== -1) {
      chars[i] = accentsOut[x];
    }
  }
  return chars.join("");
};

// rules for password check :
// nbNumUpper = nbNumeric + nbUpper
// score 0 (cannot set password): length < 5
// score 0.5 : 7>length>=5 + nbNumUpper = 1 or 2 or0
// score 1.5 : 7>length >= 5 + nbNumUpper>=3 OR length>=7 + nbNumUpper<3
// score 2.5 : length >= 7 + nbNumUpper>=3
// score 3.5 : length >= 7 + nbNumUpper>=3 + at least 1 special caractere

// make sure to use same function in backend
export const computePasswordStrengthScore = (
  password: string
): { score: number } => {
  if (password.length < 5) {
    return { score: 0 };
  }

  const numerics = password.match(/\d+/g)?.join("");
  const nbNumeric = numerics ? numerics.length : 0;

  const upperCase = password.match(/[A-Z]/g)?.join("");
  const nbUpperCase = upperCase ? upperCase.length : 0;

  if (password.length < 7) {
    if (nbUpperCase + nbNumeric < 3) {
      return { score: 1 };
    }
    return { score: 2 };
  }

  if (nbNumeric + nbUpperCase < 3) {
    return { score: 2 };
  }
  const specialCar = password.match(/[!@#$&*]/g)?.join("");
  const nbSpecialCar = specialCar ? specialCar.length : 0;
  if (nbSpecialCar > 0) {
    return { score: 4 };
  }

  return { score: 3 };
};
