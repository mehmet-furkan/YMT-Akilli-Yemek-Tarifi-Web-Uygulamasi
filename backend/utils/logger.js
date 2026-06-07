const winston = require("winston");

const { combine, timestamp, printf, colorize, json, errors } = winston.format;

// Dev ortamı için okunabilir, renkli format
const devFormat = combine(
  colorize(),
  errors({ stack: true }),
  timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} ${level}: ${stack || message}`;
  })
);

// Prod ortamı için JSON format (log toplama araçları için)
const prodFormat = combine(
  errors({ stack: true }),
  timestamp(),
  json()
);

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: process.env.NODE_ENV === "production" ? prodFormat : devFormat,
  transports: [new winston.transports.Console()],
});

module.exports = logger;
