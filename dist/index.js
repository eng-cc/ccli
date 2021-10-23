"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cac_1 = require("cac");
const chalk_1 = __importDefault(require("chalk"));
const config_1 = require("./cmd/config");
const logger_1 = require("./lib/logger");
const cli = (0, cac_1.cac)('ccli');
cli
    .command('deploy [target]')
    .option('--dir', `[string] static source dir`)
    .option('--env', `[string] target dir`)
    .action(async (target, options) => {
    const { deployCmd } = await Promise.resolve().then(() => __importStar(require('./cmd/deploy/index')));
    try {
        await deployCmd(target, options.dir);
    }
    catch (e) {
        (0, logger_1.createLogger)('info').error(chalk_1.default.red(`error when deploy deps:\n${e.stack}`), { error: e });
        process.exit(1);
    }
});
cli.command('config [mode]').action(async (mode) => {
    try {
        await (0, config_1.configCmd)(mode === 'reset');
    }
    catch (e) {
        (0, logger_1.createLogger)('info').error(chalk_1.default.red(`error when starting preview server:\n${e.stack}`), { error: e });
        process.exit(1);
    }
});
cli.help();
cli.version(require('../package.json').version);
cli.parse();
