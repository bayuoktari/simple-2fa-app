const router = require("express").Router();
const UserController = require("../controller/userController");
const authentication = require("../helper/authentication");

router.use(authentication);
router.post("/config", UserController.config2FA);
router.post("/verify", UserController.verify2fa);

module.exports = router;
