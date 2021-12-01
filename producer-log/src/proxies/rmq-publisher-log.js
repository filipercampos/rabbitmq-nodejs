const BaseRabbitMQ = require("./base-rabbit-mq");
module.exports = class RmqLogPublisher extends BaseRabbitMQ {
  constructor() {
    super();
  }
  async saveLog() {
    const queue = "log-subscribers";
    const routingKey = "save-log";
    //create message
    const bufferMessage = {
      key: Math.floor(Math.random() * Date.now()).toString(),
      method: "saveLog",
      message: "Log save",
      payload: JSON.stringify({ message: "Hellow rabbit!" }),
    };
    super.publishMessage(queue, routingKey, bufferMessage);
  }
};
