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

//add rating to the film
exports.addRating = async (req, res) => {
    try {
        const userId = req.body._id;
        const {filmId, filmRating} = req.body;
        // console.log(userId);
        console.log(filmId);
        console.log(filmRating);
        let ratingUser = await User.findOne({userId});
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
        res.sendStatus(400).json({err: err});
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

//controller to remove all favourite films ???
exports.removeFavouriteFilm = async (req, res) => {
    try {
        let isFilm = await User.findOne({_id: req.body.id});
        isFilm.favouriteFilms.splice({film: req.body.favouriteFilms})
        const updatedUser = await isFilm.save();
        res.json(updatedUser);
    } catch (err) {
        res.status(400).json({err: err});
    }
};


// //get user details
exports.getUser = async (req, res) => {
    const updatedUser = await User.findOne({_id: req.params.id});
    console.log(req.params.id)
    return res.json(updatedUser);
};

exports.getUserDetails = async (req, res) => {
    await res.json(req.userData);
};