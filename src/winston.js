import winston from 'winston';
import config from './config.js';

const levels = {
    fatal: 0,
    error: 1,
    warn: 2,
    info: 3, 
    http:4 ,
    debug: 5
}

let logger;

if (config.ENV === 'Desarrollo') {
    logger = winston.createLogger({
        levels: levels,
        transports: [
            new winston.transports.Console({
                level: 'debug',
                format: winston.format.simple()
            }),
        ]
    })
} else {
    logger = winston.createLogger({
        levels: levels,
        transports: [
            new winston.transports.File({
                filename: './errors.log',
                level:'info', 
                format: winston.format.combine(
                    winston.format.timestamp(),
                    winston.format.simple()
                )
            })
        ]
    })
}

export default logger