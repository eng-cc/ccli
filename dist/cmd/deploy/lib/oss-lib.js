"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OSSLib = void 0;
const file_lib_1 = require("./file-lib");
const path_1 = require("path");
class OSSLib {
    constructor(client) {
        this.uploadFiles = async (options) => {
            const pathArr = (0, file_lib_1.generateFilePath)(options);
            console.log(pathArr.length);
            const fileArr = pathArr.map((path) => path.split(options.baseDir + '/')[1]);
            for (let i = pathArr.length - 1; i >= 0; i--) {
                const path = pathArr[i];
                const filename = fileArr[i];
                console.log(filename);
                const result = await this.uploadFile(filename, path);
                if (!result.succ) {
                    console.warn('error');
                    return result;
                }
            }
            return {
                succ: true,
            };
        };
        this.uploadFile = async (filename, path) => {
            var _a;
            let reTry = 0;
            let result = await this.client.put(filename, (0, path_1.normalize)(path));
            if (((_a = result === null || result === void 0 ? void 0 : result.res) === null || _a === void 0 ? void 0 : _a.status) == 200) {
                return {
                    succ: true,
                    state: result,
                };
            }
            else {
                if (reTry > 2) {
                    return {
                        succ: false,
                        state: result,
                    };
                }
                reTry++;
                result = await this.client.put(filename, path);
            }
            return {
                succ: false,
            };
        };
        this.client = client;
    }
}
exports.OSSLib = OSSLib;
