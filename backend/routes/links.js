const router = require('express').Router()
const {getLinkClickPerformance,getLinkDeviceBreakDown,getLinkReferencePerformance,getLinkClicksByCountry,getQrCode,checkCustomBackHalfAvailable} = require('../controller/linkHandler');
const { auth } = require('../middleware/auth');

router.get("/getLinkClickPerformance",auth,getLinkClickPerformance)
router.get("/getLinkDeviceBreakDown",auth,getLinkDeviceBreakDown)
router.get("/getLinkReferencePerformance",auth,getLinkReferencePerformance)
router.get("/getLinkClicksByCountry",auth,getLinkClicksByCountry)
router.get("/getQrDetails",auth,getQrCode)
router.get("/checkCustomBackHalfAvailable",auth,checkCustomBackHalfAvailable)

module.exports = router; 