const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");

const {
  addGovernmentFee,
  getGovernmentFee,
  getGovernmentFeeById,
  updateGovernmentFee,
  deleteGovernmentFee,
  searchGovernmentFee,
  filterGovernmentFee,

  addGSTFee,
  getGSTFee,
  getGSTFeeById,
  updateGSTFee,
  deleteGSTFee,
  searchGSTFee,
  filterGSTFee,

  addIncomeTaxFee,
  getIncomeTaxFee,
  getIncomeTaxFeeById,
  updateIncomeTaxFee,
  deleteIncomeTaxFee,
  searchIncomeTaxFee,
  filterIncomeTaxFee,

  addTaxAuditFee,
  getTaxAuditFee,
  getTaxAuditFeeById,
  updateTaxAuditFee,
  deleteTaxAuditFee,
  searchTaxAuditFee,
  filterTaxAuditFee,

  addTDSFee,
  getTDSFee,
  getTDSFeeById,
  updateTDSFee,
  deleteTDSFee,
  searchTDSFee,
  filterTDSFee,
} = require("../controllers/accountingController");



// Government Fee
router.post("/government-fee/add", auth,addGovernmentFee);
router.get("/government-fee/all", auth,getGovernmentFee);
router.get("/government-fee/filter", auth,filterGovernmentFee);
router.get("/government-fee/search/:keyword", auth,searchGovernmentFee);
router.get("/government-fee/:id", auth,getGovernmentFeeById);
router.put("/government-fee/update/:id", auth,updateGovernmentFee);
router.delete("/government-fee/delete/:id", auth,deleteGovernmentFee);

// GST Fee
router.post("/gst-fee/add", auth,addGSTFee);
router.get("/gst-fee/all",auth, getGSTFee);
router.get("/gst-fee/filter", auth,filterGSTFee);
router.get("/gst-fee/search/:keyword", auth,searchGSTFee);
router.get("/gst-fee/:id", auth,getGSTFeeById);
router.put("/gst-fee/update/:id", auth,updateGSTFee);
router.delete("/gst-fee/delete/:id", auth,deleteGSTFee);

router.post("/income-tax-fee/add", auth, addIncomeTaxFee);
router.get("/income-tax-fee/all", auth, getIncomeTaxFee);
router.get("/income-tax-fee/filter", auth, filterIncomeTaxFee);
router.get("/income-tax-fee/search/:keyword", auth, searchIncomeTaxFee);
router.get("/income-tax-fee/:id", auth, getIncomeTaxFeeById);
router.put("/income-tax-fee/update/:id", auth, updateIncomeTaxFee);
router.delete("/income-tax-fee/delete/:id", auth, deleteIncomeTaxFee);
router.post("/tax-audit-fee/add", auth, addTaxAuditFee);
router.get("/tax-audit-fee/all", auth, getTaxAuditFee);
router.get("/tax-audit-fee/filter", auth, filterTaxAuditFee);
router.get("/tax-audit-fee/search/:keyword", auth, searchTaxAuditFee);
router.get("/tax-audit-fee/:id", auth, getTaxAuditFeeById);
router.put("/tax-audit-fee/update/:id", auth, updateTaxAuditFee);
router.delete("/tax-audit-fee/delete/:id", auth, deleteTaxAuditFee);

// TDS Fee
router.post("/tds-fee/add",auth,  addTDSFee);
router.get("/tds-fee/all",auth,  getTDSFee);
router.get("/tds-fee/filter", auth, filterTDSFee);
router.get("/tds-fee/search/:keyword", auth, searchTDSFee);
router.get("/tds-fee/:id", auth, getTDSFeeById);
router.put("/tds-fee/update/:id", auth, updateTDSFee);
router.delete("/tds-fee/delete/:id", auth, deleteTDSFee);

module.exports = router;
