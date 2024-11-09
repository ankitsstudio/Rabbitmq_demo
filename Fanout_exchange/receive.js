const amqplib = require('amqplib');

const exchangeName = 'logs';
// const msg = process.argv.slice(2).join(' ') || "this is the fanout exchange logs";

const receiveMsg = async () => {
    const connection = await amqplib.connect('amqp://localhost');
    const channel = await connection.createChannel();

    await channel.assertExchange(exchangeName, "fanout", {durable: false});
    const tempQ = await channel.assertQueue('', {exclusive: true})

    console.log(`waiting for messages in the quesue: ${tempQ.queue}`)

    channel.bindQueue(tempQ.queue, exchangeName, '')
    channel.consume(tempQ.queue, (msg) => {
        if(msg.content) console.log("received msg: ", msg.content.toString());
    }, {noAck: true})
}

receiveMsg();