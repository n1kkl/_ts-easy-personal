import winston from 'winston';
import winstonDevConsole from '@epegzz/winston-dev-console';

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    winstonDevConsole.transport({
      showTimestamps: false,
      addLineSeparation: true,
    }),
  );
} else {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    }),
  );
}
