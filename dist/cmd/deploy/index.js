"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deployCmd = void 0;
const ali_oss_1 = __importDefault(require("ali-oss"));
const chalk_1 = require("chalk");
const config_1 = require("../../cmd/config");
const path_1 = require("path");
const oss_lib_1 = require("./lib/oss-lib");
const deployCmd = async (target, dir) => {
    const { aliyun, OSS: ossConfig } = (0, config_1.getCcliState)();
    if (!(aliyun === null || aliyun === void 0 ? void 0 : aliyun.AccessKey) || !(aliyun === null || aliyun === void 0 ? void 0 : aliyun.AccessKeySecret) || !(ossConfig === null || ossConfig === void 0 ? void 0 : ossConfig.region)) {
        console.log((0, chalk_1.red)('plase config ccli by run: `ccli config`'));
        return;
    }
    const client = new ali_oss_1.default({
        region: ossConfig.region,
        accessKeyId: aliyun.AccessKey,
        accessKeySecret: aliyun.AccessKeySecret,
        bucket: target,
        secure: true,
        timeout: 1000 * 60,
    });
    if (!dir) {
        dir = (0, path_1.resolve)(__dirname, '../dist');
    }
    const osslib = new oss_lib_1.OSSLib(client);
    osslib.uploadFiles({ baseDir: dir });
};
exports.deployCmd = deployCmd;
