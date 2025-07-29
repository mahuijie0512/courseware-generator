import fs from 'fs';
import path from 'path';

export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3
}

export class Logger {
  private static instance: Logger;
  private logLevel: LogLevel;
  private logDir: string;

  private constructor() {
    this.logLevel = process.env.NODE_ENV === 'development' ? LogLevel.DEBUG : LogLevel.INFO;
    this.logDir = path.join(process.cwd(), 'logs');
    this.ensureLogDir();
  }

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private ensureLogDir() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  private formatMessage(level: string, message: string, meta?: any): string {
    const timestamp = new Date().toISOString();
    const metaStr = meta ? ` | ${JSON.stringify(meta)}` : '';
    return `[${timestamp}] [${level}] ${message}${metaStr}`;
  }

  private writeToFile(level: string, message: string) {
    const filename = `${new Date().toISOString().split('T')[0]}.log`;
    const filepath = path.join(this.logDir, filename);
    fs.appendFileSync(filepath, message + '\n');
  }

  error(message: string, meta?: any) {
    if (this.logLevel >= LogLevel.ERROR) {
      const formatted = this.formatMessage('ERROR', message, meta);
      console.error(formatted);
      this.writeToFile('ERROR', formatted);
    }
  }

  warn(message: string, meta?: any) {
    if (this.logLevel >= LogLevel.WARN) {
      const formatted = this.formatMessage('WARN', message, meta);
      console.warn(formatted);
      this.writeToFile('WARN', formatted);
    }
  }

  info(message: string, meta?: any) {
    if (this.logLevel >= LogLevel.INFO) {
      const formatted = this.formatMessage('INFO', message, meta);
      console.info(formatted);
      this.writeToFile('INFO', formatted);
    }
  }

  debug(message: string, meta?: any) {
    if (this.logLevel >= LogLevel.DEBUG) {
      const formatted = this.formatMessage('DEBUG', message, meta);
      console.debug(formatted);
      this.writeToFile('DEBUG', formatted);
    }
  }
}

export const logger = Logger.getInstance();