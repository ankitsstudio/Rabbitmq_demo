const amqplib = require('amqplib');

const exchangeName = 'Headers_logs';
// const msg = process.argv.slice(2).join(' ') || "this is the fanout exchange logs";

const receiveMsg = async () => {
    const connection = await amqplib.connect('amqp://localhost');
    const channel = await connection.createChannel();

    await channel.assertExchange(exchangeName, "headers", {durable: false});
    const tempQ = await channel.assertQueue('', {exclusive: true})

    console.log(`waiting for messages in the quesue: ${tempQ.queue}`)

    channel.bindQueue(tempQ.queue, exchangeName, '', {'account': 'new', 'method': 'facebook', 'x-match': 'all'})
    channel.consume(tempQ.queue, (msg) => {
        if(msg.content) console.log(`routing key: ${JSON.stringify(msg.properties.headers)}, received msg: msg.content.toString()`);
    }, {noAck: true})
}

receiveMsg();