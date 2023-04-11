const Order = require("../models/Order");
const {
  verifyAuthorizationuser,
  verifyAuthorizationadmin,
  verifyToken,
} = require("./verifyToken");
const router = require("express").Router();

// CREATE ORDER
router.post("/order", verifyToken, async (req, res) => {
  const neworder = new Order(req.body);
  try {
    const savedorder = await neworder.save();
    res.status(201).json(savedorder);
  } catch (error) {
    res.status(500).json(error);
  }
});
// UPDATE ORDER

router.put("/:id", verifyAuthorizationadmin, async (req, res) => {
  try {
    const updatedorder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedorder);
  } catch (error) {
    res.status(500).json(error);
  }
});

// DELETE ORDERS
router.delete("/:id", verifyAuthorizationadmin, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json("Order has been deleted...");
  } catch (error) {
    res.status(500).json(error);
  }
});

// GET USER ORDERS
router.get("/:userId", verifyToken, async (req, res) => {
  try {
    const userorders = await Order.find({ userId: req.params.userId });
    res.status(200).json(userorders);
  } catch (error) {
    res.status(500).json(error);
  }
});

// GET ALL ORDERS
router.get("/", verifyAuthorizationadmin, async (req, res) => {
  try {
    const allorders = await Order.find().sort({ _id: -1 });

    res.status(200).json(allorders);
  } catch (error) {
    res.status(500).json(error);
  }
});

// GET MONTHLY INCOME
router.get("/income", verifyAuthorizationadmin, async(req, res) => {
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));
  try {
    const income = await Order.aggregate([
      { $match: { createdAt: { $gte: previousMonth } } },
      { $project: { month: { $month: "$createdAt" }, sales: "$amount" } },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
        },
      },
    ]);
    res.status(200).json(income)
  } catch (error) {
    res.status(500).json(error);
  }
});

// UPDATE STATUS
router.put("status/:id", verifyAuthorizationadmin, async (req, res) => {
  try {
    const updatedorder = await Order.findByIdAndUpdate(
      req.params.id,
      { set: { status: req.body.status } },
      { new: true }
    );
    res.status(200).json(updatedorder);
  } catch (error) {
    res.status(500).json(error);
  }
});

// exports.updateStatus = (req, res) => {  
//   Order.findOneAndUpdate(
//      { _id: req.body.orderId },
//      { set: { status: req.body.status } },
//      { new: true },
//      (err, order) => {
//      if (err) {
//          return res.status(400).json({error: "Cannot update order status"});
//      }
//      res.json(order);
//   });
// };


module.exports = router;
