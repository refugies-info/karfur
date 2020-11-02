/* eslint-disable no-console */
import { datadogLogs } from "@datadog/browser-logs";

if (process.env.REACT_APP_ENV === "staging") {
  datadogLogs.init({
    clientToken: process.env.REACT_APP_DATADOG_TOKEN,
    datacenter: "eu",
    forwardErrorsToLogs: true,
    sampleRate: 100,
  });
}
export class logger {
  static info = (message, data) => {
    console.log("react", process.env.REACT_APP_ENV);
    if (process.env.REACT_APP_ENV === "staging") {
      console.log(message, data);
      datadogLogs.logger.debug(message, data, "info");
      return;
    }

    console.log(message, data);
  };

  static warn = (message, data) => {
    if (process.env.REACT_APP_ENV === "staging") {
      datadogLogs.logger.log(message, data, "warn");
      return;
    }

    console.log(message, data);
  };

  static error = (message, data) => {
    if (process.env.REACT_APP_ENV === "staging") {
      datadogLogs.logger.log(message, data, "error");
      return;
    }

    console.log(message, data);
  };
}
