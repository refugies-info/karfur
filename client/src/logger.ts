/* eslint-disable no-console */
export class logger {
  static info = (message: string, data?: any) => {
    if (process.env.NEXT_PUBLIC_REACT_APP_ENV !== "production") {
      console.log(message, data);
    }
  };

  static warn = (message: string, data?: any) => {
    if (process.env.NEXT_PUBLIC_REACT_APP_ENV !== "production") {
      console.log(message, data);
    }
  };

  static error = (message: string, data?: any) => {
    if (process.env.NEXT_PUBLIC_REACT_APP_ENV !== "production") {
      console.log(message, data);
    }
  };
}
