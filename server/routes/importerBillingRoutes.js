const express = require("express");

const router = express.Router();
const auth=require("../middleware/auth");
const {

  saveImporterBilling,

  getImporterBilling,

  getImporterBillingById,

  updateImporterBilling,

  deleteImporterBilling,

  filterImporterBilling,

  searchImporterBillingByLC,

  searchImporterBillingByName,

} = require("../controllers/importerBillingController");


router.post("/",auth,saveImporterBilling);

router.get("/",auth,getImporterBilling);

router.get("/filter",auth,filterImporterBilling);

router.get("/search",auth,searchImporterBillingByLC);

router.get("/search-name",auth,searchImporterBillingByName);

router.get("/:id",auth,getImporterBillingById);

router.put("/:id",auth,updateImporterBilling);

router.delete("/:id",auth,deleteImporterBilling);
module.exports = router;
