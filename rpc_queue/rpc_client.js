const amqplib = require('amqplib');
const {v4: uuidv4} = require('uuid');

const uuid = uuidv4();
const queuename = "rpc_queue";
const args = process.argv.slice(2);
// const msg = args[1] || "Want the fibbonacci number at the given position";

const num = args[0];

const clientfun = async () => {
    const connection = await amqplib.connect("amqp://localhost");
    const channel = await connection.createChannel();
    const temp_q = await channel.assertQueue('', {exclusive: true});

    console.log("[x] Requesting fib(%d)", num)

    channel.sendToQueue(queuename, Buffer.from(num.toString()), {
        replyTo: temp_q.queue,
        correlationId: uuid
    })

    channel.consume(temp_q.queue, msg => {
        if(msg.properties.correlationId == uuid){
            console.log('[.] Got %s', msg.content.toString());
            setTimeout(() => {
                connection.close();
                process.exit(0);
            }, 500);
        }
    }, {noAck: true})
}

clientfun();
