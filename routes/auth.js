const router = require("express").Router();
const { User } = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

router.post("/", async (req, res) => {
  try {
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
    // const token = user.generateAuthToken();
    const accessToken = jwt.sign(
      {
        id: user._id,
        email: user.email,
        roles: roles,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );
    const refreshToken = jwt.sign(
      {
        email: user.email,
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "30m" }
    );
    const { password, ...others } = user._doc;
    // save refreshToken with current user
    user.refreshToken = refreshToken;
    const result = await user.save()
    console.log(result)
    console.log(roles)
    //  Create secure cookie with refresh token
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite:'None',
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
