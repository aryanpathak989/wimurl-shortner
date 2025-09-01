const Url = require("../models/TableUrl")
const { nanoid } = require('nanoid');
const redis = require('../lib/redis')
const {referrenceKey} = require('../config/constant')
const maxmind = require('maxmind');
const path = require('path');
const {s3} = require("../config/aws")
const qrCode = require('qrcode');

const UAParser = require('ua-parser-js'); 
const TblRedirects = require("../models/redirectUrl")
const QRCode = require("../models/qrCode");
const TableUsage = require("../models/TableUsage");
const tblRedirects = require("../models/redirectUrl");
const { type } = require("os");

const dbPath = path.join(
  'C:',
  'Users',
  'Aryan',
  'Downloads',
  'GeoLite2-City_20250603',
  'GeoLite2-City_20250603',
  'GeoLite2-City.mmdb'
);

async function generateUniqueShortCode() {
  const MAX_ATTEMPTS = 3;  // Even 3 attempts is sufficient
  let attempts = 0;
  let code;

  while (attempts < MAX_ATTEMPTS) {
    code = nanoid(7);
    const exists = await Url.findOne({ where: { shortUrl: code } });
    if (!exists) return code;
    attempts++;
  }

  // Fallback with longer ID
  code = nanoid(10);
    const exists = await Url.findOne({ where: { shortUrl: code } });
    if (exists) throw new Error("ShortUrl Collision Occurred. Please retry again");
    return code
}

async function generateAndUploadQRCode(shortcode) {
  const actualUrl = process.env.BASE_URL + shortcode
  console.log(actualUrl)

  // Generate QR Code as a Buffer
  const qrBuffer = await qrCode.toBuffer(actualUrl, {
    type: 'png',
    width: 300,
    errorCorrectionLevel: 'H'
  });

  // Upload to S3
  const uploadParams = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `test/${shortcode}.png`,
    Body: qrBuffer,
    ContentType: 'image/png',
    ACL: 'public-read'
  };

  const uploadResult = await s3.upload(uploadParams).promise();

  console.log('Uploaded QR Code URL:', uploadResult.Location);
  return uploadResult.Location; // Return URL or store it in DB
}

