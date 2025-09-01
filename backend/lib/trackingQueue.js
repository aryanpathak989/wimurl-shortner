const {Queue} = require('bullmq')

const redisConfig = {
  host: 'localhost', // IP address of Server B
  port: 6379, // Redis port
};

const eventQueue = new Queue('tracking-event-queue',{
    connection:redisConfig
})

const registerTrackingEvent = async (eventData)=>{
    try{

        const job = await eventQueue.add('track-event',eventData,{
            attempts: 3,
            backoff:{
                type:'exponential',
                delay:2000
            },
            removeOnComplete:true,
            removeOnFail:true
        })


    }
    catch(err){
        console.log('Event registeration failed')
    }
}

module.exports = registerTrackingEvent