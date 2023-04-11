const Pay = require("../models/Pay");
const {
  verifyAuthorizationuser,
  verifyAuthorizationadmin,
} = require("./verifyToken");
const router = require("express").Router();

// POST
router.post("/", verifyAuthorizationuser, async(req, res) => {
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
router.get("/getpay", verifyAuthorizationuser, async(req, res) => {
    try {
        const allpay = await Pay.find();
    
        res.status(200).json(allpay);
      } catch (error) {
        res.status(500).json(error);
      }
  });

module.exports = router;