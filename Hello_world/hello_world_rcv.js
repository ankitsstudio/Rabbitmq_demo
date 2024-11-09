const amqplib = require('amqplib')

const q = "hello";

const receiveMsg = async () =>{
    const connection = await amqplib.connect('amqp://localhost');
    const channel = await connection.createChannel();

    await channel.assertQueue(q, {durable: false});
    channel.consume(q, msg => {
        console.log("msg received: ", msg.content.toString())
    }, {
        noAck: true
    })

}

receiveMsg();
