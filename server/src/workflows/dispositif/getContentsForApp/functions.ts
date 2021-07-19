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

  if (age === "26 ans et plus") {
    return { ...query, "audienceAge.topValue": { $gte: 26 } };
  }
  return { ...query };
};

export const addFrenchLevelQuery = (
  frenchLevel: string | null,
  query: Record<string, any>
) => {
  if (frenchLevel === "Je parle un peu") {
    return {
      ...query,
      $and: [
        { niveauFrancais: { $ne: ["Avancé"] } },
        { niveauFrancais: { $ne: ["Intermédiaire"] } },
      ],
    };
  }
  if (frenchLevel === "Je parle bien") {
    return { ...query, niveauFrancais: { $ne: ["Avancé"] } };
  }
  return { ...query };
};
