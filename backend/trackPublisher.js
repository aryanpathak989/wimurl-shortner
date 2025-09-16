    const dotenv = require("dotenv");

    const env = process.env.NODE_ENV || "development"; // default to development
    dotenv.config({ path: `.env.${env}` });
    const { createClient } = require('redis')
    const {referrenceKey} = require("./config/constant")
    const redis = createClient()
    const path = require('path');
    const Tracking = require('./models/Tracking')
    const maxmind = require('maxmind');
    const moment = require('moment')
    const redisConfig = {
        host: 'localhost',
        port: 6379
    };

    const dbPath = process.env.maxmindDb

    //process event tracking
    const eventProcessBatch = async () => {

        //Write traking logic
        // get seperate value and create and bulk insert value
        try{
 const keys = await redis.keys("tracking-event-queue:*")
        console.log(`Found ${keys.length} jobs to process`);
        const bulkUploadTrackingData = []
        for (const key of keys) {

            const job = await redis.get(key);
            const jobData = JSON.parse(job)
            const {ip,browser, os, deviceModel, deviceType, deviceVendor, referrerUrl, urlId, utmParameters } = jobData
            let city = null, region = null, country = null
            //processIp address
            try {
                const lookup = await maxmind.open(dbPath);
                const geo = lookup.get(ip);
                if(geo){
                    city = geo?.city?.names?.en || null;
                    region = geo?.subdivisions?.[0]?.names?.en || geo?.subdivisions?.[0]?.iso_code || null;
                    country = geo?.country?.names?.en || geo?.country?.iso_code || null;
                }

            } catch (err) {
                console.warn('Location fetch failed:', err.message);
            }

            //process referral
            let referrerSource = 'Direct';
            if (referrerUrl) {
                try {
                    const refHost = new URL(referrerUrl).origin + '/';
                    console.log("This is refHost: "+ refHost)
                    referrerSource = referrenceKey[refHost] || 'Direct';
                } catch (e) {
                    console.warn('Invalid referrer URL:', referrerUrl);
                }
            }

            const date = moment().tz('Asia/Kolkata').format("YYYY-MM-DD")
            bulkUploadTrackingData.push({urlId,ip,browser,os,deviceType,reference:referrerSource,deviceVendor,deviceModel,deviceType,city,region,country,date,...utmParameters})
            await redis.del(key);
            console.log(`Deleted job key ${key} from Redis`);
        }
                Tracking.bulkCreate(bulkUploadTrackingData)
        }
        catch(err){
            console.log(err)
        }
    }

    setInterval(eventProcessBatch, 60 * 500);

    redis.connect()