const amqplib = require('amqplib')

const exchangeName = 'pub-sub';
const args = process.argv.slice(2);
const logType = args[0] || 'anonymous.info';
const msg = args[1] || "common msg for checking the topic exchange"

const sendMsg = async () => {
    const connection = await amqplib.connect("amqp://localhost");
    const channel = await connection.createChannel();

    await channel.assertExchange(exchangeName, "topic", {durable: false});

    channel.publish(exchangeName, logType, Buffer.from(msg));
    setTimeout(() => {
        connection.close();
        process.exit(0);
    }, 500)
}

sendMsg();