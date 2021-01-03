const router = require("express").Router();
const UserController = require("../controller/userController");
const authentication = require("../helper/authentication");

router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.use(authentication);
router.get("/", UserController.getUserDetail);

module.exports = router;