exports.urlShortner = async (req, res) => {
    try {

        const { url , name, customBackHalf,isQrCode} = req.body;

        if(!url || !name){
            return res.status(400).json({success:false,msg:"Url, name and Qrcode is neccessary"})
        }

        const userId = req.user.id;
        const now = new Date();
        const todayMonth = now.getMonth();
        const todayYear = now.getFullYear();


        const userLimitData = await TableUsage.findAll({
            where:{
                user_id:userId,
                month:todayMonth,
                year:todayYear
            }
        })

        const userLimit = {
            url:0,
            customBackHalf:0,
            qrCode:0
        }

        const urlLimit = userLimitData.find(item => item.type === "links");
        const customHalfLimit = userLimitData.find(item => item.type === "customHalf");
        const qrCodeLimit = userLimitData.find(item => item.type === "qrcodes");

        userLimit.url = urlLimit?.limitused ?? 0;
        userLimit.customBackHalf = customHalfLimit?.limitused ?? 0;
        userLimit.qrCode = qrCodeLimit?.limitused ?? 0;

        if(userLimit.url >=50 ){
            return res.status(400).json({success:false,msg:"You’ve reached your monthly URL creation limit."})
        }

        if(customBackHalf && customBackHalf !="" && userLimit.customBackHalf >20){
            return res.status(400).json({success:false,msg:"You’ve reached your monthly customBackHalf creation limit."})
        }


        if(isQrCode && userLimit.qrCode > 20){
            return res.status(400).json({success:false,msg:"You’ve reached your monthly Qr Code creation limit."})
        }


        //setting expirary of two months.
        const expiryDate = new Date()
        expiryDate.setMonth(now.getMonth()+2)

        try {
            new URL(url);
        } catch (error) {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid URL format" 
            });
        }

        // Validate custom back-half if provided
        let shortCode;
        if (customBackHalf && customBackHalf!='') {
            // Validate custom back-half format
            if (!/^[a-z0-9_-]{3,40}$/i.test(customBackHalf)) {
                return res.status(400).json({
                    success: false,
                    message: "Custom name must be 3-40 characters and contain only letters, numbers, hyphens, and underscores"
                });
            }

            // Check for reserved routes
            const reservedRoutes = [
                'admin', 'api', 'dashboard', 'analytics', 
                'login', 'register', 'preview', 'auth'
            ];
            if (reservedRoutes.includes(customBackHalf.toLowerCase())) {
                return res.status(400).json({
                    success: false,
                    message: "This custom name is reserved"
                });
            }

            // Check availability
            const existing = await Url.findOne({ where: { shortUrl: customBackHalf } });
            if (existing) {
                return res.status(409).json({
                    success: false,
                    message: "This custom name is already taken"
                });
            }

            shortCode = customBackHalf;
        } else {
            // Generate unique random code
            shortCode = await generateUniqueShortCode();

        }

        if(!shortCode){
                return res.status(409).json({
                    success: false,
                    message: "An error occured"
                });
        }

        // Create URL record
        const urlData = await Url.create({
            user_id: req.user.id,
            name,
            shortUrl: shortCode,
            actualUrl: url,
            expiryDate
        });


        await TblRedirects.create({
            urlId:urlData.id,
            shortUrl:shortCode,
            originalUrl:url,
            expiryAt:expiryDate,
            type:"normal"
        })

        if(isQrCode){
            const urlLocations = await generateAndUploadQRCode(shortCode)
            console.log(urlLocations)
            QRCode.create({
                urlId:urlData.id,
                shortUrl:shortCode,
                imageUrl:urlLocations
            })
        }

        const usageTypesToUpdate = [
        { key: "links", shouldUpdate: true },
        { key: "customHalf", shouldUpdate: !!customBackHalf },
        { key: "qrcodes", shouldUpdate: !!isQrCode },
        ];

        for (const usage of usageTypesToUpdate) {
        if (!usage.shouldUpdate) continue;

        const existingUsage = userLimitData.find(item => item.type === usage.key);

        if (existingUsage) {
            // Increment usage count
            await TableUsage.update(
            { limitused: existingUsage.limitused + 1 },
            {
                where: {
                id: existingUsage.id
                }
            }
            );
        } else {
            // Create a new usage record for this month
            await TableUsage.create({
            user_id: userId,
            type: usage.key,
            limitused: 1,
            month: todayMonth,
            year: todayYear
            });
        }
        }

        res.status(200).json({ 
            success: true, 
            data:{
                shortCode,
                id:urlData.id
            }
        });

    } catch (err) {
        console.error("URL creation error:", err);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
};

