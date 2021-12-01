const amqplib = require("amqplib");
require("../config/load.config").loadConfig();

(async () => {
  const connection = await amqplib.connect(
    process.env.AMQP_URL,
    "heartbeat=60"
  );
  const channel = await connection.createChannel();
  try {
    console.log("Publishing Log");
    const exchange = "amq.direct";
    const queue = "log-subscribers";
    const routingKey = "save-log";

    //create message
    const bufferMessage = Buffer.from(
      JSON.stringify({
        key: Math.floor(Math.random() * 1000).toString(),
        method: "publisher",
        message: "Log save",
        payload: JSON.stringify({ message: "Hellow rabbit!" }),
      })
    );
    //ensure exchange
    await channel.assertExchange(exchange, "direct", { durable: true });
    //connect/create queue
    await channel.assertQueue(queue, { durable: true });
    //bind message queue
    await channel.bindQueue(queue, exchange, routingKey);
    //send message to route key
    channel.publish(exchange, routingKey, bufferMessage);
    //log message
    console.log("Log Message published");
  } catch (e) {
    console.error("Error in publishing log message", e);
  } finally {
    await channel.close();
    console.info("Closing channel and connection if available");
    await connection.close();
    console.info("Channel and connection closed");
  }
  process.exit(0);
})();
