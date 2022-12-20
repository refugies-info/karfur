export const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_REACT_APP_ENV === "development") {
    return "http://localhost:3000/";
  } else if (process.env.NEXT_PUBLIC_REACT_APP_ENV === "staging") {
    return "https://staging.refugies.info/";
  }
  return "https://refugies.info/";
}
