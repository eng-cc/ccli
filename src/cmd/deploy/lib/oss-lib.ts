import { generateFilePath } from './file-lib';
import {
  uploadResultInterface,
  generateFilePathOptionInterface,
} from './interface';
import { normalize } from 'path';
import OSS from 'ali-oss';

export class OSSLib {
  constructor(client: OSS) {
    this.client = client;
  }
  client: OSS;
  uploadFiles = async (
    options: generateFilePathOptionInterface,
  ): Promise<uploadResultInterface> => {
    const pathArr = generateFilePath(options);
    console.log('to deploy', pathArr.length, 'files');
    const fileArr = pathArr.map((path) => path.split(options.baseDir + '/')[1]);
    for (let i = pathArr.length - 1; i >= 0; i--) {
      const path = pathArr[i];
      let filename = fileArr[i];
      if (options.namespace) {
        filename = `${options.namespace}/${filename}`;
      }
      console.log('uploading', filename);
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

  /**
   * 上传单个文件
   *
   * @param {string} filename
   * @param {string} path
   * @returns {Promise<boolean>}
   */
  uploadFile = async (
    filename: string,
    path: string,
  ): Promise<uploadResultInterface> => {
    let reTry = 0;
    let result = await this.client.put(filename, normalize(path));

    // 检错重试
    if (result?.res?.status == 200) {
      return {
        succ: true,
        state: result,
      };
    } else {
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
}
