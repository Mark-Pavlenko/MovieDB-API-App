const express = require("express");
const router = express.Router();

const User = require("../server/api/user/model/User");

router.post("/movie/:id", async (req, res) => {
    //req.params get parameters in the url
    console.log(req.params)
    await User.findByIdAndUpdate(req.params.id, req.body);
    res.json({
        status: "Task Updated",
    });
});