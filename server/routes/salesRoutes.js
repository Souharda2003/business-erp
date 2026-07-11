const express = require("express");
const router = express.Router();
const auth=require("../middleware/auth");
const {
  addSales,
  getSales,
  getSalesById,
  updateSales,
  deleteSales,
  filterSales,
  searchSales,
  getTodaySales,
  getMonthlySales,
  getSalesSummary,
} = require("../controllers/salesController");

router.post("/add",auth,addSales);

router.get("/all",auth,getSales);

router.get("/filter",auth,filterSales);

router.get("/search/:keyword",auth,searchSales);

router.get("/today",auth,getTodaySales);

router.get("/monthly",auth,getMonthlySales);

router.get("/summary",auth,getSalesSummary);

router.get("/:id",auth,getSalesById);

router.put("/update/:id",auth,updateSales);

router.delete("/delete/:id",auth,deleteSales);


module.exports = router;
