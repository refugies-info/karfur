export const addAgeQuery = (
  age: string | null,
  query: Record<string, string>
) => {
  if (age === "0 à 17 ans") {
    return { ...query, "audienceAge.bottomValue": { $lte: 17 } };
  }

  if (age === "18 à 25 ans") {
    return {
      ...query,
      "audienceAge.bottomValue": { $lte: 25 },
      "audienceAge.topValue": { $gte: 18 },
    };
  }

  if (age === "Plus de 26 ans") {
    return { ...query, "audienceAge.topValue": { $gte: 26 } };
  }
  return { ...query };
};

export const addFrenchLevelQuery = (
  frenchLevel: string | null,
  query: Record<string, any>
) => {
  if (frenchLevel === "Je commence à apprendre") {
    return {
      ...query,
      niveauFrancais: { $nin: ["Débutant", "Intermédiaire", "Avancé"] },
    };
  }
  if (frenchLevel === "Je parle un peu") {
    return { ...query, niveauFrancais: { $nin: ["Intermédiaire", "Avancé"] } };
  }
  if (frenchLevel === "Je parle bien") {
    return { ...query, niveauFrancais: { $nin: ["Avancé"] } };
  }
  return { ...query };
};
