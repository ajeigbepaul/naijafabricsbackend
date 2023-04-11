const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const cookieParser = require("cookie-parser");
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const productRoute = require("./routes/product");
const orderRoute = require("./routes/order");
const cartRoute = require("./routes/cart");
const payRoute = require("./routes/paystack");
const statusRoute = require("./routes/status");
const refreshRoutes = require("./routes/refreshToken");
const uploadimagesRoute = require("./routes/uploadimages")
const logOutRoute = require('./routes/logout')
// const verifyJWT = require("./middleswares/verifyJWT");
const verifyJwt = require("./middleware/verifyJwt");
const verifyRoles = require("./middleware/verifyRoles");
const roles_list = require("./utils/roles_list")




// APP CONNECTION
const app = express();
// mongoose.connect(process.env.MONGO_URI,{ useNewUrlParser: true, useUnifiedTopology: true });
// DB CONNECTION
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

// MIDDLEWARE
app.use(morgan("tiny"));
app.use("/images", express.static(path.join(__dirname, "public")));
app.use(
  express.json({
    limit: "50mb",
    parameterLimit: 100000,
    extended: true,
  })
);
app.use(cors({ credentials: true, origin: "http://localhost:3001" }));
app.use(cookieParser());
// TEST ROUTE
app.get("/",(req,res)=>{res.send("working fine")})
// app.use(verifyJwt)
// verifyRoles(roles_list.user,roles_list.admin)
app.get("/testing", verifyJwt, (req, res) => {
  res.send("testing working fine");
});

app.post("/email", (req,res)=>{
  res.json({message:"mail sent"})
})

// ROUTES
app.use("/users", userRoute);
app.use("/auth", authRoute);
app.use("/refresh", refreshRoutes);
app.use('/logout',logOutRoute);

// app.use(verifyJwt);
app.use("/products", productRoute);
app.use("/carts", cartRoute);
app.use("/orders", orderRoute);
app.use("/payments", payRoute);
app.use("/status", statusRoute);
app.use("/images", uploadimagesRoute)
// app.use("/uploads", uploadRoute);

// LISTEN
connectDB().then(() => {
  app.listen(process.env.PORT || 8000, () => {
    console.log("server running, listening for requests");
  });
});
   


