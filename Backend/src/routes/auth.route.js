const express = require('express');
const router = express.Router();
const {signup, login, logout, updateProfile, checkAuth, findUser, addUserInContact } = require('../controllers/auth.controller');
const protectRoute = require('../middleware/auth.middleware');
const multer = require("multer");
const { storage } = require("../lib/cloudinary");
const upload = multer({ storage });


router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.put("/update-profile", protectRoute, upload.single("file"), updateProfile);
router.get("/check", protectRoute, checkAuth);
router.post("/user-find", protectRoute, findUser);
router.get("/add-user-contact/:id", protectRoute, addUserInContact)
module.exports = router;