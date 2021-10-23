import chalk from "chalk";
import readline from "readline";

export type LogType = "error" | "warn" | "info";
export type LogLevel = LogType | "silent";
export interface Logger {
  info(msg: string, options?: LogOptions): void;
  warn(msg: string, options?: LogOptions): void;
  warnOnce(msg: string, options?: LogOptions): void;
  error(msg: string, options?: LogErrorOptions): void;
  clearScreen(type: LogType): void;
  hasErrorLogged(error: Error): boolean;
  hasWarned: boolean;
}

export interface LogOptions {
  clear?: boolean;
  timestamp?: boolean;
}

export interface LogErrorOptions extends LogOptions {
  error?: Error | null;
}

export const LogLevels: Record<LogLevel, number> = {
  silent: 0,
  error: 1,
  warn: 2,
  info: 3,
};

let lastType: LogType | undefined;
let lastMsg: string | undefined;
let sameCount = 0;

function clearScreen() {
  const repeatCount = process.stdout.rows - 2;
  const blank = repeatCount > 0 ? "\n".repeat(repeatCount) : "";
  console.log(blank);
  readline.cursorTo(process.stdout, 0, 0);
  readline.clearScreenDown(process.stdout);
}

export interface LoggerOptions {
  prefix?: string;
  allowClearScreen?: boolean;
  customLogger?: Logger;
}

export function createLogger(
  level: LogLevel = "info",
  options: LoggerOptions = {}
): Logger {
  if (options.customLogger) {
    return options.customLogger;
  }

  const loggedErrors = new WeakSet<Error>();
  const { prefix = "[ccli]", allowClearScreen = true } = options;
  const thresh = LogLevels[level];
  const clear = allowClearScreen ? clearScreen : () => {};

  function output(type: LogType, msg: string, options: LogErrorOptions = {}) {
    if (thresh >= LogLevels[type]) {
      const method = type === "info" ? "log" : type;
      const format = () => {
        if (options.timestamp) {
          const tag =
            type === "info"
              ? chalk.cyan.bold(prefix)
              : type === "warn"
              ? chalk.yellow.bold(prefix)
              : chalk.red.bold(prefix);
          return `${chalk.dim(new Date().toLocaleTimeString())} ${tag} ${msg}`;
        } else {
          return msg;
        }
      };
      if (options.error) {
        loggedErrors.add(options.error);
      }
      if (type === lastType && msg === lastMsg) {
        sameCount++;
        clear();
        console[method](format(), chalk.yellow(`(x${sameCount + 1})`));
      } else {
        sameCount = 0;
        lastMsg = msg;
        lastType = type;
        if (options.clear) {
          clear();
        }
        console[method](format());
      }
    }
  }

  const warnedMessages = new Set<string>();

  const logger: Logger = {
    hasWarned: false,
    info(msg, opts) {
      output("info", msg, opts);
    },
    warn(msg, opts) {
      logger.hasWarned = true;
      output("warn", msg, opts);
    },
    warnOnce(msg, opts) {
      if (warnedMessages.has(msg)) return;
      logger.hasWarned = true;
      output("warn", msg, opts);
      warnedMessages.add(msg);
    },
    error(msg, opts) {
      logger.hasWarned = true;
      output("error", msg, opts);
    },
    clearScreen(type) {
      if (thresh >= LogLevels[type]) {
        clear();
      }
    },
    hasErrorLogged(error) {
      return loggedErrors.has(error);
    },
  };

  return logger;
}
