const User = require("../model/User");

//registration controller
exports.registerNewUser = async (req, res) => {
    try {
        let isUser = await User.find({email: req.body.email});
        console.log(isUser);
        if (isUser.length >= 1) {
            return res.status(409).json({
                message: "email already in use"
            });
        }
        const user = new User({
            name: req.body.name,
            surname: req.body.surname,
            email: req.body.email,
            password: req.body.password
        });
        let data = await user.save();
        const token = await user.generateAuthToken(); // here it is calling the method that we created in the model
        res.status(201).json({data, token});
    } catch (err) {
        res.status(400).json({err: err});
    }
};

//authorization controller
exports.loginUser = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const user = await User.findByCredentials(email, password);
        if (!user) {
            return res
                .status(401)
                .json({error: "Login failed! Check authentication credentials"});
        }
        const token = await user.generateAuthToken();
        res.status(201).json({user, token});

    } catch (err) {
        res.status(400).json({err: err});
    }
};

//add favourite film controller
exports.addFavouriteFilm = async (req, res) => {
    try {
        let isUser = await User.findOne({_id: req.body.id});
        isUser.favouriteFilms.push({film: req.body.favouriteFilms});
        const updatedUser = await isUser.save();
        res.json(updatedUser);
    } catch (err) {
        res.status(400).json({err: err});
    }
};

//remove favourite film controller
exports.removeFavouriteFilm = async (req, res) => {
    try {
        let isUser = await User.findOne({_id: req.body.id})
        let array = isUser.favouriteFilms;
        // console.log(req.body);
        // console.log(array);
        for (let i = 0; i < array.length; i++) {
            if (req.body.favouriteFilms === array[i].film) {

                // let deletedUserId = isUser._id;
                // let deletedFilmId = array[i]._id;
                // console.log(deletedUserId);
                // console.log(deletedFilmId);

                await User.findByIdAndUpdate(
                    isUser._id,
                    {$pull: {'favouriteFilms': {_id: array[i]._id}}}, function (err, updatedUser) {
                        if (err) {
                            console.log(err);
                            return res.send(err);
                        }
                        updatedUser = isUser.save();
                        return res.json(updatedUser);
                    });
            }
        }
        ;
    } catch (err) {
        console.log(err);
    }
};

//add rating to the film
exports.addRating = async (req, res) => {
    try {
        const {userId, filmId, filmRating} = req.body;
        // console.log(userId);
        // console.log(filmId);
        // console.log(filmRating);

        //fix this
        let ratingUser = await User.findById(userId);
        // console.log(ratingUser);

        if (ratingUser) {
            if (ratingUser.ratingFilms.length > 0) {
                for (let i of ratingUser.ratingFilms) {
                    if (i.filmId === filmId) {
                        i.filmRating = filmRating;
                        const updatedUser = await ratingUser.save();
                        console.log(updatedUser);
                        return res.json({ratingUser: updatedUser, message: `fILM NAME ALREADY EXIST ${filmRating}`})
                    }
                }
            }
            ratingUser.ratingFilms.push({
                filmId: req.body.filmId,
                filmRating: req.body.filmRating
            });
            const ratingFilm = await ratingUser.save();
            res.json(ratingFilm);
        }
    } catch (err) {
        console.log(err);
    }
};

//add film to featured
exports.addFeaturedFilm = async (req, res) => {
    try {
        const {userId, filmId, filmRating} = req.body;
        // console.log(userId);
        // console.log(filmId);
        // console.log(filmRating);

        let ratingUser = await User.findById(userId);
        // console.log(ratingUser);

        if (ratingUser) {
            if (ratingUser.featuredFilms.length > 0) {
                for (let i of ratingUser.featuredFilms) {
                    if (i.filmId === filmId) {
                        i.filmRating = filmRating;
                        const updatedUser = await ratingUser.save();
                        console.log(updatedUser);
                        return res.json({ratingUser: updatedUser, message: `fILM NAME ALREADY EXIST ${filmRating}`})
                    }
                }
            }
            ratingUser.featuredFilms.push({
                filmId: req.body.filmId,
                filmRating: req.body.filmRating
            });
            const ratingFilm = await ratingUser.save();
            res.json(ratingFilm);
        }
    } catch (err) {
        console.log(err);
    }
};

//get all users data
exports.getAllUsersData = async (req, res) => {
    const allUsersData = await User.find();
    console.log(req.params);
    return res.json(allUsersData);
}

// //get user details
exports.getUser = async (req, res) => {
    const updatedUser = await User.findOne({_id: req.params.id});
    return res.json(updatedUser);
};

exports.getUserDetails = async (req, res) => {
    await res.json(req.userData);
};