import { createLogger, format, transports } from 'winston';

class Logger {
  private logger: any;

  constructor() {
    this.logger = createLogger({
      level: 'info',
      format: format.combine(
        format.timestamp(),
        format.json(),
      ),
      transports: [
        new transports.Console(),
        new transports.File({ filename: 'logs/error.log', level: 'error' }),
        new transports.File({ filename: 'logs/combined.log' }),
      ],
    });
  }

  // Basic logging methods
  info(message: string, meta: any = {}): void {
    this.logger.info(message, meta);
  }

  error(message: string, meta: any = {}): void {
    this.logger.error(message, meta);
  }

  warn(message: string, meta: any = {}): void {
    this.logger.warn(message, meta);
  }

  debug(message: string, meta: any = {}): void {
    this.logger.debug(message, meta);
  }

  // Legacy method for backward compatibility
  logMessage(level: string, message: string, meta: any = {}): void {
    this.logger.log({ level, message, ...meta });
  }

  // Service-specific logging
  logServiceMethod(serviceName: string, methodName: string, message: string, meta: any = {}): void {
    this.logger.info(message, {
      service: serviceName,
      method: methodName,
      ...meta
    });
  }

  // Controller-specific logging
  logControllerMethod(controllerName: string, methodName: string, message: string, meta: any = {}): void {
    this.logger.info(message, {
      controller: controllerName,
      method: methodName,
      ...meta
    });
  }

  // Error logging with context
  logServiceError(serviceName: string, methodName: string, error: any, meta: any = {}): void {
    this.logger.error(`Service Error in ${serviceName}.${methodName}`, {
      service: serviceName,
      method: methodName,
      error: error.message,
      stack: error.stack,
      ...meta
    });
  }

  logControllerError(controllerName: string, methodName: string, error: any, meta: any = {}): void {
    this.logger.error(`Controller Error in ${controllerName}.${methodName}`, {
      controller: controllerName,
      method: methodName,
      error: error.message,
      stack: error.stack,
      ...meta
    });
  }
}

// Create singleton instance
const loggerInstance = new Logger();

// Export the instance and individual methods for backward compatibility
export const logger = loggerInstance;
export const logMessage = (level: string, message: string, meta: any = {}) => loggerInstance.logMessage(level, message, meta);
export const logInfo = (message: string, meta: any = {}) => loggerInstance.info(message, meta);
export const logError = (message: string, meta: any = {}) => loggerInstance.error(message, meta);
export const logWarn = (message: string, meta: any = {}) => loggerInstance.warn(message, meta);
export const logDebug = (message: string, meta: any = {}) => loggerInstance.debug(message, meta);
export const logServiceMethod = (serviceName: string, methodName: string, message: string, meta: any = {}) => loggerInstance.logServiceMethod(serviceName, methodName, message, meta);
export const logControllerMethod = (controllerName: string, methodName: string, message: string, meta: any = {}) => loggerInstance.logControllerMethod(controllerName, methodName, message, meta);
export const logServiceError = (serviceName: string, methodName: string, error: any, meta: any = {}) => loggerInstance.logServiceError(serviceName, methodName, error, meta);
export const logControllerError = (controllerName: string, methodName: string, error: any, meta: any = {}) => loggerInstance.logControllerError(controllerName, methodName, error, meta);