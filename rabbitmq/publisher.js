const amqp = require("amqplib");

const url = "amqp://rabbitmq:5672";
const queueName = "jobs";

const sendMessage = async function sendMessage(message){
    try{
        console.log("Rabbit Mq Publisher sendMessage");
        // await promise
        const connection = await amqp.connect(url);

        //can create multiple channels in one connection
        const channel = await connection.createChannel();
        
        // this will create queue if it is not on server, durable false mean will not save on disk and in case of power failure
        // messages will be lost
        const jobQ = await channel.assertQueue(queueName, {durable: true});  

        channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
        console.log("Job sent successfully");

        setTimeout(()=> {connection.close()},500);
    } catch (ex) {
        console.error(ex);
    }
}

module.exports = sendMessage;
