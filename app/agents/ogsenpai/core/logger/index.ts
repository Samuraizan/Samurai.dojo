import type { LogLevel, LogEntry } from '@/ogsenpai/core/types';

type ConsoleMethod = (message?: unknown, ...args: unknown[]) => void;

class Logger {
  private static instance: Logger;
  private logs: LogEntry[] = [];
  private maxLogs = 1000; // Keep last 1000 logs in memory

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private createLogEntry(
    level: LogLevel,
    module: string,
    message: string,
    data?: Record<string, unknown>
  ): LogEntry {
    return {
      timestamp: Date.now(),
      level,
      module,
      message,
      data,
    };
  }

  private addLog(entry: LogEntry): void {
    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift(); // Remove oldest log
    }
    
    // Also output to console in development
    if (process.env.NODE_ENV === 'development') {
      const logFn = this.getConsoleMethod(entry.level);
      const logMessage = `[${entry.level}] ${entry.module}: ${entry.message}`;
      
      if (entry.data) {
        logFn(logMessage, entry.data);
      } else {
        logFn(logMessage);
      }
    }
  }

  private getConsoleMethod(level: LogLevel): ConsoleMethod {
    switch (level) {
      case LogLevel.DEBUG:
        return console.debug.bind(console);
      case LogLevel.INFO:
        return console.info.bind(console);
      case LogLevel.WARN:
        return console.warn.bind(console);
      case LogLevel.ERROR:
        return console.error.bind(console);
      default:
        return console.log.bind(console);
    }
  }

  debug(module: string, message: string, data?: Record<string, unknown>): void {
    this.addLog(this.createLogEntry(LogLevel.DEBUG, module, message, data));
  }

  info(module: string, message: string, data?: Record<string, unknown>): void {
    this.addLog(this.createLogEntry(LogLevel.INFO, module, message, data));
  }

  warn(module: string, message: string, data?: Record<string, unknown>): void {
    this.addLog(this.createLogEntry(LogLevel.WARN, module, message, data));
  }

  error(module: string, message: string, data?: Record<string, unknown>): void {
    this.addLog(this.createLogEntry(LogLevel.ERROR, module, message, data));
  }

  getLogs(
    level?: LogLevel,
    module?: string,
    limit = 100
  ): LogEntry[] {
    let filtered = this.logs;
    
    if (level) {
      filtered = filtered.filter(log => log.level === level);
    }
    
    if (module) {
      filtered = filtered.filter(log => log.module === module);
    }
    
    return filtered.slice(-limit);
  }

  clearLogs(): void {
    this.logs = [];
  }
}

// Export singleton instance
export const logger = Logger.getInstance(); 