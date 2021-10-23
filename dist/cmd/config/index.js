"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCcliState = exports.saveCCliState = exports.configCmd = exports.ccliStatePath = void 0;
const chalk_1 = require("chalk");
const fs_1 = require("fs");
const path_1 = require("path");
const inquirer_1 = require("inquirer");
const USER_HOME = process.env.HOME || process.env.USERPROFILE || '';
exports.ccliStatePath = (0, path_1.resolve)(USER_HOME, '.ccli');
const configCmd = async (reset) => {
    if (reset) {
        console.log((0, chalk_1.green)('removing ccli config'));
        (0, exports.saveCCliState)({});
        return;
    }
    console.log((0, chalk_1.green)('config ccli'));
    const { configType } = await (0, inquirer_1.prompt)([
        {
            name: 'configType',
            type: 'list',
            message: `choice config item:`,
            choices: [{ name: 'Deploy', value: 'deploy' }],
        },
    ]);
    if (configType === 'deploy') {
        const { deployType } = await (0, inquirer_1.prompt)([
            {
                name: 'deployType',
                type: 'list',
                message: `choice deploy type:`,
                choices: [{ name: 'aliyun oss static site', value: 'static-alioss' }],
            },
        ]);
        if (deployType === 'static-alioss') {
            const { aliyunAK, aliyunAKS, ossRegion } = await (0, inquirer_1.prompt)([
                {
                    name: 'aliyunAK',
                    type: 'input',
                    message: `input aliyun AccessKey:`,
                },
                {
                    name: 'aliyunAKS',
                    type: 'input',
                    message: `input aliyun AccessKeySecret:`,
                },
                {
                    name: 'ossRegion',
                    type: 'input',
                    message: `input aliyun oss region:`,
                },
            ]);
            if (aliyunAK && aliyunAKS && ossRegion) {
                (0, exports.saveCCliState)({
                    deployType: 'static-alioss',
                    aliyun: {
                        AccessKey: aliyunAK,
                        AccessKeySecret: aliyunAKS,
                    },
                    OSS: {
                        region: ossRegion,
                    },
                });
            }
            else {
                console.log((0, chalk_1.red)('plase input aliyunAK && aliyunAKS && ossRegion'));
            }
        }
    }
};
exports.configCmd = configCmd;
const saveCCliState = async (state) => {
    try {
        if (!(0, fs_1.existsSync)(USER_HOME)) {
            (0, fs_1.mkdirSync)(USER_HOME);
        }
        if (!(0, fs_1.existsSync)(exports.ccliStatePath)) {
            (0, fs_1.writeFileSync)(exports.ccliStatePath, '{}');
        }
        const ccliStateStr = (0, fs_1.readFileSync)(exports.ccliStatePath, 'utf8');
        const oldCcliState = JSON.parse(ccliStateStr);
        (0, fs_1.writeFileSync)(exports.ccliStatePath, JSON.stringify({ ...oldCcliState, ...state }));
    }
    catch (error) {
        console.log((0, chalk_1.red)('保存信息失败，请重试'));
        console.log((0, chalk_1.bgRed)('ERROR:'), (0, chalk_1.red)(error.message));
        (0, fs_1.rmSync)(exports.ccliStatePath);
        throw error;
    }
};
exports.saveCCliState = saveCCliState;
const getCcliState = () => {
    if (!(0, fs_1.existsSync)(USER_HOME)) {
        return {};
    }
    if (!(0, fs_1.existsSync)(exports.ccliStatePath)) {
        return {};
    }
    const ccliStateStr = (0, fs_1.readFileSync)(exports.ccliStatePath, 'utf8');
    const ccliState = JSON.parse(ccliStateStr);
    return ccliState;
};
exports.getCcliState = getCcliState;
