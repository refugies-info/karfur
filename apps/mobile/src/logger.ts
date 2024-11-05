/* eslint-disable no-console */

export class logger {
  static info = (message: string, data: any = undefined) => {
    console.log(message, data);
  };

  static warn = (message: string, data: any = undefined) => {
    console.log(message, data);
  };

  static error = (message: string, data: any = undefined) => {
    console.log(message, data);
  };
}
