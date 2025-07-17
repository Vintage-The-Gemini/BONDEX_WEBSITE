// backend/src/config/logger.js
import winston from 'winston';
import path from 'path';
import fs from 'fs';

const { combine, timestamp, errors, json, colorize, simple } = winston.format;

// Ensure logs directory exists
const logDir = 'logs';
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(
    timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    errors({ stack: true }),
    json()
  ),
  defaultMeta: {
    service: 'safety-equipment-ecommerce',
    currency: 'KES',
    country: 'Kenya'
  },
  transports: [
    // Write all logs error (and below) to error.log
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      handleExceptions: true,
      handleRejections: true
    }),
    // Write all logs info (and below) to combined.log
    new winston.transports.File({
      filename: path.join(logDir, 'combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      handleExceptions: true,
      handleRejections: true
    }),
  ],
  // Don't exit on handled exceptions
  exitOnError: false
});

// If we're not in production, log to console with simple format
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: combine(
      colorize(),
      simple()
    ),
    handleExceptions: true,
    handleRejections: true
  }));
}

export default logger;