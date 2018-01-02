let winston = require('winston');
let config = require('./config');
let cluster = require('cluster');


if (cluster.isMaster) {
    const genTimestamp = () => (new Date().toLocaleDateString()) + ' ' + (new Date() ).toLocaleTimeString();
    const genLogRow = (options) => {
        // Return string will be passed to logger.
        return options.level.toUpperCase() + ' ' + options.timestamp() + '  ' + (options.message ? options.message : '') +
            (options.meta && Object.keys(options.meta).length ? " " + JSON.stringify(options.meta) : '' );
    };

    winston.remove(winston.transports.Console);
    winston.add(winston.transports.Console, {
        colorize: true,
        json: false,
        level: config.logs.level,
        timestamp: genTimestamp,
        formatter: genLogRow
    });

    winston.add(winston.transports.File, {
        filename: `${config.logs.folder}\/ds.log`,
        maxsize: config.logs.fileMaxSize,
        maxFiles: config.logs.maxFiles,
        tailable: true,
        level: config.logs.level,
        json: false,
        timestamp: genTimestamp,
        formatter: genLogRow
    });

    cluster.on("message", (info, message) => {
        if (message.type == "logging") {
            loggingMessageHandler(message.data)
        }
    });

    loggingMessageHandler = (data) => {
        winston.log(data.level, data.message)
    };

    module.exports = winston;
}

else {
    const sendToMaster = (level, message) => {
        process.send({
            type: "logging",
            data: {level, message}
        });
    };

    module.exports = {
        error: message => {
            sendToMaster("error", message)
        },
        warn: message => sendToMaster("warn", message),
        info: message => sendToMaster("info", message),
        verbose: message => sendToMaster("verbose", message),
        debug: message => sendToMaster("debug", message),
        silly: message => sendToMaster("silly", message),
        log: (level, message) => sendToMaster(level, message)
    };
}
