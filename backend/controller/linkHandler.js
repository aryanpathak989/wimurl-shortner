const { where, DATE, Op, fn, col, literal } = require("sequelize")
const Url = require("../models/TableUrl")
const tracking = require('../models/Tracking')
const redis = require('../lib/redis');
const Tracking = require("../models/Tracking");
const tblQrCode = require("../models/qrCode");



const moment = require("moment");

exports.getLinkClickPerformance = async (req, res) => {
  try {
    let { urlId, period } = req.query;
    if (!urlId) return res.status(400).json({ msg: "Url id is required" });

    const filterValue = period || "7days";

    // IST "now" and startDate using moment (no moment-timezone)
    const now = moment().utcOffset(330);
    let startDate = moment(now); // clone

    switch (filterValue) {
      case "1year":
        startDate.subtract(1, "year");
        break;
      case "6months":
        startDate.subtract(6, "months");
        break;
      case "3months":
        startDate.subtract(3, "months");
        break;
      case "1month":
        startDate.subtract(1, "month");
        break;
      case "14days":
        startDate.subtract(14, "days");
        break;
      default: // "7days"
        startDate.subtract(7, "days");
        break;
    }


    const rows = await Tracking.findAll({
      raw: true,
      attributes: [
        [
          fn(
            "to_char",
            fn("date_trunc", "day", col("date")),
            "YYYY-MM-DD"
          ),
          "date",
        ],
        [literal("COUNT(*)"), "count"],
      ],
      where: {
        urlId,
        createdAt: { [Op.gte]: startDate.toDate() },
      },
      // Group by the same expression position (1) to avoid alias issues
      group: [literal("1")],
      order: [literal("1 ASC")],
    });

    // Map DB results to date -> count
    const clickMap = {};
    for (const r of rows) {
      clickMap[r.date] = parseInt(r.count, 10) || 0;
    }

    // Fill from startDate..today (inclusive) with 0s where missing
    const performance = [];
    let cursor = moment(startDate).startOf("day");
    const endDate = moment(now).startOf("day");

    while (cursor.isSameOrBefore(endDate)) {
      const dateStr = cursor.format("YYYY-MM-DD");
      performance.push({ date: dateStr, count: clickMap[dateStr] || 0 });
      cursor.add(1, "day");
    }

    // Summary stats (unchanged response structure)
    const totalClicks = performance.reduce((s, d) => s + d.count, 0);
    const daysCount = performance.length || 1;
    const averageClicks = totalClicks / daysCount;
    const peakClicks = performance.length
      ? Math.max(...performance.map((d) => d.count))
      : 0;

    res.status(200).json({
      performance,
      averageClicks: Number(averageClicks.toFixed(2)),
      peakClicks,
    });
  } catch (err) {
    console.error("[getLinkClickPerformance] error:", err);
    res.status(500).json({ msg: "Internal server error" });
  }
};

exports.getQrCode = async (req,res) =>{

    const { urlId} = req.query;
    const user_id = 1

    const qrCodeDetails = await tblQrCode.findOne({
        where: { urlId },
        attributes:['imageUrl'],
        include: {
            model: Url,
            where: { user_id },
            attributes: [],
        }
    });

    if(!qrCodeDetails){
        return res.status(200).json({success:true,data:{
            imageUrl:null
        }})
    }


    return res.status(200).send({success:true,data:{
            imageUrl:qrCodeDetails.imageUrl
        }})

}

exports.getLinkDeviceBreakDown = async (req, res) => {

    let { urlId, period } = req.query;

    if (!urlId) return res.status(400).json({ msg: "Url id is required" });

    const filter = period || "7days";

    // Get current date
    let now = new Date();
    let startDate;

    switch (filter) {
        case "1year":
            startDate = new Date(now.setFullYear(now.getFullYear() - 1));
            break;
        case "6months":
            startDate = new Date(now.setMonth(now.getMonth() - 6));
            break;
        case "3months":
            startDate = new Date(now.setMonth(now.getMonth() - 3));
            break;
        case "1month":
            startDate = new Date(now.setMonth(now.getMonth() - 1));
            break;
        case "14days":
            startDate = new Date(now.setDate(now.getDate() - 14));
            break;
        default: // "7days"
            startDate = new Date(now.setDate(now.getDate() - 7));
            break;
    }


    const deviceData = await Tracking.findAll({
        attributes: [
            'deviceType',
            [fn('COUNT', '*'), 'count']
        ],
        where: {
            urlId,
            createdAt: {
                [Op.gte]: startDate
            }
        },
        group: ['deviceType']
    });

    // Create a result map with default 0s
    const result = {
        mobile: { count: 0, percentage: 0 },
        desktop: { count: 0, percentage: 0 },
        tablet: { count: 0, percentage: 0 }
    };

    let totalCount = 0;

    deviceData.forEach(entry => {
        const type = entry.getDataValue('deviceType');
        const count = parseInt(entry.getDataValue('count'));
        if (result[type] !== undefined) {
            result[type].count = count;
            totalCount += count;
        }
    });

    // Calculate percentage
    for (const type in result) {
        if (totalCount > 0) {
            result[type].percentage = parseFloat(((result[type].count / totalCount) * 100).toFixed(2));
        }
    }

    res.status(200).json(result);

}


