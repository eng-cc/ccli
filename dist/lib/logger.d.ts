export declare type LogType = "error" | "warn" | "info";
export declare type LogLevel = LogType | "silent";
export interface Logger {
    info(msg: string, options?: LogOptions): void;
    warn(msg: string, options?: LogOptions): void;
    warnOnce(msg: string, options?: LogOptions): void;
    error(msg: string, options?: LogErrorOptions): void;
    clearScreen(type: LogType): void;
    hasErrorLogged(error: Error): boolean;
    hasWarned: boolean;
}
export interface LogOptions {
    clear?: boolean;
    timestamp?: boolean;
}
export interface LogErrorOptions extends LogOptions {
    error?: Error | null;
}
export declare const LogLevels: Record<LogLevel, number>;
export interface LoggerOptions {
    prefix?: string;
    allowClearScreen?: boolean;
    customLogger?: Logger;
}
export declare function createLogger(level?: LogLevel, options?: LoggerOptions): Logger;
