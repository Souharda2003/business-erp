const express = require("express");
const router = express.Router();
const auth=require("../middleware/auth");
const {
  addPayment,
  getPaymentHistory,
  deletePayment,
  filterPayment,
  getPaymentSummary,
  getPaymentById,
  updatePayment,
  
} = require("../controllers/paymentController");
const {

getPaymentLedger,

} = require("../controllers/paymentLedgerController");
router.post("/add", auth, addPayment);

router.get("/filter", auth, filterPayment);

router.get("/summary", auth, getPaymentSummary);

router.get("/history", auth, getPaymentHistory);

router.get("/ledger", auth, getPaymentLedger);

router.put("/update/:id", auth, updatePayment);

router.delete("/delete/:id", auth, deletePayment);

router.get("/:id", auth, getPaymentById);
module.exports = router;