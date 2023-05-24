import { commitmentDetailsType } from "@refugies-info/api-types";


export const getInputValues = (inputValues: (string | undefined)[]) => {
  return inputValues.map(val => {
    if (val === "") return undefined;
    if (val === undefined) return undefined;
    return parseInt(val);
  })
}

export const getInputValue = (inputValue: number | undefined) => {
  if (inputValue === undefined) return "";
  return inputValue.toString();
}

export const isCommitmentHoursKo = (hours: (number | undefined)[] | undefined, type: commitmentDetailsType) => {
  return (type === "between"
    ? !hours || hours.filter((c) => c !== undefined).length < 2
    : !hours || hours.filter((c) => c !== undefined).length < 1)
}
