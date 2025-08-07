/* eslint-disable no-console */

export class logger {
  static info = (message: string, data: unknown = undefined) => {
    console.log(message, data);
  };

  static warn = (message: string, data: unknown = undefined) => {
    console.log(message, data);
  };

  static error = (message: string, data: unknown = undefined) => {
    console.log(message, data);
  };
}
