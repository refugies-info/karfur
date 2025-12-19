import winston from "winston";

const transports = [new winston.transports.Console()];

const formatter =
  process.env.NODE_ENV !== "production" ? winston.format.simple() : winston.format.json();

const winstonLogger = winston.createLogger({
  exitOnError: false,
  format: formatter,
  transports,
});

const logger = {
  info: (message: string, params?: object | string): void => {
    winstonLogger.info(`${message}`, params || "");
  },
  warn: (message: string, params?: object | string): void => {
    winstonLogger.warn(`${message}`, params || "");
  },
  error: (message: string, params?: object | string): void => {
    winstonLogger.error(`${message}`, params || "");
  },
};

export = logger;
