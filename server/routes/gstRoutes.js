const express=require("express");

const router=express.Router();
const auth = require("../middleware/auth");
const{

addGST,
getGSTHistory,
filterGST,
getGSTInvoiceById,
getGSTById,
updateGST,
deleteGST,
searchGST

}=require("../controllers/gstController");

router.post("/add",auth, addGST);

router.get("/history",auth, getGSTHistory);

router.get("/filter",auth, filterGST);
router.get(

"/invoice/:id",

auth,

getGSTInvoiceById

);
router.get("/:id",auth, getGSTById);

router.put("/update/:id",auth, updateGST);

router.delete("/delete/:id",auth, deleteGST);
router.get(

"/search/:keyword",auth, 

searchGST

);
module.exports=router;