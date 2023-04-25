import Category from "../models/Category";
import Product from "../models/Product";
const cloudinary = require("../utils/cloudinary");
const router = require("express").Router();
const roles_list = require("../utils/roles_list");
const verifyRoles = require("../middleware/verifyRoles");
const verifyJwt = require("../middleware/verifyJwt");

router.post("/", verifyJwt, verifyRoles(roles_list.admin), async (req, res) => {
  const { title, description, image, category } = req.body;
  try {
    if (image) {
      const uploadedResponse = await cloudinary.uploader.upload(image, {
        upload_preset: "naija_ecormerce",
      });
      if (uploadedResponse) {
        const product = new Product({
          title,
          description,
          image: uploadedResponse,
          category,
        });
        const savedProduct = await product.save();
        res.status(200).send(savedProduct);
      }
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// UPDATE CATEGORY
router.put(
  "/:id",
  verifyJwt,
  verifyRoles(roles_list.admin),
  async (req, res) => {
    try {
      const updatedcategory = await Category.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedcategory);
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

// DELETE CATEGORY
router.delete(
  "/:id",
  verifyJwt,
  verifyRoles(roles_list.admin),
  async (req, res) => {
    try {
      await Category.findByIdAndDelete(req.params.id);
      res.status(200).json("product has been deleted...");
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

// GET ALL PRODUCTS
router.get("/", async (req, res) => {
  try {
    const categories = await Product.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
