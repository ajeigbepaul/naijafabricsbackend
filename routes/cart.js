const Cart = require("../models/Cart");
const {
  verifyAuthorizationuser,
  verifyAuthorizationadmin,
  verifyToken,
} = require("./verifyToken");
const router = require("express").Router();

// CREATE CART
router.post("/addproduct", verifyToken, async (req, res) => {
  const newCart = new Cart(req.body);
  try {
    const savedProduct = await newCart.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json(error);
  }
});
// UPDATE CART

router.put("/:id", verifyAuthorizationuser, async (req, res) => {
  try {
    const updatedcart = await Cart.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedcart);
  } catch (error) {
    res.status(500).json(error);
  }
});

// DELETE CART
router.delete("/:id", verifyAuthorizationuser, async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.status(200).json("cart has been deleted...");
  } catch (error) {
    res.status(500).json(error);
  }
});

// GET USER CART
router.get("find/:userId", async (req, res) => {
  try {
    const usercart = await Cart.findOne({userId:req.params.userId});
    res.status(200).json(usercart);
  } catch (error) {
    res.status(500).json(error);
  }
});

// GET ALL
router.get("/", verifyAuthorizationadmin, async (req, res) => {
  try {
      const carts = await Cart.find();
    
    res.status(200).json(carts);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
