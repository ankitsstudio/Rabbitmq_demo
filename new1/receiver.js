const amqplib = require('amqplib');

const exchange = 'pub-sub';
const args = process.argv.slice(2);

if (args.length == 0) {
  console.log("Usage: receive.js [info] [error] [warning]");
  process.exit(1);
}


const receiveData = async () => {
    const connection = await amqplib.connect("amqp://localhost");
    const channel = await connection.createChannel();

    await channel.assertExchange(exchange, 'topic', {durable: false});
    const temp_q = await channel.assertQueue("", { exclusive: true });

    console.log("waiting for msgs in queue:", temp_q.queue);
    args.forEach(function (severity) {
      channel.bindQueue(temp_q.queue, exchange, severity);
    });
    channel.consume(
      temp_q.queue,
      (msg) => {
        if (msg.content) console.log(`Routing key: ${msg.fields.routingKey}, The msg is:  ${msg.content.toString()}`);
      },
      { noAck: true }
    );

}
receiveData()