/* eslint-disable no-console */

// if (process.env.NEXT_PUBLIC_REACT_APP_ENV === "staging") {
//   datadogLogs.init({
//     clientToken: process.env.NEXT_PUBLIC_REACT_APP_DATADOG_TOKEN,
//     datacenter: "eu",
//     forwardErrorsToLogs: true,
//     sampleRate: 100,
//   });
// }
export class logger {
  static info = (message, data) => {
    if (process.env.NEXT_PUBLIC_REACT_APP_ENV === "staging") {
      console.log(message, data);
      // datadogLogs.logger.debug(message, data, "info");
      return;
    }

    console.log(message, data);
  };

  static warn = (message, data) => {
    if (process.env.NEXT_PUBLIC_REACT_APP_ENV === "staging") {
      console.log(message, data);
      // datadogLogs.logger.log(message, data, "warn");
      return;
    }

    console.log(message, data);
  };

  static error = (message, data) => {
    if (process.env.NEXT_PUBLIC_REACT_APP_ENV === "staging") {
      console.log(message, data);
      // datadogLogs.logger.log(message, data, "error");
      return;
    }

    console.log(message, data);
  };
}
