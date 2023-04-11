const router = require("express").Router();
const { User } = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();

router.get("/", async (req, res) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.jwt)
      return res.sendStatus(401).send({ message: "Unauthorized" });
    console.log(cookies.jwt);
    const refreshToken = cookies.jwt
    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "None",
      secure: true,
    });

    const user = await User.findOne({ refreshToken }).exec();
    if (!user) {
      jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, decoded) => {
          if (err) return res.sendStatus(403);
          const hackedUser = await User.findOne({
            email: decoded.email,
          }).exec();
          hackedUser.refreshToken = [];
          const result = await hackedUser.save();
          console.log(result);
        }
      );
      return res.sendStatus(403);
    }

    const newRefreshTokenArray = user.refreshToken.filter(
      (rt) => rt !== refreshToken
    );
    // Generate refreshToken
    // const refreshToken = cookies.jwt;
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) {
          user.refreshToken = [...newRefreshTokenArray];
          const result = await user.save();
          console.log(result)
        }
        if (err || User.email !== decoded.email)
          return res.sendStatus(403);
        const roles = Object.values(user.roles);
        const accessToken = jwt.sign(
          {
            id: decoded._id,
            email: decoded.email,
            roles: roles,
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "30s" }
        );

        // new refresh token
        const newrefreshToken = jwt.sign(
          {
            email: user.email,
          },
          process.env.REFRESH_TOKEN_SECRET,
          { expiresIn: "15s" }
        );
        // saving refreshToken with current user
        user.refreshToken = [...newRefreshTokenArray, newrefreshToken];
        const result =await user.save();


        res.cookie("jwt", newrefreshToken, {
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000,
        });
        res.json({
          accessToken,
        });
      }
    );
  } catch (error) {
    res.status(500).send({ message: "Internal server error" });
  }
});
module.exports = router;
