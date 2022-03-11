export const isValidPhone = (phoneNumber: string | undefined) => {
  const regex = /^(?:0|\+33 ?|0033 ?)([1-9] ?(?:[0-9] ?){8})$/;
  return phoneNumber ? !!phoneNumber.match(regex) : false;
}
