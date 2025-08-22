const express = require('express');
const router = express.Router();
const { getmessages, sendMessage } = require('../controllers/message.controller');
const protectRoute = require('../middleware/auth.middleware');
const multer = require("multer");
const { storage } = require("../lib/cloudinary");
const upload = multer({ storage });


router.get("/:id", protectRoute, getmessages);
router.post("/send/:id", protectRoute, upload.single("image"), sendMessage);
module.exports = router;    