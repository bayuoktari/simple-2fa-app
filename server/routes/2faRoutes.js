const router = require("express").Router();
const UserController = require("../controller/userController");
const authentication = require("../helper/authentication");

router.use(authentication);
router.post("/generate", UserController.generate2FA);
router.post("/enable", UserController.enable2fa);
router.post("/disable", UserController.disable2fa);
router.post("/verify", UserController.verify2fa);

module.exports = router;
