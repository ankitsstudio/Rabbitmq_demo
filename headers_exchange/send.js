const amqplib = require('amqplib');

const exchangeName = 'Headers_logs';
const msg = process.argv.slice(2).join(' ') || "this is the fanout exchange logs";

const sendMsg = async () => {
    const connection = await amqplib.connect('amqp://localhost');
    const channel = await connection.createChannel();

    await channel.assertExchange(exchangeName, "headers", {durable: false});

    channel.publish(exchangeName, '', Buffer.from(msg), {headers: {account: 'new', method: 'facebook'}});
    console.log("Sent: ", msg);

    setTimeout(() => {
        connection.close();
        process.exit(0);
    }, 500)
}

sendMsg();