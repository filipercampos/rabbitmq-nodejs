require("./config/load.config").loadConfig();
const RmqPublisherLog = require("./proxies/rmq-publisher-log");
new RmqPublisherLog().saveLog();
