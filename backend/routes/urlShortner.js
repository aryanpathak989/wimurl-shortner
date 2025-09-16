const { urlShortner, getActualUrl,updateUrlDetails,createQrCodeForlink,createFreeLink } = require('../controller/urlShorterhandler')
const router = require('express').Router()
const { auth } = require('../middleware/auth')


router.post("/create",auth,urlShortner)
router.post("/update",auth,updateUrlDetails)
router.post("/create-qr-code",auth,createQrCodeForlink)
router.post("/create-free-link",createFreeLink)

module.exports = router
