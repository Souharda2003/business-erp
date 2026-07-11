const express=require("express");

const router=express.Router();

const {

getAllUsers,

deleteUser,

changeStatus

}=require("../controllers/userController");

router.get("/all",getAllUsers);

router.delete("/:id",deleteUser);

router.put("/status",changeStatus);

module.exports=router;