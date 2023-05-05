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
const ankaraRoute = require("./routes/ankara");
const orderRoute = require("./routes/order");
const cartRoute = require("./routes/cart");
const payRoute = require("./routes/pay");
const statusRoute = require("./routes/status");
const refreshRoutes = require("./routes/refreshToken");
const uploadimagesRoute = require("./routes/uploadimages")
const logOutRoute = require('./routes/logout')
const verifyJwt = require("./middleware/verifyJwt");




// APP CONNECTION
const app = express();
// mongoose.connect(process.env.MONGO_URL,{ useNewUrlParser: true, useUnifiedTopology: true });
// DB CONNECTION
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log(conn.connection.host)
    console.log("Db connected")
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
// http://localhost:3000
app.use(cors({ credentials: true, origin: '*' }));
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
app.use("/ankaras", ankaraRoute);
app.use("/carts", cartRoute);
app.use("/orders", orderRoute);
app.use("/payments", payRoute);
app.use("/status", statusRoute);
app.use("/images", uploadimagesRoute)
// app.use("/uploads", uploadRoute);

// LISTEN
//  app.listen(process.env.PORT || 8000, () => {
//    console.log("server running, listening for requests");
//  });
connectDB().then(() => {
  app.listen(process.env.PORT || 8000, () => {
    console.log("server running, listening for requests");
  });
});
   


