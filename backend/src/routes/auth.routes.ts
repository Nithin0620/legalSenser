import express from "express"

import {sendOtp , signupWithOtp , login , googleLogin , logout,checkAuth}  from "../controller/auth"
import {protectRoute} from "../middlewares/ProtectRoute"

const router = express.Router();



router.post("/signup",signupWithOtp);

router.post("/login/google",googleLogin);

router.post("/login",login)

router.post("/sendotp",sendOtp);

router.post("/logout", logout);

router.post("/checkauth",protectRoute,checkAuth)

module.exports = router;