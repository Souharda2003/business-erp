const express = require("express");

const router = express.Router();
const auth = require("../middleware/auth");
const {
  saveCompany,
  
  getCompany,
  
  updateCompany,
  
  deleteCompany,
} = require("../controllers/companyController");

router.post("/save", auth, saveCompany);

router.get("/", auth, getCompany);

router.put("/update/:id", auth, updateCompany);

router.delete("/delete/:id", auth, deleteCompany);


module.exports = router;
