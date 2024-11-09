const amqplib = require("amqplib");

const exchangeName = "Topic_logs";
const args = process.argv.slice(2);

if (args.length == 0) {
  console.log("Usage: receive.js [info] [error] [warning]");
  process.exit(1);
}

const receiveMsg = async () => {
  const connection = await amqplib.connect("amqp://localhost");
  const channel = await connection.createChannel();

  await channel.assertExchange(exchangeName, "topic", { durable: false });
  const temp_q = await channel.assertQueue("", { exclusive: true });

  console.log("waiting for msgs in queue:", temp_q.queue);
  args.forEach(function (severity) {
    channel.bindQueue(temp_q.queue, exchangeName, severity);
  });
  channel.consume(
    temp_q.queue,
    (msg) => {
      if (msg.content) console.log(`Routing key: ${msg.fields.routingKey}, The msg is:  ${msg.content.toString()}`);
    },
    { noAck: true }
  );
};

receiveMsg();
