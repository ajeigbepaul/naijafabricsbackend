const router = require("express").Router();
const { User, validate } = require("../models/User");
const bcrypt = require("bcrypt");
// const {
//   verifyAuthorizationuser,
//   verifyAuthorizationadmin,
// } = require("./verifyToken");
// UPDATE USER

// router.put("/:id", verifyAuthorizationuser, async (req, res) => {
//   if (req.body.password) {
//     req.body.password = CryptoJS.AES.encrypt(
//       req.body.password,
//       process.env.PASSKEY
//     ).toString();
//   }
//   try {
//     const updateduser = await User.findByIdAndUpdate(
//       req.params.id,
//       {
//         $set: req.body,
//       },
//       { new: true }
//     );
//     res.status(200).json(updateduser);
//   } catch (error) {
//     res.status(500).json(error);
//   }
// });

// DELETE
// router.delete("/:id", verifyAuthorizationuser, async (req, res) => {
//   try {
//     await User.findByIdAndDelete(req.params.id);
//     res.status(200).json("user has been deleted...");
//   } catch (error) {
//     res.status(500).json(error);
//   }
// });

// GET USER
// router.get("/find/:id", verifyAuthorizationadmin, async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id);
//     const { password, ...others } = user._doc;
//     res.status(200).json(others);
//   } catch (error) {
//     res.status(500).json(error);
//   }
// });

// GET ALL USER
// router.get("/", verifyAuthorizationadmin, async (req, res) => {
//   const query = req.query.new;
//   try {
//     const users = query
//       ? await User.find().sort({ _id: -1 })
//       : await User.find();
//     res.status(200).json(users);
//   } catch (error) {
//     res.status(500).json(error);
//   }
// });
// GET USER STATS
// router.get("/stats", verifyAuthorizationadmin, async (req, res) => {
//   const date = new Date();
//   const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

//   try {
//     const data = await User.aggregate([
//       { $match: { createdAt: { $gte: lastYear }, }, },
//       { $project: { month: { $month: "$createdAt" } } },
//       { $group: { _id: "$month", total: { $sum: 1 } } },
//     ]);
//     res.status(200).json(data);
//   } catch (error) {
//     res.status(500).json(error);
//   }
// });



// Get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find().select("-password").lean();
    if (!users?.length) {
      return res.status(400).sendStatus({ message: "no users found" });
    }
    res.send(users);
  } catch (error) {
    res.status(500).send({ message: "Internal server error" });
  }
});
// Register or Create
router.post("/", async (req, res) => {
  try {
    // Confirms the data
    const { error } = validate(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });
    // Checks for duplicate
    const user = await User.findOne({ email: req.body.email });
    if (user)
      return res
        .status(409)
        .send({ message: "User with given email already exist" });
    // Hash password
    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    await new User({ ...req.body, password: hashPassword }).save();
    res.status(201).send({ message: "User created successfully" });
  } catch (error) {
    res.status(500).send({ message: "Internal server error" });
  }
});
// Update User
router.put("/update", async (req, res) => {
  const { id, firstname, lastname, roles, active, email, password } = req.body;
  if (
    !id ||
    !firstname ||
    !lastname ||
    !email ||
    !roles ||
    //   !Array.isArray(roles) ||
    //   !roles.length ||
    typeof active !== "boolean"
  ) {
    return res.sendStatus(400).send({ message: "All fields are required" });
  }
  const user = await User.findById(id).exec();
  if (!user) return res.status(400).send({ message: "User not found" });
  // check for duplicate
  const duplicate = await User.findOne({ email });
  if (duplicate)
    return res
      .status(409)
      .send({ message: "User with given email already exist" });

  user.firstname = firstname;
  user.lastname = lastname;
  user.email = email;
  user.roles = roles;
  user.active = active;

  if (password) {
    user.password = await bcrypt.hash(password, 10);
  }
  const updatedUser = await user.save();
  res.send({ message: `${updatedUser.email} updated` });
});

module.exports = router;