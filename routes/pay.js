const Pay = require("../models/Pay");
const roles_list = require("../utils/roles_list");
const verifyRoles = require("../middleware/verifyRoles");
const verifyJwt = require("../middleware/verifyJwt");
const router = require("express").Router();

// test
router.get("/pay", verifyJwt, verifyRoles(roles_list.user), (req,res) =>{
  res.send('testing rolebase payment verification')
})
// POST
router.post("/", verifyJwt, verifyRoles(roles_list.user), async(req, res) => {
    const newPay = new Pay({
        fullname: req.body.fullname,
        email: req.body.email,
        amount: req.body.amount,
        reference: req.body.reference,
    });
    try {
      const savedPay = await newPay.save();
      res.status(201).json(savedPay);
    } catch (error) {
      res.status(500).json(error);
    }
  });

  // GET
router.get(
  "/getpay",
  verifyJwt,
  verifyRoles(roles_list.user),
  async (req, res) => {
    try {
      const allpay = await Pay.find();

      res.status(200).json(allpay);
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

module.exports = router;