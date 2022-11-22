import Config from "../../libs/getEnvironment";

/**
 * The invariant function allow developper to make some checks on various data
 *
 * @param condition should be true ; throwing if not
 * @param format error message ; can be parametrized with %s and extra params
 * @param args extras ; hydrate "%s" from format string
 */
const invariant = (condition: boolean, format: string, ...args: any[]) => {
  if (Config.envName !== "PROD") {
    if (format === undefined) {
      throw new Error("invariant requires an error message argument");
    }
    if (!condition) {
      let error;
      if (format === undefined) {
        error = new Error(
          "Minified exception occurred; use the non-minified dev environment " +
            "for the full error message and additional helpful warnings."
        );
      } else {
        let argIndex = 0;
        error = new Error(
          format.replace(/%s/g, function () {
            return args[argIndex++];
          })
        );
        error.name = "Invariant Violation";
      }

      // @ts-ignore
      error.framesToPop = 1; // we don't care about invariant's own frame
      throw error;
    }
  }
};

export default invariant;
