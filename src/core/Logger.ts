import chalk from "chalk";
import fs from "fs";
import path from "path";

enum LogLevel {
    INFO = "info",
    SUCCESS = "success",
    WARN = "warn",
    ERROR = "error",
    DEBUG = "debug",
    DATABASE = "db"
}

export class Logger {
    private static logDir = path.resolve("logs");

    private static getTimestamp(): string {
        return new Date().toLocaleTimeString("fr-FR", { hour12: false });
    }

    private static colorMap = {
        [LogLevel.INFO]: chalk.blue,
        [LogLevel.SUCCESS]: chalk.green,
        [LogLevel.WARN]: chalk.yellow,
        [LogLevel.ERROR]: chalk.red,
        [LogLevel.DEBUG]: chalk.magenta,
        [LogLevel.DATABASE]: chalk.cyan,
    };

    /**
     * Manages writing to the log file with a YYYY/MM/DD directory structure.log
     */
    private static writeToFile(level: LogLevel, context: string, message: string): void {
        const now = new Date();
        const year = now.getFullYear().toString();
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');

        const dirPath = path.join(this.logDir, year, month);
        const filePath = path.join(dirPath, `${day}.log`);

        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }

        const logEntry = `[${this.getTimestamp()}] [${level.toUpperCase()}] [${context}] ${message}\n`;

        fs.appendFileSync(filePath, logEntry, "utf8");
    }

    /**
     * @param level
     * @param context
     * @param message
     * @param silent If true, nothing is displayed in the console, but it still writes to the file.
     */
    public static log(level: LogLevel, context: string, message: string, silent: boolean = false): void {
        this.writeToFile(level, context, message);

        if (!silent) {
            const color = this.colorMap[level] || chalk.white;
            console.log(
                `${chalk.gray(`[${this.getTimestamp()}]`)} ${color(level.toUpperCase().padEnd(7))} ${chalk.bold(`[${context}]`)} ${message}`
            );
        }
    }

    public static async sendErrorToDiscord(client: any, message: string, error: any): Promise<void> {
        this.log(LogLevel.ERROR, "Critical", `${message} - ${error.message || error}`);
    }

    public static info(msg: string, context: string, silent: boolean = false) {
        this.log(LogLevel.INFO, msg, context, silent);
    }

    public static error(msg: string, context: string, silent: boolean = false) {
        this.log(LogLevel.ERROR, msg, context, silent);
    }

    public static warn(msg: string, context: string, silent: boolean = false) {
        this.log(LogLevel.WARN, msg, context, silent);
    }

    public static success(msg: string, context: string, silent: boolean = false) {
        this.log(LogLevel.SUCCESS, msg, context, silent);
    }

    public static debug(msg: string, context: string, silent: boolean = false) {
        this.log(LogLevel.DEBUG, msg, context, silent);
    }

    public static db(msg: string, context: string, silent: boolean = false) {
        this.log(LogLevel.DATABASE, msg, context, silent);
    }
}
