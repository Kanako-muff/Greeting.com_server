const router = require("express").Router();
const { body } = require("express-validator");
const User = require("../models/user");
const validation = require("../handlers/validation");
const userController = require("../controllers/user");
const tokenHandler = require("../handlers/tokenHandlers");

//ユーザー新規登録API
router.post(
    "/register",
    body("username")
        .isLength({ min: 8 })
        .withMessage("Username must be at least 8 characters long."),
    body("password")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters long."),
    body("confirmPassword")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters long."),
    body("username").custom((value) => {
        return User.findOne({username: value}).then((user) => {
            if(user){
                return Promise.reject("This username is already in use.")
            }
        });
    }),
    validation.validate,
    userController.register
);

//ログイン用API
router.post(
    "/login",
    body("username")
        .isLength({ min: 8 })
        .withMessage("Username must be at least 8 characters long."),
    body("password")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters long."),
    validation.validate,
    userController.login
);

//JWT認証api
router.post("/verify-token", tokenHandler.verifyToken, (req, res) => {
    return res.status(200).json({ user:req.user });
});



module.exports = router;