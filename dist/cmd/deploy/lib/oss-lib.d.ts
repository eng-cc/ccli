import { uploadResultInterface, generateFilePathOptionInterface } from './interface';
import OSS from 'ali-oss';
export declare class OSSLib {
    constructor(client: OSS);
    client: OSS;
    uploadFiles: (options: generateFilePathOptionInterface) => Promise<uploadResultInterface>;
    uploadFile: (filename: string, path: string) => Promise<uploadResultInterface>;
}
