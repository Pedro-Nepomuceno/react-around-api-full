const winston = require("winston");

const logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message, ...metadata }) => {
      let msg = `${timestamp} [${level}]: ${message}`;
      if (Object.keys(metadata).length > 0) {
        msg += JSON.stringify(metadata);
      }
      return msg;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "app.log" }),
  ],
});

// const winston = require("winston");

// const logger = winston.createLogger({
//   level: "info",
//   format: winston.format.combine(
//     winston.format.timestamp(),
//     winston.format.json()
//   ),
//   transports: [
//     new winston.transports.File({ filename: "error.log", level: "error" }),
//     new winston.transports.File({ filename: "combined.log" }),
//     new winston.transports.Console(),
//   ],
// });

module.exports = logger;
