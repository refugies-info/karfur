// Password required criterias
type Criteria = {
  label: string;
  validate: (password: string) => boolean
}
const passwordStrengthCriterias: Criteria[] = [
  { validate: (password: string) => !!password.match(/[!@#$&*]/g), label: "Register.criteria_special" },
  { validate: (password: string) => !!password.match(/[0-9]/g), label: "Register.criteria_number" },
  { validate: (password: string) => password.length >= 7, label: "Register.criteria_minlength" },
]

// Calculate strength
type PasswordStrength = {
  isOk: boolean;
  criterias: { isOk: boolean, label: string }[]
}
export const getPasswordStrength = (password: string): PasswordStrength => {
  const criterias = passwordStrengthCriterias.map(criteria => ({
    isOk: criteria.validate(password),
    label: criteria.label
  }));

  return {
    isOk: !criterias.find(c => c.isOk === false),
    criterias
  }
}
