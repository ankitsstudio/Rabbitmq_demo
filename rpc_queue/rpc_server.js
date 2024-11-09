const amqplib = require('amqplib');

const queuename = "rpc_queue";

const fibbonacci = (num) => {
    if(num == 0 || num == 1) return num;
    else return fibbonacci(num-1) + fibbonacci(num-2);
}


const serverfun = async () => {
    const connection = await amqplib.connect("amqp://localhost");
    const channel = await connection.createChannel();
    await channel.assertQueue(queuename, {durable: false});
    channel.prefetch(1);
    console.log(" [X] Waiting for rpc request");

    channel.consume(queuename, msg => {
        const n = parseInt(msg.content.toString());
        console.log(" [.] fib(%d)", n);
        const fibNum = fibbonacci(n);


        channel.sendToQueue(msg.properties.replyTo, Buffer.from(fibNum.toString()), {
            correlationId: msg.properties.correlationId
        })

        channel.ack(msg);
    }, {noAck: false})
}

serverfun();
