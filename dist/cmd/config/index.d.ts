export interface CcliStateI {
    deployType?: 'static-alioss' | '';
    aliyun?: {
        AccessKey: string;
        AccessKeySecret: string;
    };
    OSS?: {
        region: string;
    };
}
export declare const ccliStatePath: string;
export declare const configCmd: (reset: boolean) => Promise<void>;
export declare const saveCCliState: (state: Partial<CcliStateI>) => Promise<void>;
export declare const getCcliState: () => CcliStateI;
