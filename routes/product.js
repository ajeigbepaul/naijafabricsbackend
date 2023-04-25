const Product = require("../models/Product");
const cloudinary = require("../utils/cloudinary");
const router = require("express").Router();
const roles_list = require("../utils/roles_list")
const verifyRoles = require("../middleware/verifyRoles")
const verifyJwt = require("../middleware/verifyJwt")




// test
router.get("/test", verifyJwt, verifyRoles(roles_list.user), (req,res) =>{
  res.send('testing rolebase verification')
})
// CREATE PRODUCT
router.post(
  "/",
  verifyJwt,
  verifyRoles(roles_list.admin),
  async (req, res) => {
    const {
      title,
      description,
      image,
      categories,
      colors,
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
          const product = new Product({
            title,
            description,
            image: uploadedResponse,
            categories,
            colors,
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
  }
);


// UPDATE PRODUCT
router.put(
  "/:id",
  verifyJwt,
  verifyRoles(roles_list.admin),
  async (req, res) => {
    try {
      const updatedproduct = await Product.findByIdAndUpdate(
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
      await Product.findByIdAndDelete(req.params.id);
      res.status(200).json("product has been deleted...");
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

// GET A PRODUCT
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
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
    if (qNew) {
      products = await Product.find().sort({ createdAt: -1 }).limit(5);
    } else if (qCategory) {
      products = await Product.find({ categories: { $in: [qCategory], }, },);
    } else {
      products = await Product.find();
    }
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
