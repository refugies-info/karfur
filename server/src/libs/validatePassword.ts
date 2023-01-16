/* TODO: use the same file as on frontend */
// Password required criterias
type Criteria = {
  validate: (password: string) => boolean
}
const passwordStrengthCriterias: Criteria[] = [
  { validate: (password: string) => !!password.match(/[!@#$&*]/g) },
  { validate: (password: string) => !!password.match(/[0-9]/g) },
  { validate: (password: string) => password.length >= 7 },
]

// Calculate strength
export const isPasswordOk = (password: string) => {
  const criterias = passwordStrengthCriterias.map(criteria => ({
    isOk: criteria.validate(password),
  }));

  return !criterias.find(c => c.isOk === false)
}
