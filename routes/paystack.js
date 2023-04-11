const router = require("express").Router();
const Pay = require("../models/Pay");
const _ = require('lodash');
const {
    initiatePaystackPayment,
    validatePaystackPayment,
    verifyAccount,
    createTransferRecip,
    initiateTrans,
    initiatePaystackWithdrawal,
  } = require("../utils/paystack");
  const StatusCodes = require("../utils/statuscode")
const { verifyToken } = require("./verifyToken");

router.post("/pay", verifyToken, async (req, res) => {
    const paydetails = new Pay(req.body);
    try {
      const savedpaydetails = await paydetails.save();
      res.status(StatusCodes.CREATED).json({
        status: "success",
        message: "payment successful ",
        savedpaydetails
      });
    } catch (error) {
      console.log(error)
        // res.status(StatusCodes.SERVER_ERROR).json({
        //     status: "failed",
        //     message: "server error",
        //     error: error,
        //   });
    }
  });

  router.post("/verify/account", verifyToken, async(req, res)=>{
    try {
      
        const { data } = await verifyAccount(
          req.body.account_number,
          req.body.bank_code
        );
    
        if (!data) {
          return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ 
             status: "failed",
             message: "Account Number not verified" ,
             error: "Account Number not verified" ,
            });
        }
        
        res.status(StatusCodes.CREATED).json({
          status: "success",
          message:" Account Number  Resolved",
          data,
        });
      } catch (error) {
        res.status(StatusCodes.SERVER_ERROR).json({
          status: "failed",
          error: error.error?.message,
        });
        console.log(error);
      }
  })
  
  router.post("/transfer/recipient", verifyToken, async(req, res)=>{
    try {
        const { data } = await createTransferRecip(
          req.body.account_name,
          req.body.account_number,
          req.body.bank_code
        );
    
    
        if (!data) {
          return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ 
             status: "failed",
             message: "Recipient not Created" ,
             error: "Recipient not Created" ,
            });
        }
        res.status(StatusCodes.CREATED).json({
          status: "success",
          message:" Recipient created Successfully",
          data,
        });
      } catch (error) {
        res.status(StatusCodes.SERVER_ERROR).json({
          status: "failed",
          error: error?.error?.message,
        });
        console.log(error);
      }

})

router.post("/initiate/transfer", verifyToken, async(req, res)=>{
    try {
        const { data } = await initiateTrans(
          req.body.amount,
          req.body.recipient_code,
          req.body.reason
        );
    
    
        if (!data) {
          return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ 
             status: "failed",
             message: "Recipient not Created" ,
             error: "Recipient not Created" ,
            });
        }
        res.status(StatusCodes.CREATED).json({
          status: "success",
          message:" Recipient created Successfully",
          data,
        });
      } catch (error) {
        res.status(StatusCodes.SERVER_ERROR).json({
          status: "failed",
          error: error?.error?.message,
        });
        console.log(error);
      }
})
  
  
  
  
  

module.exports = router