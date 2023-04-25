const Ankara = require("../models/Ankara");
const cloudinary = require("../utils/cloudinary");
const router = require("express").Router();
const roles_list = require("../utils/roles_list");
const verifyRoles = require("../middleware/verifyRoles");
const verifyJwt = require("../middleware/verifyJwt");

// test
router.get("/test", verifyJwt, verifyRoles(roles_list.user), (req, res) => {
  res.send("testing rolebase verification");
});
// CREATE PRODUCT
router.post("/", verifyJwt, verifyRoles(roles_list.admin), async (req, res) => {
  const {
    description,
    image,
    size,
    price,
    discount,
    moq,
    instock,
  } = req.body;

  try {
    if (image) {
      const uploadedResponse = await cloudinary.uploader.upload(image, {
        upload_preset: "naija_ecormerce",
      });
      if (uploadedResponse) {
        const product = new Ankara({
          
          description,
          image: uploadedResponse,
          size,
          price,
          discount,
          moq,
          instock,
        });
        const savedProduct = await product.save();
        res.status(200).send(savedProduct);
      }
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// UPDATE PRODUCT
router.put(
  "/:id",
  verifyJwt,
  verifyRoles(roles_list.admin),
  async (req, res) => {
    try {
      const updatedproduct = await Ankara.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedproduct);
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

// DELETE PRODUCT
router.delete(
  "/:id",
  verifyJwt,
  verifyRoles(roles_list.admin),
  async (req, res) => {
    try {
      await Ankara.findByIdAndDelete(req.params.id);
      res.status(200).json("product has been deleted...");
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

// GET A PRODUCT
router.get("/:id", async (req, res) => {
  try {
    const product = await Ankara.findById(req.params.id);
    // const { password, ...others } = product._doc;
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json(error);
  }
});

// GET ALL PRODUCTS
router.get("/", async (req, res) => {
  const qNew = req.query.new;
  const qCategory = req.query.category;

  let products;
  try {
     products = await Ankara.find().sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
