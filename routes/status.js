const Order = require("../models/Order");
const {
  verifyAuthorizationuser,
  verifyAuthorizationadmin,
  verifyToken,
} = require("./verifyToken");
const router = require("express").Router();


// UPDATE STATUS
router.put("/:id", verifyAuthorizationadmin, async (req, res) => {
    try {
      const updatedorder = await Order.updateOne(
        req.params.id,
        { set: { status: req.body.status } },
        { new: true }
      );
      res.status(200).json(updatedorder);
    } catch (error) {
      res.status(500).json(error);
    }
  });

  module.exports = router;