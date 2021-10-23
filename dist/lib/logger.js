"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLogger = exports.LogLevels = void 0;
const chalk_1 = __importDefault(require("chalk"));
const readline_1 = __importDefault(require("readline"));
exports.LogLevels = {
    silent: 0,
    error: 1,
    warn: 2,
    info: 3,
};
let lastType;
let lastMsg;
let sameCount = 0;
function clearScreen() {
    const repeatCount = process.stdout.rows - 2;
    const blank = repeatCount > 0 ? "\n".repeat(repeatCount) : "";
    console.log(blank);
    readline_1.default.cursorTo(process.stdout, 0, 0);
    readline_1.default.clearScreenDown(process.stdout);
}
function createLogger(level = "info", options = {}) {
    if (options.customLogger) {
        return options.customLogger;
    }
    const loggedErrors = new WeakSet();
    const { prefix = "[ccli]", allowClearScreen = true } = options;
    const thresh = exports.LogLevels[level];
    const clear = allowClearScreen ? clearScreen : () => { };
    function output(type, msg, options = {}) {
        if (thresh >= exports.LogLevels[type]) {
            const method = type === "info" ? "log" : type;
            const format = () => {
                if (options.timestamp) {
                    const tag = type === "info"
                        ? chalk_1.default.cyan.bold(prefix)
                        : type === "warn"
                            ? chalk_1.default.yellow.bold(prefix)
                            : chalk_1.default.red.bold(prefix);
                    return `${chalk_1.default.dim(new Date().toLocaleTimeString())} ${tag} ${msg}`;
                }
                else {
                    return msg;
                }
            };
            if (options.error) {
                loggedErrors.add(options.error);
            }
            if (type === lastType && msg === lastMsg) {
                sameCount++;
                clear();
                console[method](format(), chalk_1.default.yellow(`(x${sameCount + 1})`));
            }
            else {
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
    const warnedMessages = new Set();
    const logger = {
        hasWarned: false,
        info(msg, opts) {
            output("info", msg, opts);
        },
        warn(msg, opts) {
            logger.hasWarned = true;
            output("warn", msg, opts);
        },
        warnOnce(msg, opts) {
            if (warnedMessages.has(msg))
                return;
            logger.hasWarned = true;
            output("warn", msg, opts);
            warnedMessages.add(msg);
        },
        error(msg, opts) {
            logger.hasWarned = true;
            output("error", msg, opts);
        },
        clearScreen(type) {
            if (thresh >= exports.LogLevels[type]) {
                clear();
            }
        },
        hasErrorLogged(error) {
            return loggedErrors.has(error);
        },
    };
    return logger;
}
exports.createLogger = createLogger;
