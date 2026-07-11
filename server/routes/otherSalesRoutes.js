const express = require("express");

const router = express.Router();
const auth = require("../middleware/auth");

const {
  
  addOtherSales,
  getAllOtherSales,
  getOtherSalesById,
  updateOtherSales,
  deleteOtherSales,
  searchOtherSales,
  filterOtherSales
  
} = require("../controllers/otherSalesController");
router.post("/add", auth, addOtherSales);

router.get("/all", auth, getAllOtherSales);

router.get("/filter", auth, filterOtherSales);

router.get("/search/:keyword", auth, searchOtherSales);

router.get("/:id", auth, getOtherSalesById);

router.put("/update/:id", auth, updateOtherSales);

router.delete("/delete/:id", auth, deleteOtherSales);

module.exports=router;