exports.getLinkReferencePerformance = async (req, res) => {
    let { urlId, period } = req.query;

    if (!urlId) return res.status(400).json({ msg: "Url id is required" });

    const filterValue = period || "7days";
    const now = new Date();
    let startDate;

    switch (filterValue) {
        case "1year":
            startDate = new Date(now.setFullYear(now.getFullYear() - 1));
            break;
        case "6months":
            startDate = new Date(now.setMonth(now.getMonth() - 6));
            break;
        case "3months":
            startDate = new Date(now.setMonth(now.getMonth() - 3));
            break;
        case "1month":
            startDate = new Date(now.setMonth(now.getMonth() - 1));
            break;
        case "14days":
            startDate = new Date(now.setDate(now.getDate() - 14));
            break;
        default: // "7days"
            startDate = new Date(now.setDate(now.getDate() - 7));
            break;
    }

    // Get counts grouped by reference
    const rawStats = await Tracking.findAll({
        attributes: [
            'reference',
            [fn('COUNT', '*'), 'clicks']
        ],
        where: {
            urlId,
            createdAt: { [Op.gte]: startDate }
        },
        group: ['reference']
    });

    const knownReferences = ['facebook', 'youtube', 'google', 'snapchat', 'others'];
    const statsMap = {};
    let totalClicks = 0;

    // Fill stats from DB
    rawStats.forEach(entry => {
        const ref = entry.getDataValue('reference') || 'others';
        const clicks = parseInt(entry.getDataValue('clicks'), 10);
        statsMap[ref] = clicks;
        totalClicks += clicks;
    });

    // Build the final list with 0-fill for missing references
    const referenceStats = knownReferences.map(ref => {
        const clicks = statsMap[ref] || 0;
        const percentage = totalClicks === 0 ? 0 : ((clicks / totalClicks) * 100);
        return {
            reference: ref,
            clicks,
            percentage: parseFloat(percentage.toFixed(2))
        };
    });

    res.status(200).json({
        totalClicks,
        referenceStats
    });
}


exports.getLinkClicksByCountry = async (req, res) => {
    let { urlId, period } = req.query;

    if (!urlId) return res.status(400).json({ msg: "Url id is required" });

    const filter = period || "7days";

    let startDate;
    const now = new Date();
    switch (filter) {
        case "1year":
            startDate = new Date(now.setFullYear(now.getFullYear() - 1));
            break;
        case "6months":
            startDate = new Date(now.setMonth(now.getMonth() - 6));
            break;
        case "3months":
            startDate = new Date(now.setMonth(now.getMonth() - 3));
            break;
        case "1month":
            startDate = new Date(now.setMonth(now.getMonth() - 1));
            break;
        case "14days":
            startDate = new Date(now.setDate(now.getDate() - 14));
            break;
        default:
            startDate = new Date(now.setDate(now.getDate() - 7));
            break;
    }

    try {
        // Group by country
        const trackingData = await Tracking.findAll({
            attributes: [
                'country',
                [fn('COUNT', '*'), 'clicks']
            ],
            where: {
                urlId,
                createdAt: { [Op.gte]: startDate }
            },
            group: ['country'],
            order: [[fn('COUNT', '*'), 'DESC']]
        });

        // Calculate total clicks
        const totalClicks = trackingData.reduce((sum, entry) => sum + parseInt(entry.getDataValue('clicks')), 0);

        // Prepare response
        const result = trackingData.map(entry => {
            const clicks = parseInt(entry.getDataValue('clicks'));
            const country = entry.getDataValue('country') || 'Unknown';
            const percentage = totalClicks ? ((clicks / totalClicks) * 100).toFixed(2) : "0.00";

            return { country, clicks, percentage: parseFloat(percentage) };
        });

        res.status(200).json({
            totalClicks,
            countries: result
        });

    } catch (err) {
        console.error("Error in country clicks endpoint:", err);
        res.status(500).json({ msg: "Internal server error" });
    }
};

exports.checkCustomBackHalfAvailable = async (req, res) => {
  try {
    const { customBackHalf } = req.query;

    if (!customBackHalf || customBackHalf.trim() === "") {
      return res.status(400).json({
        success: false,
        msg: "Custom back half is required"
      });
    }

    const isPresent = await Url.findOne({
      where: {
        shortUrl: { [Op.eq]: customBackHalf }
      }
    });

    if (isPresent) {
      return res.status(409).json({
        success: false,
        msg: "Custom back half is already taken"
      });
    }

    return res.status(200).json({
      success: true,
      msg: "Available"
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: "Something went wrong. Please try again later"
    });
  }
};



