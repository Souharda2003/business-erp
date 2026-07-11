const express = require("express");

const router = express.Router();
const auth = require("../middleware/auth");
const {

  addRODTEP,

  getRODTEP,

  getRODTEPById,

  updateRODTEP,

  deleteRODTEP,

  searchRODTEP,

  filterRODTEP,

} = require("../controllers/rodtepController");


/* Add */

router.post("/add",auth, addRODTEP);


/* Get All */

router.get("/all", auth,getRODTEP);


/* Search */

router.get("/search/:keyword",auth, searchRODTEP);


/* Filter */

router.get("/filter", auth,filterRODTEP);


/* Get By Id */

router.get("/:id",auth, getRODTEPById);
router.put("/update/:id",auth, updateRODTEP);


/* Delete */

router.delete("/delete/:id",auth, deleteRODTEP);

module.exports = router;