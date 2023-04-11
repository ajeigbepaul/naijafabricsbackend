const Subscribe = require("../models/Subscribe");
const {
  verifyAuthorizationuser,
  verifyAuthorizationadmin,
} = require("./verifyToken");
const router = require("express").Router();

// POST
router.post("/", verifyAuthorizationuser, async(req, res) => {
    const newSub = new Subscribe({
      email: req.body.email,
    });
    try {
      const savedSub = await newSub.save();
      res.status(201).json(savedSub);
    } catch (error) {
      res.status(500).json(error);
    }
  });

  module.exports = router;