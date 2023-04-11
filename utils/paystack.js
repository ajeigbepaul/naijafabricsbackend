const dotenv = require("dotenv");

dotenv.config();
const paystack = require("paystack")(process.env.PAYSTACK_KEY);
const paystack_api = require("paystack-api")(process.env.PAYSTACK_KEY);

exports.initiatePaystackPayment = async (amount, email, name, reference) => {
  const params = {
    amount: amount * 100,
    email: email,
    name: name,
    reference: reference,
  };

  const data = await paystack.transaction.initialize(params);

  return data;
};

exports.validatePaystackPayment = async (reference) => {
  const data = await paystack.transaction.verify(reference);

  return data;
};

// initiating paystack transfer/ withdrawal
exports.initiatePaystackWithdrawal = async (
  amount,
  source,
  recipient,
  reason
) => {
  const params = {
    source: source,
    reason: reason,
    amount: amount,
    recipient: recipient,
  };

  console.log(params);
  const data = await paystack.transfer.create(params);

  return data;
};

exports.verifyAccount = async (account_number, bank_code) => {
    

    const params={
        account_number,
        bank_code
    }
    const data = await paystack_api.verification.resolveAccount(params);
    // console.log({params:data});
  
    return data;
  };


  exports.createTransferRecip = async (account_name, account_number, bank_code) => {
    const params={
        type:"nuban",
        name:account_name,
        account_number,
        bank_code,
        currency: "NGN"
    }
    const data = await paystack_api.transfer_recipient.create(params);
    // console.log({params});
  

    return data;
  };



  exports.initiateTrans = async (amount, recipient_code, reason) => {
    const params={
        source:"balance",
        amount: amount * 100,
        recipient:recipient_code,
        reason:reason ? reason : "Transfer made from my Wallet Account",
        
    }
    const data = await paystack_api.transfer.create(params);
    // console.log({params});
  

    return data;
  };