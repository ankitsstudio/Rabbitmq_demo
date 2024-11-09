const amqplib = require('amqplib')

const q = 'hello';
const msg = 'hello world'

const sendMsg = async () =>{
    const connection = await amqplib.connect("amqp://localhost");
    const channel = await connection.createChannel();

    await channel.assertQueue(q, {durable : false})
    channel.sendToQueue(q, Buffer.from(msg));

    console.log("sent msg:", msg);
    setTimeout(() =>{
        channel.close();
        process.exit(0);
    }, 500)
}

sendMsg();
