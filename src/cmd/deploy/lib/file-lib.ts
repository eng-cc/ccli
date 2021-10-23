import { readdirSync, statSync } from 'fs';
import { join } from 'path';
import { generateFilePathOptionInterface } from './interface';
/**
 * 遍历文件夹中的文件
 *
 * @param {string} baseDir
 * @returns {string[]} 所有文件路径
 */
export const generateFilePath = (
  options: generateFilePathOptionInterface,
): string[] => {
  const pathArr: string[] = [];
  const { baseDir, exclude } = { ...options };
  const fileDisplay = (baseDir: string) => {
    try {
      const files = readdirSync(baseDir);
      files.forEach((fileName) => {
        const filedir = join(baseDir, fileName);
        const stats = statSync(filedir);
        if (exclude && exclude.includes(fileName)) {
          console.log('exclude', fileName);
        } else {
          if (stats.isFile()) {
            // 文件
            pathArr.push(filedir);
          }
          if (stats.isDirectory()) {
            // 文件夹, 继续递归
            fileDisplay(filedir);
          }
        }
      });
    } catch (error) {
      console.warn(error);
    }
  };

  console.log('generating file path', baseDir);
  fileDisplay(baseDir);
  return pathArr;
};
