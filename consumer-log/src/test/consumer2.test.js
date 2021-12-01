require("./config/load.config").loadConfig();
const amqp = require("amqplib/callback_api");

amqp.connect(process.env.AMQP_URL, function (err, conn) {
  conn.createChannel(function (err, ch) {
    const queue = "log-subscribers";

    ch.assertQueue(queue, { durable: true });
    ch.prefetch(1);
    console.log(
      " [*] Waiting for messages in %s.\nTo exit press CTRL+C",
      queue
    );
    ch.consume(
      queue,
      function (msg) {
        console.log(" [x] Received %s", msg.content.toString());
        ch.ack(msg);
      },
      { noAck: false }
    );
  });
});
