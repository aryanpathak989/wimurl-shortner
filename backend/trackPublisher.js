const express = require('express')
const app = express()
const { createClient } = require('redis')
const {referrenceKey} = require("./config/constant")
const redis = createClient()
const path = require('path');
const { Worker, Queue } = require('bullmq');
const Tracking = require('./models/Tracking')
const maxmind = require('maxmind');
const moment = require('moment')
const redisConfig = {
    host: 'localhost',
    port: 6379
};

const dbPath = path.join(
    'C:',
    'Users',
    'Aryan',
    'Downloads',
    'GeoLite2-City_20250603',
    'GeoLite2-City_20250603',
    'GeoLite2-City.mmdb'
);

//process event tracking
const eventProcessBatch = async () => {

    //Write traking logic
    // get seperate value and create and bulk insert value
    const keys = await redis.keys("tracking-event-queue:*")
    console.log(`Found ${keys.length} jobs to process`);
    const bulkUploadTrackingData = []
    for (const key of keys) {

        const job = await redis.get(key);
        const jobData = JSON.parse(job)
        const {ip,browser, os, deviceModel, deviceType, deviceVendor, referrerUrl, urlId } = jobData
        let city = null, region = null, country = null
        //processIp address
        try {
            const lookup = await maxmind.open(dbPath);
            const geo = lookup.get(ip);
            console.log(geo.subdivisions)
            city = geo?.city?.names?.en || null;
            region = geo?.subdivisions?.[0]?.names?.en || geo?.subdivisions?.[0]?.iso_code || null;
            country = geo?.country?.names?.en || geo?.country?.iso_code || null;
        } catch (err) {
            console.warn('Location fetch failed:', err.message);
        }

        //process referral
        let referrerSource = 'Direct';
        if (referrerUrl) {
            try {
                const refHost = new URL(referrerUrl).origin + '/';
                referrerSource = referrenceKey[refHost] || 'Direct';
            } catch (e) {
                console.warn('Invalid referrer URL:', referrerUrl);
            }
        }

        const date = moment().tz('Asia/Kolkata').format("YYYY-MM-DD")
        bulkUploadTrackingData.push({urlId,ip,browser,os,deviceType,reference:referrerSource,deviceVendor,deviceModel,deviceType,city,region,country,date})
        await redis.del(key);
        console.log(`Deleted job key ${key} from Redis`);
    }

    Tracking.bulkCreate(bulkUploadTrackingData)


}

setInterval(eventProcessBatch, 60 * 500);

redis.connect()