const { User } = require("../models/User");
const router = require("express").Router();
router.get("/", async(req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204);
  const refreshToken = cookies.jwt;

//   IS REFRESH TOKEN IN DB
const user = await User.findOne({refreshToken}).exec();
if(!user){
    res.clearCookie("jwt", { httpOnly: true, sameSite:'None', secure:true });
    return res.sendStatus(204);
}
// delete refresh token in db
// user.refreshToken = user.refreshToken.filter((rt) => rt !== refreshToken);
user.refreshToken = '';
const result = await user.save()
console.log(result)

res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
return res.sendStatus(204);
});

module.exports = router;
