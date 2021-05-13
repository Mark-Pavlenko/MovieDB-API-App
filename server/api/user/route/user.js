const express = require("express");
const router = express.Router();
const auth = require("../../../config/auth");
const userController = require("../controller/userController");

router.post("/register", userController.registerNewUser);
router.post("/login", userController.loginUser);

//get user`s data
router.get('/getUser/:id', userController.getUser);
router.get("/me", auth, userController.getUserDetails);

//put film`s rating
router.put('/clickStarRating/:id/:rating', userController.addRating)

//insert favourite film`s id into the db
router.put('/addFilm/:id', userController.addFavouriteFilm);

//delete favourite film`s id from the db
router.delete('/removeFilm/:id', userController.removeFavouriteFilm);

module.exports = router;
