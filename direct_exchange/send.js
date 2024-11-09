const amqplib = require('amqplib')

const exchangeName = 'exDirect';
// const q = 'qDirect';
const args = process.argv.slice(2);
const logType = args[0];
const msg = args[1]|| "common msg for checking the direct exchange"

const sendMsg = async () => {
    const connection = await amqplib.connect("amqp://localhost");
    const channel = await connection.createChannel();

    await channel.assertExchange(exchangeName, "direct", {durable: false});

    channel.publish(exchangeName, logType, Buffer.from(msg));
    setTimeout(() => {
        connection.close();
        process.exit(0);
    }, 500)
}

sendMsg();