const express = require('express');
const router = express.Router();
const { getAllUsers, getmessages, sendMessage } = require('../controllers/message.controller');
const protectRoute = require('../middleware/auth.middleware');
const multer = require("multer");
const { storage } = require("../lib/cloudinary");
const upload = multer({ storage });


router.get("/users", protectRoute, getAllUsers);
router.get("/:id", protectRoute, getmessages);
router.post("/send/:id", protectRoute, upload.single("image"), sendMessage)
module.exports = router;