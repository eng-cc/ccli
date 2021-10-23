"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateFilePath = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const generateFilePath = (options) => {
    const pathArr = [];
    const { baseDir, exclude } = { ...options };
    const fileDisplay = (baseDir) => {
        try {
            const files = (0, fs_1.readdirSync)(baseDir);
            files.forEach((fileName) => {
                const filedir = (0, path_1.join)(baseDir, fileName);
                const stats = (0, fs_1.statSync)(filedir);
                if (exclude && exclude.includes(fileName)) {
                    console.log('exclude', fileName);
                }
                else {
                    if (stats.isFile()) {
                        pathArr.push(filedir);
                    }
                    if (stats.isDirectory()) {
                        fileDisplay(filedir);
                    }
                }
            });
        }
        catch (error) {
            console.warn(error);
        }
    };
    console.log('generating file path', baseDir);
    fileDisplay(baseDir);
    return pathArr;
};
exports.generateFilePath = generateFilePath;
