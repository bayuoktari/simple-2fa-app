const router = require("express").Router();
const userRoutes = require("./userRoutes");
const twoFARoutes = require("./2faRoutes");

router.use("/user", userRoutes);
router.use("/2fa", twoFARoutes);

module.exports = router;
