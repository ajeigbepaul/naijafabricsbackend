const router = require("express").Router();
// const sendMail = require("../utils/nowSendMail");
const { User } = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// AUTH

router.post("/", async (req, res) => {
  try {
    const cookies = req.cookies;
    const user = await User.findOne({ email: req.body.email });
    if (!user)
      return res.status(401).send({ message: "Invalide email or password" });
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword)
      return res.status(401).send({ message: "Invalid Email or Password" });
    const roles = Object.values(user.roles).filter(Boolean);
    // Generate Token
    const accessToken = jwt.sign(
      {
        id: user._id,
        email: user.email,
        roles: roles,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30s" }
    );
    const newrefreshToken = jwt.sign(
      {
        email: user.email,
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1hr" }
    );

    let newRefreshTokenArray = !cookies?.jwt
      ? user.refreshToken
      : user.refreshToken.filter((rt) => rt !== cookies.jwt);
    if (cookies?.jwt) {
      const refreshToken = cookies.jwt;
      const foundToken = await User.findOne({ refreshToken }).exec();
      // detects refresh token reuse
      if (!foundToken) {
        console.log("attempted refresh token reuse at login");
        newRefreshTokenArray = [];
      }
      res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "None",
        secure: true,
      });
    }

    // saving refreshToken with current user
    user.refreshToken = [...newRefreshTokenArray, newrefreshToken];
    const result = await user.save();
    console.log(result);
    console.log(roles);
    const { password, ...others } = user._doc;
    //  Create secure cookie with refresh token
    res.cookie("jwt", newrefreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.status(200).send({
      ...others,
      accessToken,
      message: "Logged in Successfully",
    });
    // res.status(200).send({data:token, message:"Logged in Successfully"})
  } catch (error) {
    res.status(500).send({ message: "Internal server error" });
  }
});

module.exports = router;
