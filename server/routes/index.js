const router = require("express").Router();
const userRoutes = require("./userRoutes");
const twoFARoutes = require("./2faRoutes");
const { verifyToken } = require("../helper/jwt");

router.use("/user", userRoutes);
router.use("/2fa", twoFARoutes);
router.post("/jwtvalidate", (req, res) => {
  const token = verifyToken(req.headers.access_token);
  res.status(202).json({ status: true });
});

module.exports = router;
