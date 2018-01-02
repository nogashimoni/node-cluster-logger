# node-cluster-logger
This is a looger for a node project that runs as cluster.
It is based on winston logger, only that it takes care of concurency issues between cluster workers and master proccesses.
The logger makes sure that writing to the log files is done only in master, and that way only one process access a file at any time point. You can require the logger and use it as you wish, both in worker and in master process.

The log files will rotate, meaning you will have the following files: logname.log, logname1.log, logname2.log... lognameN.log, 
A logfile will rotate once it reaches the max size you configure.
depanding on the configuration you choose.

The logger will both print to console and write to log files


# Usage
1) add the winson as a dependency to your package.json: 
    "winston": "2.4.0"
and run npm install.

2) copy paste the logger.js to your project (not fancy, I know, but easy to use). 
Then, you can change the config object to configure the logs folder, log level, amount of files to rotate and max size of each log file.

3) require the logger from anywhere in your code, and use it like in the following example:

```
  const logger = require("./logger");
  logger.info("writing to both log and console");
```

you can also use logger.warn, logger.error, etc.
the log levels are: error, warn, info, verbose, debug and silly.

