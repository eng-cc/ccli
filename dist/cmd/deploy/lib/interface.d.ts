export interface deployQueryInterface {
    baseDir: string;
}
export interface generateFilePathOptionInterface {
    baseDir: string;
    exclude?: string[];
}
export interface uploadResultInterface {
    succ: boolean;
    state?: any;
}
