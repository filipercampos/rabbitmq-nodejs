require("./config/load.config").loadConfig();
const amqplib = require("amqplib");
async function processMessage(msg) {
  //call your service here to do something
  const routingKey = msg.fields.routingKey;
  const content = msg.content;
  console.log("Routing key:", routingKey);
  console.log(" [x] Received %s", content.toString());
}

//create listener messages
(async () => {
  const connection = await amqplib.connect(
    process.env.AMQP_URL,
    "heartbeat=60"
  );
  const channel = await connection.createChannel();
  channel.prefetch(1);
  const queue = "log-subscribers";

  process.once("SIGINT", async () => {
    console.log("got sigint, closing connection");
    await channel.close();
    await connection.close();
    process.exit(0);
  });

  //connect/create queue
  await channel.assertQueue(queue, { durable: true });

  //consume messages
  await channel.consume(
    queue,
    async (msg) => {
      console.log("Processing messages");
      await processMessage(msg);
      channel.ack(msg);
    },
    {
      noAck: false,
      consumerTag: "log_consumer",
    }
  );
  console.log(" [*] Waiting for messages. To exit press CTRL+C");
})();
