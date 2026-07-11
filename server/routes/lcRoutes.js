const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
    
    addLC,
    
    getCurrentLC,
    
    getAllLC,
    
    getLCById,
    
    updateLC,
    
    deleteLC,
    filterLC,
    searchLC
    
} = require("../controllers/lcController");


router.post("/add", auth, addLC);

router.get("/filter", auth, filterLC);

router.get("/current", auth, getCurrentLC);

router.get("/all", auth, getAllLC);

router.get("/search/:keyword", auth, searchLC);

router.get("/:id", auth, getLCById);

router.put("/update/:id", auth, updateLC);

router.delete("/delete/:id", auth, deleteLC);

module.exports = router;