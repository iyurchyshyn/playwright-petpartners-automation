export class Logger {
    private static instance: Logger;

    private constructor() {}

    public static getInstance(): Logger {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }

    private formatLog(level: string, message: string, details?: unknown): void {
        const timestamp = new Date().toISOString()
            .replace('T', ' ')
            .split('.')[0]
            .replace(/-/g, '.');
        
        let formattedMessage = `main ${timestamp}-${level} > ${message}`;
        if (details) {
            formattedMessage += ` ${JSON.stringify(details, null, 2)}`;
        }
        
        if (level === 'ERROR') {
            console.log('\x1b[31m%s\x1b[0m', formattedMessage);
        } else {
            console.log(formattedMessage);
        }
    }

    public INFO(message: string, details?: unknown): void {
        this.formatLog('INFO', message, details);
    }

    public ERROR(message: string, details?: unknown): void {
        this.formatLog('ERROR', message, details);
    }

    public DEBUG(message: string, details?: unknown): void {
        this.formatLog('DEBUG', message, details);
    }
}

export const log = Logger.getInstance();