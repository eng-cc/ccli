// 部署get请求参数
export interface deployQueryInterface {
  baseDir: string;
}

// 遍历文件选项
export interface generateFilePathOptionInterface {
  baseDir: string;
  exclude?: string[];
}

// 上传结果
export interface uploadResultInterface {
  succ: boolean;
  state?: any;
}
