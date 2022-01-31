const formatPhoneNumber = (phoneNumber: string) => {
  if (phoneNumber === "") return "";
  let newPhoneNumber = phoneNumber;
  newPhoneNumber = newPhoneNumber
    .replace(/[+.\-\s]/g, "") // remove . - + and space
    .replace(/^33/g, "0") // replace 33
    .replace(/^0033/g, "0"); // replace 0033
  if (newPhoneNumber.length !== 10) {
    throw new Error("Phone number length invalid");
  }
  return newPhoneNumber;
}

export default formatPhoneNumber;
