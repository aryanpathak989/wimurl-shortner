const { urlShortner, getActualUrl,updateUrlDetails,createQrCodeForlink } = require('../controller/urlShorterhandler')
const router = require('express').Router()
const { auth } = require('../middleware/auth')


router.post("/create",auth,urlShortner)
router.post("/update",auth,updateUrlDetails)
router.post("/create-qr-code",auth,createQrCodeForlink)

module.exports = router
