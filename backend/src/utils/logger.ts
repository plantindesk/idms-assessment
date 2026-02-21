
enum LogLevel {
  INFO = "INFO",
  WARN = "WARN",
  ERROR = "ERROR",
  DEBUG = "DEBUG",
}

const colorMap: Record<LogLevel, string> = {
  [LogLevel.INFO]: "\x1b[36m",   // Cyan
  [LogLevel.WARN]: "\x1b[33m",   // Yellow
  [LogLevel.ERROR]: "\x1b[31m",  // Red
  [LogLevel.DEBUG]: "\x1b[35m",  // Magenta
};

const RESET = "\x1b[0m";

const formatMessage = (level: LogLevel, message: string): string => {
  const timestamp = new Date().toISOString();
  return `${colorMap[level]}[${level}]${RESET} ${timestamp} — ${message}`;
};

const logger = {
  info: (msg: string) => console.log(formatMessage(LogLevel.INFO, msg)),
  warn: (msg: string) => console.warn(formatMessage(LogLevel.WARN, msg)),
  error: (msg: string) => console.error(formatMessage(LogLevel.ERROR, msg)),
  debug: (msg: string) => {
    if (process.env.NODE_ENV !== "production") {
      console.debug(formatMessage(LogLevel.DEBUG, msg));
    }
  },
};

export default logger;