exports.getActualUrl = async (req, res) => {

    try {
        const shortUrl = req.params.url;

        // 1. Check Redis cache
        const cached = await redis.get(shortUrl);
        if (cached) {
            const parsedUrl = JSON.parse(cached);
            // Run tracking in background
            trackUser(req, parsedUrl.id);
            res.redirect(parsedUrl.actualUrl);
            return;
        }

        // 2. Fallback to DB
        const url = await Url.findOne({ where: { shortUrl: shortUrl },raw:true });
        console.log(url)
        if (!url) return res.status(404).render('404');
        await redis.set(shortUrl, JSON.stringify(url));
        await  trackUser(req, url.id);
        res.redirect(url.actualUrl);

    } catch (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
};

// Async background tracking function
async function trackUser(req, urlId) {
    try {
        const parser = new UAParser(req.headers['user-agent']);
        const uaResult = parser.getResult();

        const browser = uaResult.browser.name + ' ' + uaResult.browser.version;
        const os = uaResult.os.name + ' ' + uaResult.os.version;
        const deviceType = uaResult.device.type || 'desktop';
        const deviceModel = uaResult.device.model || 'other';
        const deviceVendor = uaResult.device.vendor || 'other';

        // let city =null,region = null,country = null

        //getting ip info
        const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.connection.remoteAddress;
        // try {
        //     const lookup = await maxmind.open(dbPath);
        //     const geo = lookup.get(ip);
        //     city = geo?.city?.names?.en || null;
        //     region = geo?.subdivisions?.[0]?.iso_code || null;
        //     country = geo?.country?.iso_code || null;
        // } catch (err) {
        //     console.warn('Location fetch failed:', err.message);
        // }

        //checking reference
        let referrerUrl = req.headers['referer'] || null;
        let referrerSource = 'Direct';
        if (referrerUrl) {
            try {
                const refHost = new URL(referrerUrl).origin + '/';
                referrerSource = referrenceKey[refHost] || null;
            } catch (e) {
                console.warn('Invalid referrer URL:', referrerUrl);
        }
    }

        const eventData = {
            browser,
            os,
            deviceModel,
            deviceType,
            deviceVendor,
            ip,
            referrerUrl,
            urlId
        }

        redis.set(`tracking-event-queue:${nanoid(8)}`, JSON.stringify(eventData));


        // registerTrackingEvent(eventData)

        // await Tracking.create({
        //     urlId:urlDetails.id,
        //     ip,
        //     browser,
        //     os,
        //     reference:referrerSource,
        //     deviceType,
        //     deviceModel,
        //     deviceVendor,
        //     city,
        //     region,
        //     country,
        //     emailClient:null
        // });

    } catch (err) {
        console.error("Tracking error:", err);
    }
}

exports.updateUrlDetails = async (req, res) => {
  const { urlId, actualUrl, expiryDate, title } = req.body;
  const t = await Url.sequelize.transaction(); // start transaction

  try {
    const urlDetails = await Url.findOne({
      where: { id: urlId, user_id: req.user.id },
      transaction: t,
    });

    if (!urlDetails) {
      await t.rollback();
      return res.status(404).json({ success: false, message: "Url not found" });
    }

    await Url.update(
      { actualUrl, expiryDate, name: title },
      { where: { id: urlId }, transaction: t }
    );

    await tblRedirects.update(
      { originalUrl: actualUrl, expiryAt: expiryDate },
      { where: { urlId }, transaction: t }
    );

    await t.commit();
    res.status(200).json({ success: true, message: "Url updated successfully" });
  } catch (err) {
    console.error(err);
    await t.rollback(); // rollback all changes
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};



exports.createQrCodeForlink = async (req,res)=>{
    try{
        const userId = req.user.id
        const {url} = req.body



        const urlDetails = await Url.findOne({where:{
            shortUrl:url,
            user_id:userId
        }})

        if(!urlDetails) return res.status(400).send("Url Not found")

        const qrDetails = await QRCode.findOne({where:{
            urlId:urlDetails.id
        }})

        if(qrDetails) return res.status(200).send("Qr code already exist")

        const now = new Date();
        const todayMonth = now.getMonth();
        const todayYear = now.getFullYear();


        const userLimitData = await TableUsage.findOne({
            where:{
                user_id:userId,
                month:todayMonth,
                year:todayYear
            }
        })

       const userLimit = userLimitData?.limitused ?? 0;

        if(userLimit>10) return res.status(200).json({success:false,msg:""})

        const qrlink = await generateAndUploadQRCode(url)

        await QRCode.create({
            urlId:urlDetails.id,
            shortUrl:urlDetails.shortUrl,
            imageUrl:qrlink
        })

        await TableUsage.create({
            user_id:userId,
            type:'qrcodes',
            month,
            year,
            limitused:userLimit+1
        })

        return res.status(200).json({success:true,data:{
            url:qrlink
        }})
    }
    catch(err){
        console.log(err)
        return res.status(500).json({msg:"Internal Server Error"})
    }
}


