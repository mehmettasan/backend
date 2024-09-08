const WithdrawRequest = require("../models/withdrawRequest.js");

exports.handleWithdrawRequest = async (req, res) => {
  try {
    const { userID, item } = req.body;
    let existingRequest = await WithdrawRequest.findOne({ userID });

    if (existingRequest) {
      existingRequest.items.push(item);
    } else {
      existingRequest = new WithdrawRequest({
        userID,
        items: [item],
      });
    }
    await existingRequest.save();
    res
      .status(200)
      .json({
        message: "withdraw işlemi başarılı bir şekilde gerçekleştirildi",
      });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error processing withdraw request.",
        error: error.message,
      });
  }
};
