const express = require("express");
const router = express.Router();
const auth = require("../../../config/auth");
const userController = require("../controller/userController");

router.post("/register", userController.registerNewUser);
router.post("/login", userController.loginUser);
router.get("/me", auth, userController.getUserDetails);

//insert film`s id into the db
router.put('/addFilm/:id', userController.addFavouriteFilm);
router.get('/getUser/:id', userController.getUser);

//delete film`s id into the db
router.delete('/removeFilm/:id', userController.removeFavouriteFilm);

module.exports = router;
