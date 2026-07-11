const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");

const {
  addDrawback,
  getAllDrawback,
  getDrawbackById,
  updateDrawback,
  deleteDrawback,
  searchDrawback,
  filterDrawback,
  getInvoiceList,
  getProductList,
} = require("../controllers/drawbackController");

// Add
router.post("/add", auth, addDrawback);

// Invoice List
router.get("/invoice-list", auth, getInvoiceList);

// Product List
router.get("/product-list", auth, getProductList);

// All
router.get("/all", auth, getAllDrawback);

// Filter
router.get("/filter", auth, filterDrawback);

// Search
router.get("/search/:keyword", auth, searchDrawback);

// Single
router.get("/:id", auth, getDrawbackById);

// Update
router.put("/update/:id", auth, updateDrawback);

// Delete
router.delete("/delete/:id", auth, deleteDrawback);

module.exports = router;
