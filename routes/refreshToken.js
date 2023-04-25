const router = require("express").Router();
const { User } = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();

router.get("/", async (req, res) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.jwt)
      return res.sendStatus(401);
    console.log(cookies.jwt);
    // Generate refreshToken
    const refreshToken = cookies.jwt;
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) return res.sendStatus(403);
        const user = await User.findOne({ email: decoded.email });
        if (!user) return res.sendStatus(401);
        const accessToken = jwt.sign(
          {
            id: decoded._id,
            email: decoded.email,
            roles: decoded.roles,
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "15m" }
        );

        res.send({
          accessToken,
        });
      }
    );

    // res.status(200).send({data:token, message:"Logged in Successfully"})
  } catch (error) {
    res.status(500);
  }
});
module.exports = router;
