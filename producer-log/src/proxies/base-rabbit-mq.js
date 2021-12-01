const amqplib = require("amqplib");

module.exports = class BaseRabbitMQ {
  /**
   * Connection and get channel
   * @returns {Promise<amqplib.Connection>}
   */
  async connect() {
    try {
      return await amqplib.connect(process.env.AMQP_URL, "heartbeat=60");
    } catch (error) {
      this.logError(error, "connect");
      if (error.message.includes("ECONNREFUSED")) {
        throw new Error("RabbitMQ server fail\n" + error.message);
      }
      throw error;
    }
  }

  /**
   * Send match to queue
   * @param {string} exchange exchange
   * @param {string} queue Queue message
   * @param {string} routingKey key
   * @param {any} data Message
   */
  async publishMessage(queue, routingKey, data) {
    const connection = await this.connect();
    const channel = await connection.createChannel();
    try {
      const exchange = "amq.direct";
      //log
      this.log("publishMessage");
      //create buffer
      const bufferMessage = Buffer.from(JSON.stringify(data));
      //ensure exchange
      await channel.assertExchange(exchange, "direct", { durable: true });
      //connect/create queue
      await channel.assertQueue(queue, { durable: true });
      //bind message queue
      await channel.bindQueue(queue, exchange, routingKey);
      //send message to route key
      channel.publish(exchange, routingKey, bufferMessage);
      //log
      this.log(`${routingKey} published`);
    } catch (e) {
      this.logError(erro, "publishMessage");
      console.error("Error publishing message", e);
    } finally {
      await channel.close();
      await connection.close();
    }
  }

  /**
   * Handle error
   * @param {Error} error
   * @param {string} funcName
   */
  logError(error, funcName) {
    console.error(`${this.constructor.name}.${funcName}:${error.message}`);
  }

  /**
   * Logger
   * @param {string} message
   */
  log(message) {
    console.log(`${this.constructor.name}.${message}`);
  }
};
