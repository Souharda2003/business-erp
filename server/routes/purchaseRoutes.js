const express=require("express");

const router=express.Router();

const auth=require("../middleware/auth");

const{

addPurchase,
getPurchase,
getPurchaseById,
updatePurchase,
deletePurchase,
filterPurchase

}=require("../controllers/purchaseController");

router.post("/",auth,addPurchase);

router.get("/filter",auth,filterPurchase);

router.get("/all",auth,getPurchase);

router.get("/:id",auth,getPurchaseById);

router.put("/update/:id",auth,updatePurchase);

router.delete("/delete/:id",auth,deletePurchase);

module.exports=router;